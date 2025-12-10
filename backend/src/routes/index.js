const express = require("express")
const router = express.Router()
const authRoutes = require("./auth")
const forumRoutes = require("./forum")
const threadRoutes = require("./thread")
const postRoutes = require("./post")
const userRoutes = require("./user")
const cartRoutes = require("./cart")
const gameRoutes = require("./game")

// Importar las rutas de email (necesario para confirmación de compras)
const emailRoutes = require("./email")

router.use("/auth", authRoutes)
router.use("/forums", forumRoutes)
router.use("/threads", threadRoutes)
router.use("/posts", postRoutes)
router.use("/users", userRoutes)
router.use("/cart", cartRoutes)
router.use("/games", gameRoutes)
router.use("/email", emailRoutes)

module.exports = router
