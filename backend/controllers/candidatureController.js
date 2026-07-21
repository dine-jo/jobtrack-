const Candidature = require("../models/Candidature");
const Offre = require("../models/Offre");

// Un candidat postule à une offre
const createCandidature = async (req, res) => {
  try {
    const { offreId } = req.body;

    if (!offreId) {
      return res.status(400).json({ message: "L'identifiant de l'offre est obligatoire" });
    }

    const offre = await Offre.findById(offreId);
    if (!offre) {
      return res.status(404).json({ message: "Offre introuvable" });
    }

    const dejaPostule = await Candidature.findOne({
      candidatId: req.user.id,
      offreId,
    });
    if (dejaPostule) {
      return res.status(400).json({ message: "Vous avez déjà postulé à cette offre" });
    }

    const candidature = await Candidature.create({
      candidatId: req.user.id,
      offreId,
    });

    return res.status(201).json({ message: "Candidature envoyée avec succès", candidature });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Le candidat connecté voit ses candidatures
const getMesCandidatures = async (req, res) => {
  try {
    const candidatures = await Candidature.find({ candidatId: req.user.id })
      .populate("offreId")
      .sort({ createdAt: -1 });

    return res.status(200).json(candidatures);
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Le recruteur voit les candidatures reçues sur UNE de ses offres
const getCandidaturesParOffre = async (req, res) => {
  try {
    const { offreId } = req.params;

    const offre = await Offre.findById(offreId);
    if (!offre) {
      return res.status(404).json({ message: "Offre introuvable" });
    }
    if (offre.recruteurId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Cette offre ne vous appartient pas" });
    }

    const candidatures = await Candidature.find({ offreId })
      .populate("candidatId", "-password")
      .sort({ createdAt: -1 });

    return res.status(200).json(candidatures);
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Le recruteur accepte ou refuse une candidature
const updateStatutCandidature = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["accepter", "refuser", "en_attente"].includes(status)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    const candidature = await Candidature.findById(id).populate("offreId");
    if (!candidature) {
      return res.status(404).json({ message: "Candidature introuvable" });
    }

    if (candidature.offreId.recruteurId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Cette candidature ne concerne pas une de vos offres" });
    }

    candidature.status = status;
    await candidature.save();

    return res.status(200).json({ message: "Statut mis à jour", candidature });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

module.exports = {
  createCandidature,
  getMesCandidatures,
  getCandidaturesParOffre,
  updateStatutCandidature,
};