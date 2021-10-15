const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "tesproduk13@gmail.com", // generated ethereal user
      pass: "wzyosyhlycnhyekb", // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
    }
  });

  module.exports = transporter;