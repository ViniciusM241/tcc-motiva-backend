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
    offset=0,
    order,
    sort,
  }) {
    const users = await this.userRepository.findAll({
      offset: parseInt(offset),
      limit: parseInt(limit) || undefined,
      order: [[ sort || 'createdAt', order || 'ASC' ]],
    });

    return users;
  }

  async getChatByUserId(id) {
    const chat = await this.messageRepository.findAll({
      where: {
        userId: id,
        success: true,
      },
      order: [['createdAt', 'DESC']],
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
