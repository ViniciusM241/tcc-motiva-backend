class ReportController {
  constructor({
    reportService,
  }) {
    this.reportService = reportService;
  }

  async reports(req, res) {
    const reports = await this.reportService.show();

    return res.dataResponse(reports);
  }
}

module.exports.default = ReportController;
