const router = require("express").Router();
const { validateUserProfile } = require("../middlewares/validation");
const { getCurrentUser, updateProfile } = require("../controllers/users");

router.get("/me", getCurrentUser);
router.patch("/me", validateUserProfile, updateProfile);


module.exports = router;