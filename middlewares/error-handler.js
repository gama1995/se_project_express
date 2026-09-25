// enlint-disable-next-line no-unused-vars */
const errorHandler = (err, req, res, next) => {
if (typeof next !== "function") {
  return;
}

  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message:
      statusCode === 500
        ? "An error has occurred on the server"
        : message,
  });
};

module.exports = errorHandler;