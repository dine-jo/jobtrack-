const mongoose = require("mongoose");

const offreSchema = new mongoose.Schema(
  {
    recruteurId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    titre: { type: String, required: true },
    description: { type: String, required: true },
    typeContrat: { type: String, required: true },
    localisation: { type: String, required: true },
    salaire: { type: Number },
    datePublication: { type: Date, default: Date.now },
    dateExpiration: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Offre", offreSchema);