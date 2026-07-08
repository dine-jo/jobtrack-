const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telephone: { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: ["candidat", "recruteur"], default: "candidat" },
    // Champs spécifiques au candidat (optionnels si recruteur)
    cv: { type: String },
    lettreMotivation: { type: String },
    photo: { type: String },
    diplome: { type: String },
    experience: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);