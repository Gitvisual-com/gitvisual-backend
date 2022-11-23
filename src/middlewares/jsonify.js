const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const jsonify = (fields) => (req, _res, next) => {
  try {
    fields.forEach((field) => {
      req.body[field] = JSON.parse(req.body[field]);
    });
  } catch (e) {
    return next(new ApiError(httpStatus.BAD_REQUEST, `invalid request body: ${e.message}, avoid using single quotes`));
  }
  return next();
};

module.exports = jsonify;
