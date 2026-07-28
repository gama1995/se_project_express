const user = require("../models/User");
const {
  OK,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR
} = require("../utils/statusCodes");

const getUsers = (req, res) => {
  user.find({})
    .then((users) => res.status(OK).send(users))
    .catch(() => res
    .status(INTERNAL_SERVER_ERROR)
    .send({ message: "An error has occurred on the server." }));
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  user.create({ name, avatar })
    .then((user) => res.status(CREATED).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
        .status(BAD_REQUEST)
        .send({ message: "Invalid user information" });
      }
      return res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: "An error has occurred on the server." });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  user.findById(userId)
    .orFail()
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
       if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid user ID" });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: "An error has occurred on the server." });
    });
};

module.exports = { getUsers, createUser, getUser };
