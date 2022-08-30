const { accountController } = require("../controllers/dataController");
const isAuthorized = require("../middleware/isAuthorized");

const router = require("express").Router();

router.get("/account", isAuthorized, accountController);

module.exports = router;
