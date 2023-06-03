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

  findAll(opts) {
    return this.adminModel.findAll(opts);
  }

  count(opts) {
    return this.adminModel.count(opts);
  }

  destroy(id) {
    return this.adminModel.destroy({
      where: { id }
    });
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
