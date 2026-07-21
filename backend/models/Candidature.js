const mongoose = require("mongoose");

const candidatureSchema = new mongoose.Schema(
  {
    candidatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    offreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Offre",
      required: true,
    },
    status: {
      type: String,
      enum: ["en_attente", "accepter", "refuser"],
      default: "en_attente",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Candidature", candidatureSchema);