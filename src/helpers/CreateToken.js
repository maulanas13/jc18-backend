const jwt = require("jsonwebtoken");

module.exports = {
    createTokenAccess: (data) => {
        const key = "DarthMaul";
        const token = jwt.sign(data, key, {expiresIn: "12h"}); // 12 jam
        return token;
    },
    createTokenEmailVerified: (data) => {
        const key = "ObiWanKenobi";
        const token = jwt.sign(data, key, {expiresIn: "3m"}); // 3 menit
        return token;
    }
};