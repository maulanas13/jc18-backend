let nama = "dino";
let kelas = "jc18";
let listName = ["dino", "angga", "reece"];
const kalimat = (a, b, c) => {
  return `kalimat = ${a} ${b} ${c}`;
};
// ? kalo exports by name itu bisa lebih dari satu dari satu file
// module.exports.nama = nama;
// module.exports.kelas = kelas;
// module.exports.listName = listName;
// module.exports.kalimat = kalimat;
module.exports = {
  nama,
  kelas,
  listName,
  kalimat,
};
module.exports = (a, b, c) => {
  return `kalimat = ${a} ${b} ${c}`;
};
//? module.exports aja = cuman boleh satu setiap file atau biasa disebut dengan export defualt
// module.exports = {
//   nama,
// };

// export default nama
