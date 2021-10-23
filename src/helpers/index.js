// import sama export
const isSatOrSun = require("./isSatOrSun");
const renderHtml = require("./renderHtml");
const hashPass = require("./HashPass");
const createToken = require("./CreateToken");
const verifyToken = require("./VerifyToken");
const transporter = require("./Transporter");
const uploader = require("./UploadFolder")

module.exports = {
  isSatOrSun,
  renderHtml,
  hashPass,
  createToken,
  verifyToken,
  transporter,
  uploader
};
