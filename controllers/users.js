const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const BadRequestError = require("../errors/bad-request-err");
const ConflictError = require("../errors/conflict-err");
const NotFoundError = require("../errors/not-found-err");
const UnauthorizedError = require("../errors/unauthorized");
const { OK, CREATED } = require("../utils/statusCodes");

const createUser = (req, res, next) => {
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
      if (err.code === 11000) {
        return next(new ConflictError("User with this email already exists")
      );
      }
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid user information"));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

 User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError("Invalid email or password");
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        
        if (!matched) {
          throw new UnauthorizedError("Invalid email or password");
        }

        const token = jwt.sign(
          { _id: user._id },
          JWT_SECRET,
          { expiresIn: "7d" }
        );

        return res.send({ token });
      });
    })
    .catch(next);
};


const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid user ID"));
      }
      return next(err);
    });
};

const updateProfile = (req, res, next) => {
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
        return next(new NotFoundError("User not found"));
      }
      if (err.name === "ValidationError" || err.name === "CastError") {
        return next(new BadRequestError("Invalid user information"));
      }
      return next(err);
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};
