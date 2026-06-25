const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");

const { FRONTEND_ORIGIN } = require("../config");
const { invalidRoutes, errorMethod } = require("./utils/errorHandler");
const authRoute = require("./routes/auth.route");
const postRoute = require("./routes/post.route");

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

app.use(`/api/v1/auth`, authRoute);
app.use(`/api/v1/post`, postRoute);

// error middleware
app.use(invalidRoutes);
app.use(errorMethod);

module.exports = app;
