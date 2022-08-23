class Error {
  constructor(message, status=500) {
    this.message = message;
    this.status = status;
  }
}

module.exports = Error;
