const express = require("express");
const router = express.Router();

const authRoutes = require("./auth");
const testRoutes = require("./test");

router.use("/auth", authRoutes);
router.use("/test", testRoutes);

module.exports = router;
