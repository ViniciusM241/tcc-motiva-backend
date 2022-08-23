class Request {
  constructor(req, res) {
    this.req = req;
    this.res = res;
    this.user = req.user;
  }

  body() {
    return this.req.body;
  }

  query() {
    return this.req.query;
  }

  params() {
    return this.req.params;
  }

  setUser(user) {
    this.user = user;
  }

  getUser() {
    return this.user;
  }

}

module.exports = Request;
