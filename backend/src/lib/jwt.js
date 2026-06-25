const jwt = require("jsonwebtoken");
const { TOKEN_KEY } = require("../../config");

module.exports = {
  createJwt: (payload) => {
    return jwt.sign(
      {
        id: payload.id,
      },
      TOKEN_KEY,
    );
  },

  verifyJwt: (token) => {
    return jwt.verify(token, TOKEN_KEY);
  },
};
