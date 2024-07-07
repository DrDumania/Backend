const sql = require("./db.js");

// Constructor
const Resposta = function(resposta) {
  this.id = resposta.id;
  this.id_utilizador = resposta.id_utilizador;
  this.id_exercicio = resposta.id_exercicio;
  this.esta_correto = resposta.esta_correto;
  this.texto_resposta = resposta.texto_resposta;
};

Resposta.listarRespostas = (result) => {
  let query = 'SELECT * FROM resposta';

  sql.query(query, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }

    console.log("Respostas: ", res);
    result(null, res);
  });
};

Resposta.listarRespostasPorId = (id, result) => {
  const query = `SELECT * FROM resposta WHERE id = ?`;

  sql.query(query, [id], (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log('found resposta: ', res[0]);
      result(null, res[0]);
      return;
    }

    // Not found resposta with the id
    result({ kind: 'not_found' }, null);
  });
};

// Create a new response
Resposta.criarResposta = (newResposta, result) => {
  const query = 'INSERT INTO resposta SET ?';

  sql.query(query, newResposta, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }

    console.log('created resposta: ', { id: res.insertId, ...newResposta });
    result(null, { id: res.insertId, ...newResposta });
  });
};

module.exports = Resposta;