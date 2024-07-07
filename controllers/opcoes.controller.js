require('dotenv').config();
const Opcao = require("../models/opcoes.model");

exports.listarOpcoes = (req, res) => {
  Opcao.listarOpcoes((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Ocorreu um erro na obtenção da(s) opcoes(s)..."
      });
    else res.send(data);
  });
};

// Devolver uma opcao
exports.listarOpcoesPorId = async (req, res) => {
    const id_opcao = req.params.id;

    Opcao.listarOpcoesPorId(id_opcao, (err, optionsData) => {
    if (err) {
      if (err.kind === 'not_found') {
        return res.status(404).send({
          message: `Options for exercicio with id ${id} not found`
        });
      }
      return res.status(500).send({
        message: 'Error fetching options for exercicio'
      });
    }

    res.send(optionsData);
  });
};

exports.editarOpcao = (req, res) => {
  // Validar a request
  if (!req.body) {
    res.status(400).send({
      message: "O conteúdo do utilizadore deve estar definido."
    });
  }

  const id = req.params.id;
  Opcao.editarOpcaoPorId(id, new Opcao(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Opcao with id ${id}.`
        });
      } else {
        res.status(500).send({
          message: "Error updating Opcao with id " + id
        });
      }
    } else res.send(data);
  });
};