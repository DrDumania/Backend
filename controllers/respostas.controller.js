require('dotenv').config();
const Resposta = require("../models/respostas.model");

exports.listarRespostas = (req, res) => {
    Resposta.listarRespostas((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Ocorreu um erro na obtenção da(s) resposta(s)..."
      });
    else res.send(data);
  });
};

// Devolver uma resposta por ID
exports.listarRespostasPorId = async (req, res) => {
    const id_resposta = req.params.id;

    Resposta.listarRespostasPorId(id_resposta, (err, respostaData) => {
    if (err) {
      if (err.kind === 'not_found') {
        return res.status(404).send({
          message: `respostas with id ${id} not found`
        });
      }
      return res.status(500).send({
        message: 'Error fetching respostas'
      });
    }

    res.send(respostaData);
  });
};

// Create a new response
exports.criarResposta = (req, res) => {
    const { id_utilizador, id_exercicio, esta_correto, texto_resposta } = req.body;
  
    // Validate request
    if (!id_utilizador || !id_exercicio || esta_correto === undefined || !texto_resposta) {
      return res.status(400).send({
        message: "Conteúdo não pode estar vazio!"
      });
    }
  
    // Create a Resposta
    const novaResposta = new Resposta({
      id_utilizador,
      id_exercicio,
      esta_correto,
      texto_resposta
    });
  
    // Save Resposta in the database
    Resposta.criarResposta(novaResposta, (err, data) => {
      if (err) {
        return res.status(500).send({
          message: err.message || "Ocorreu um erro ao criar a resposta."
        });
      } else res.send(data);
    });
  };
