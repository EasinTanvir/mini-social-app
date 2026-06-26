const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");

const { invalidRoutes, errorMethod } = require("./utils/errorHandler");
const authRoute = require("./routes/auth.route");
const postRoute = require("./routes/post.route");

const app = express();
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(morgan("dev"));

app.use(`/api/v1/auth`, authRoute);
app.use(`/api/v1/post`, postRoute);

app.use(invalidRoutes);
app.use(errorMethod);

module.exports = app;
