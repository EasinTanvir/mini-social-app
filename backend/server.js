require("dotenv").config();
const { PORT } = require("./config");

const app = require("./src/app");

const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`),
);

module.exports = server;
