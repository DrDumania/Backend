// controllers/tipo_exercicio.controller.js
const TipoExercicio = require("../models/tipo_exercicio.model");

exports.listarTiposExercicio = (req, res) => {
  TipoExercicio.listarTiposExercicio((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Ocorreu um erro na obtenção do(s) tipo(s) de exercício(s)..."
      });
    else res.send(data);
  });
};

exports.listarTiposExercicioPorId = (req, res) => {
  const id = req.params.id;
  TipoExercicio.listarTiposExercicioPorId(id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `TipoExercicio com id ${id} não encontrado.`
        });
      } else {
        res.status(500).send({
          message: "Erro ao obter o tipo_exercicio com id " + id
        });
      }
    } else res.send(data);
  });
};