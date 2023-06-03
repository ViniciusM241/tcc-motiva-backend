class ReportController {
  constructor({
    reportService,
  }) {
    this.reportService = reportService;
  }

  async reports(req, res) {
    const filters = req.query();
    const reports = await this.reportService.show(filters);

    return res.dataResponse(reports);
  }
}

module.exports.default = ReportController;
