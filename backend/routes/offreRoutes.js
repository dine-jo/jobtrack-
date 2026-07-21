const express = require("express");
const router = express.Router();
const { createOffre, getAllOffres, getMesOffres } = require("../controllers/offreController");
const { protect, isRecruteur } = require("../middleware/authMiddleware");

router.post("/", protect, isRecruteur, createOffre);
router.get("/", getAllOffres);
router.get("/mes-offres", protect, isRecruteur, getMesOffres);

module.exports = router;