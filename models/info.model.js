const sql = require("./db.js");

// Construtor
const Informacao = function(informacao) {
  this.id_media = informacao.id_media;
  this.nome = informacao.nome;
  this.descricao = informacao.descricao;
  this.tipo_de_informacao = informacao.tipo_de_informacao;
};

// Método para inserir uma nova informação
Informacao.insert = (newInformacao, result) => {
  sql.query('INSERT INTO info_util_pronuncia (id_media, nome, descricao, tipo_de_informacao) VALUES (?, ?, ?, ?)', 
    [newInformacao.id_media, newInformacao.nome, newInformacao.descricao, newInformacao.tipo_de_informacao], 
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(err, null);
        return;
      }

      console.log("Informação inserida: ", { id: res.insertId, ...newInformacao });
      result(null, { id: res.insertId, ...newInformacao });
  });
};

// Método para buscar informação pelo ID
Informacao.findById = (id, result) => {
  sql.query('SELECT * FROM info_util_pronuncia WHERE id = ?', [id], (err, res) => {
    if (err) {
      console.log('Erro ao buscar informação:', err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log('Informação encontrada: ', res[0]);
      result(null, res[0]);
      return;
    }

    // Caso a informação não seja encontrada
    result({ info: "not_found" }, null);
  });
};

// Método para buscar todas as informações
Informacao.selectAll = (result) => {
  sql.query('SELECT * FROM info_util_pronuncia', (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }

    console.log("Informações: ", res);
    result(null, res);
  });
};

// Método para atualizar uma informação pelo ID
Informacao.updateById = (id, informacao, result) => {
  sql.query(
    'UPDATE info_util_pronuncia SET id_media = ?, nome = ?, descricao = ?, tipo_de_informacao = ? WHERE id = ?',
    [informacao.id_media, informacao.nome, informacao.descricao, informacao.tipo_de_informacao, id],
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // Not found informação
        result({ info: "not_found" }, null);
        return;
      }

      console.log('Informação atualizada: ', { id: id, ...informacao });
      result(null, { id: id, ...informacao });
    }
  );
};

// Método para deletar uma informação pelo ID
Informacao.delete = (id, result) => {
  sql.query('DELETE FROM info_util_pronuncia WHERE id = ?', [id], (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // Not found informação with the id
      result({ info: "not_found" }, null);
      return;
    }

    console.log("Informação eliminada com o id: ", id);
    result(null, res);
  });
};

// Método para deletar todas as informações
Informacao.deleteAll = result => {
  sql.query("DELETE FROM info_util_pronuncia", (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }

    console.log(`Eliminado(s) ${res.affectedRows} Informação(ões)`);
    result(null, res);
  });
};

module.exports = Informacao;