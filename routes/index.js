const router = require("express").Router();
const userRoutes = require("./users");
const clothingItemRoutes = require("./clothingItems");
const { login, createUser } = require("../controllers/users");
const { getItems } = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");
const { NOT_FOUND } = require("../utils/statusCodes");

router.post("/signin", login);
router.post("/signup", createUser);
router.get("/items", getItems)

router.use(auth);
router.use("/users", userRoutes);
router.use("/items", clothingItemRoutes);

router.use((req, res) => {
    res.status(NOT_FOUND).send({ message: "Route not found" });
});

module.exports = router;