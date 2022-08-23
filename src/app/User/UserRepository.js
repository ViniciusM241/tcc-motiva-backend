class UserRepository {
  constructor({
    userModel,
  }) {
    this.userModel = userModel.sequelize();
  }

  findAll(opts) {
    return this.userModel.findAll(opts);
  }

  findOne(opts) {
    return this.userModel.findOne(opts);
  }

  findById(id) {
    return this.userModel.findByPk(id);
  }

  create(data, opts) {
    return this.userModel.create(data, opts);
  }

  update(id, data, opts) {
    return this.userModel.update(data, {
      ...opts,
      where: {
        id,
      }
    });
  }

  destroy(id) {
    return this.userModel.destroy({
      where: { id },
    });
  }
}

module.exports.default = UserRepository;
