const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token manquant" });
  }

  try {
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
};

const isRecruteur = (req, res, next) => {
    if (req.user.role !== "recruteur") {
        return res.status(403).json({ message: "Accès réservé aux recruteurs" });
    }
    next();
};

module.exports = { protect, isRecruteur };
