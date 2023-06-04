const moment = require('moment');
class UserService {
  constructor({
    userRepository,
    messageRepository,
  }) {
    this.userRepository = userRepository;
    this.messageRepository = messageRepository;
  }

  async show() {
    const users = await this.userRepository.findAll();

    return users;
  }

  async create(data) {
    const user = await this.userRepository.create(data);

    return user;
  }

  async search({
    limit=15,
    page=0,
    order,
    sort,
  }) {
    const users = await this.userRepository.findAll({
      offset: parseInt(page) * parseInt(limit),
      limit: parseInt(limit) || undefined,
      order: [[ sort || 'createdAt', order || 'ASC' ]],
      raw: true,
    });

    const count = await this.userRepository.count();

    return {
      users,
      count,
    };
  }

  async getChatByUserId(id) {
    const messages = await this.messageRepository.findAll({
      where: {
        userId: id,
        success: true,
      },
      order: [['createdAt', 'ASC']],
    });

    const chat = {};

    messages.forEach(message => {
      const date = moment(message.createdAt).startOf('day');
      let strDate = date.format('DD/MM/yyyy');

      if (date.isSame(moment().startOf('day'))) {
        strDate = 'Hoje';
      }

      if (date.isSame(moment().subtract(1, 'days').startOf('day'))) {
        strDate = 'Ontem';
      }

      const handledMessage = {
        ...message.dataValues,
        time: moment(message.createdAt).format('HH::mm'),
      };

      if (chat[strDate]) {
        chat[strDate].push(handledMessage);
      } else {
        chat[strDate] = [
          handledMessage,
        ];
      }
    });

    return chat;
  }

  async updateStatus(id, status) {
    await this.userRepository.update(
      id,
      {
        status,
      }
    );
  }

  handleSchedule(schedule) {
    const newSchedule = schedule.split(/\D+/);

    if (newSchedule.length !== 2) return false;

    if (isNaN(newSchedule[0])) return false;
    if (parseInt(newSchedule[0]) > 23 || parseInt(newSchedule[0]) < 0) return false;

    if (isNaN(newSchedule[0])) return false;
    if (parseInt(newSchedule[0]) > 59 || parseInt(newSchedule[0]) < 0) return false;

    return `${newSchedule[0]}:${newSchedule[1] === '' ? '00' : newSchedule[1]}`;
  }
}

module.exports.default = UserService;
