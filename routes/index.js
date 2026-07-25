const route = require("express").Router();

const userRoutes = require("./users");

route.use("/users", userRoutes);

module.exports = route;