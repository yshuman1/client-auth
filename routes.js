const session = require("express-session");
const bcrypt = require("bcrypt");
const {
  sendUserError,
  hashedPassword,
  loggedIn,
  restrictedPermissions
} = require("middleWare");

const jwt = require("jsonwebtoken");

const routes = server => {
  server.post("/log-in", (req, res) => {
    const { username, password } = req.body;
    if (!username) {
      sendUserError("username undefined", res);
      return;
    }
    User.findOne({ username }, (err, user) => {
      if (err || user === null) {
        sendUserError("No user found at that id", res);
        return;
      }
      const hashedPw = user.passwordHash;
      bcrypt
        .compare(password, hashedPw)
        .then(response => {
          if (!response) throw new Error();
          req.session.username = username;
          req.user = user;
        })
        .then(() => {
          res.json({ success: true });
        })
        .catch(error => {
          return sendUserError("some message here", res);
        });
    });
  });

  server.post("/users", hashedPassword, (req, res) => {
    const { username } = req.body;
    const passwordHash = req.password;
    const newUser = new User({ username, passwordHash });
    newUser.save((err, savedUser) => {
      if (err) {
        res.status(422);
        res.json({ "Need both username/PW fields": err.message });
        return;
      }

      res.json(savedUser);
    });
  });

  server.post("/logout", (req, res) => {
    if (!req.session.username) {
      sendUserError("User is not logged in", res);
      return;
    }
    req.session.username = null;
    res.json(req.session);
  });

  server.get("/restricted/users", (req, res) => {
    User.find({}, (err, users) => {
      if (err) {
        sendUserError("500", res);
        return;
      }
      res.json(users);
    });
  });

  // TODO: add local middleware to this route to ensure the user is logged in
  server.get("/me", loggedIn, (req, res) => {
    // Do NOT modify this route handler in any way
    res.send({ user: req.user, session: req.session });
  });
};

modules.exports = routes;
