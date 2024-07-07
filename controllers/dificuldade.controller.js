const Dificuldade = require("../models/dificuldade.model");

exports.listarDificuldades = (req, res) => {
  Dificuldade.listarDificuldades((err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Ocorreu um erro na obtenção das dificuldades."
      });
    } else {
      res.send(data);
    }
  });
};
