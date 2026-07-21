const Offre = require("../models/Offre");
const Candidature = require("../models/Candidature");

// Créer une offre (recruteur uniquement)
const createOffre = async (req, res) => {
  try {
    const {
      titre,
      description,
      typeContrat,
      localisation,
      salaire,
      dateExpiration,
    } = req.body;

    if (!titre || !description || !typeContrat || !localisation) {
      return res.status(400).json({ message: "Champs obligatoires manquants" });
    }

    const offre = await Offre.create({
      recruteurId: req.user.id,
      titre,
      description,
      typeContrat,
      localisation,
      salaire,
      dateExpiration,
    });

    return res
      .status(201)
      .json({ message: "Offre publiée avec succès", offre });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};

// Lister toutes les offres (public, pour Postuler.jsx)
const getAllOffres = async (req, res) => {
  try {
    const offres = await Offre.find().sort({ datePublication: -1 });
    return res.status(200).json(offres);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};

// Lister les offres du recruteur connecté (pour DashboardEmployeur.jsx)
const getMesOffres = async (req, res) => {
  try {
    const offres = await Offre.find({ recruteurId: req.user.id }).sort({
      datePublication: -1,
    });

    const offresAvecCandidatures = await Promise.all(
      offres.map(async (offre) => {
        const nombreCandidatures = await Candidature.countDocuments({
          offreId: offre._id,
        });
        return {
          ...offre.toObject(),
          nombreCandidatures,
        };
      }),
    );

    return res.status(200).json(offresAvecCandidatures);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};

module.exports = { createOffre, getAllOffres, getMesOffres };
