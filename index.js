const bodyParser = require("body-parser");
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const {
  sendUserError,
  hashedPassword,
  loggedIn,
  restrictedPermissions
} = require("./middleWare");
const cors = require("cors");
const routes = require("./routes");

const jwt = require("jsonwebtoken");

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();

server.use(bodyParser.json());

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true
};

server.use(cors(corsOptions));

server.use(
  session({
    secret: "e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re",
    resave: true,
    saveUninitialized: true
  })
);

server.use(restrictedPermissions);

routes(server);

server.listen(5000);
