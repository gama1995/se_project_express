const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  OK,
  CREATED,
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
} = require("../utils/statusCodes");

const createUser = (req, res) => {
console.log("SIGNUP BODY:", req.body);

  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => 
      User.create({
      name,
      avatar,
      email,
      password: hash,
    }))

     .then((user) => {
      const userData = user.toObject();
      delete userData.password;
      res.status(CREATED).send(userData);
    })
    .catch((err) => {
console.log("CREATE USER ERROR:", err);
console.log("ERROR CODE:", err.code);
console.log("DUPLICATE VALUE:", err.keyValue);

      if (err.code === 11000) {
        return res
          .status(CONFLICT)
          .send({ message: "User with this email already exists" });
      }
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid user information" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const login = (req, res) => {
console.log("LOGIN BODY:", req.body);

  const { email, password } = req.body;

  console.log("LOGIN EMAIL:", email);
  console.log("PASSWORD RECEIVED:", Boolean(password));

 User.findOne({ email })
    .select("+password")
    .then((user) => {
      console.log("USER FOUND:", user);
      if (!user) {
        return Promise.reject(new Error("Invalid email or password"));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
         console.log("PASSWORD MATCHED:", matched);
        
        if (!matched) {
          return Promise.reject(new Error("Invalid email or password"));
        }

        console.log("JWT SECRET EXISTS:", Boolean(JWT_SECRET));

        const token = jwt.sign(
          { _id: user._id },
          JWT_SECRET,
          { expiresIn: "7d" }
        );

        return res.send({ token });
      });
    })
    .catch((err) => {
console.log("LOGING ERROR:", err);

      res.status(401).send({
        message: "Incorrect email or password",
      });
    });
};


const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid user ID" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const updateProfile = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid user information" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};
