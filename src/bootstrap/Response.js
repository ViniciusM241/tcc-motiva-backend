class Response {
  constructor(req, res) {
    this.res = res;
    this.request = req;
  }

  dataResponse(data) {
    const handledData = this._injectResponseHeader(data);
    return this.res.json(handledData);
  }

  status(code) {
    this.res.status(code);
  }

  end(data) {
    return this.res.end(data);
  }

  set(object) {
    return this.res.set(object);
  }

  _injectResponseHeader(data) {
    return {
      name: 'API TESTE TCC',
      date: new Date(),
      data,
    }
  }
}

module.exports = Response;
