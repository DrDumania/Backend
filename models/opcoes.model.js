const sql = require("./db.js");

// Constructor
const Opcao = function(opcao) {
  this.id = opcao.id;
  this.id_exercicio = opcao.id_exercicio;
  this.opcao_1 = opcao.opcao_1;
  this.opcao_2 = opcao.opcao_2;
  this.opcao_3 = opcao.opcao_3;
  this.opcao_4 = opcao.opcao_4;
  this.opcao_correta = opcao.opcao_correta;
};

Opcao.listarOpcoes = (result) => {
  let query = 'SELECT * FROM opcoes';

  sql.query(query, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }

    console.log("Opcoes: ", res);
    result(null, res);
  });
};

Opcao.listarOpcoesPorId = (id, result) => {
  const query = `SELECT * FROM opcoes WHERE id = ?`;

  sql.query(query, [id], (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log('found options: ', res[0]);
      result(null, res[0]);
      return;
    }

    // Not found options with the id
    result({ kind: 'not_found' }, null);
  });
};

Opcao.editarOpcaoPorId = (id, opcao, result) => {
  const query = `UPDATE opcoes SET opcao_1 = ?, opcao_2 = ?, opcao_3 = ?, opcao_4 = ?, opcao_correta = ? WHERE id = ?`;

  sql.query(
    query,
    [opcao.opcao_1, opcao.opcao_2, opcao.opcao_3, opcao.opcao_4, opcao.opcao_correta, id],
    (err, res) => {
      if (err) {
        console.log("Error in editarOpcaoPorId: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // Not found Opcao with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("Updated opcao: ", { id: id, ...opcao });
      result(null, { id: id, ...opcao });
    }
  );
};

  module.exports = Opcao;