const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");

const { FRONTEND_ORIGIN } = require("../config");
const { invalidRoutes, errorMethod } = require("./utils/errorHandler");

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: [FRONTEND_ORIGIN],
    credentials: true,
  }),
);

app.use(compression());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Mini Social Feed API",
  });
});

// error middleware
app.use(invalidRoutes);
app.use(errorMethod);

module.exports = app;
