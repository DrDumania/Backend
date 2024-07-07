const Informacao = require("../models/info.model.js");

// Inserir uma nova informação
exports.insert = (req, res) => {
  // Validar a request
  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).send({
      message: "O conteúdo da informação deve estar definido."
    });
  }
    const informacao = new Informacao({
      id_media: req.body.id_media || null,
      nome: req.body.titulo,
      descricao: req.body.descricao,
      tipo_de_informacao: req.body.tipo_de_informacao
    });

      // Guardar informação na base de dados
    Informacao.insert(informacao, (err, data) => {
      if (err)
        res.status(500).send({
          message: err.message || "Ocorreu um erro ao inserir a informação..."
        });
      else res.send(data);
    });
  };

// Devolver todas as informações
exports.selectAll = (req, res) => {
  Informacao.selectAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Ocorreu um erro na obtenção da(s) informação(ões)..."
      });
    else res.send(data);
  });
};

// Devolver uma informação pelo seu id
exports.findById = (req, res) => {
  Informacao.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.info === "not_found") {
        res.status(404).send({
          message: `Não foi encontrada a informação com id = ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Erro ao obter informação com id = " + req.params.id
        });
      }
    } else res.send(data);
  });
};

// Atualizar uma informação pelo seu id
exports.update = (req, res) => {
  // Validar a request
  if (!req.body) {
    res.status(400).send({
      message: "O conteúdo da informação deve estar definido."
    });
  }

  Informacao.updateById(
    req.params.id,
    new Informacao(req.body),
    (err, data) => {
      if (err) {
        if (err.info === "not_found") {
          res.status(404).send({
            message: `Não foi encontrada a informação com id = ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: `Foi gerado um erro a atualizar a informação com id = ${req.params.id}.`
          });
        }
      } else res.send(data);
    }
  );
};

// Apagar uma informação pelo seu id
exports.delete = (req, res) => {
  Informacao.delete(req.params.id, (err, data) => {
    if (err) {
      if (err.info === "not_found") {
        res.status(404).send({
          message: `Não foi encontrada a informação com id = ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: `Foi gerado um erro a apagar a informação com id = ${req.params.id}.`
        });
      }
    } else res.send({ message: 'A informação foi eliminada com sucesso.' });
  });
};

// Apagar todas as informações da base de dados
exports.deleteAll = (req, res) => {
  Informacao.deleteAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Foi gerado um erro a apagar a totalidade das informações.'
      });
    else res.send({ message: 'Todas as informações foram eliminadas...' });
  });
};
