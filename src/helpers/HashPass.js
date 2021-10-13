const crypto = require("crypto");

module.exports = (word) => {
  let hashing = crypto
    .createHmac("sha256", "leviackerman") // Klo yg param kedua, org lain ga punya key sama, ga bisa decode
    .update(word)
    .digest("hex");
  return hashing;
};