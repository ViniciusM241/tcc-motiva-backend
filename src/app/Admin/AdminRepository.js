class AdminRepository {
  constructor({
    adminModel,
  }) {
    this.adminModel = adminModel.sequelize();
  }

  findById(id, opts) {
    return this.adminModel.findByPk(id, opts);
  }

  findOne(opts) {
    return this.adminModel.findOne(opts);
  }

  create(data) {
    return this.adminModel.create(data);
  }

  update(id, data) {
    return this.adminModel.update(data, {
      where: {
        id,
      },
    });
  }

}

module.exports.default = AdminRepository;
