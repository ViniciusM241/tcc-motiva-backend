const Error = require('../bootstrap/Error');

function errorHandler(err, req, res, next) {
  let customError = err;

  if (!(err instanceof Error)) {
    console.error(err.message);

    customError = new Error(
      'Something went wrong',
      500,
    );
  }

  res.status(customError.status);
  return res.dataResponse(customError);
}

module.exports = errorHandler;
