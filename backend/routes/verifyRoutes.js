const verifyController = require("../controllers/verifyController");
const router = require("express").Router();

// Account Verification for new user
router.put("/new/:token", verifyController);

// Account Verification for forgot password
router.post("/forgot/:id", async (req, res) => {});

module.exports = router;
