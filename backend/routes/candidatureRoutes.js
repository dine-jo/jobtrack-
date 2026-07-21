const express = require("express");
const router = express.Router();
const {
  createCandidature,
  getMesCandidatures,
  getCandidaturesParOffre,
  updateStatutCandidature,
} = require("../controllers/candidatureController");
const { protect, isRecruteur } = require("../middleware/authMiddleware");

router.post("/", protect, createCandidature);
router.get("/mes-candidatures", protect, getMesCandidatures);
router.get("/offre/:offreId", protect, isRecruteur, getCandidaturesParOffre);
router.patch("/:id/statut", protect, isRecruteur, updateStatutCandidature);

module.exports = router;
