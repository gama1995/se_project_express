const router = require("express").Router();
const userRoutes = require("./users");
const clothingItemRoutes = require("./clothingItems");
const { login, createUser } = require("../controllers/users");
const { getItems } = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");
const NotFoundError = require("../errors/not-found-err");
const { validateSignup, validateSignin } = require("../middlewares/validation");

router.post("/signin", validateSignin, login);
router.post("/signup", validateSignup, createUser);
router.get("/items", getItems)

router.use(auth);
router.use("/users", userRoutes);
router.use("/items", clothingItemRoutes);

router.use((req, res, next) => {
    next(new NotFoundError("Route not found"));
});

module.exports = router;