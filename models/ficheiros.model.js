const sql = require("./db.js");

// Modelo de Ficheiro
const Ficheiro = function(ficheiros) {
  this.id_exercicio = ficheiros.id_exercicio || null; // id_alinea é opcional
  this.nome_ficheiro = ficheiros.nome_ficheiro;
  this.caminho_ficheiro = ficheiros.caminho_ficheiro;
  this.tipo_ficheiro = ficheiros.tipo_ficheiro || 1; // tipo_ficheiro tem valor padrão 1
};

// Inserir novo ficheiro
Ficheiro.insert = (newFicheiro, result) => {
  sql.query('INSERT INTO ficheiros SET ?', newFicheiro, (err, res) => {
    if (err) {
      console.error('Erro ao inserir ficheiro:', err);
      result(err, null);
      return;
    }
    console.log("Ficheiro inserido: ", { id: res.insertId, ...newFicheiro });
    result(null, { id: res.insertId, ...newFicheiro });
  });
};

// Buscar ficheiro por ID
Ficheiro.findById = (id, result) => {
  sql.query('SELECT * FROM ficheiros WHERE id = ?', [id], (err, res) => {
    if (err) {
      console.error('Erro ao buscar ficheiro:', err);
      result(err, null);
      return;
    }
    if (res.length) {
      console.log('Ficheiro encontrado: ', res[0]);
      result(null, res[0]);
      return;
    }
    result({ kind: "not_found" }, null);
  });
};

// Selecionar todos os ficheiros
Ficheiro.selectAll = (result) => {
  sql.query('SELECT * FROM ficheiros', (err, res) => {
    if (err) {
      console.error('Erro ao obter ficheiros:', err);
      result(err, null);
      return;
    }
    console.log("Ficheiros encontrados: ", res);
    result(null, res);
  });
};

// Atualizar ficheiro por ID
Ficheiro.updateById = (id, ficheiros, result) => {
  sql.query(
    'UPDATE ficheiros SET nome_ficheiro = ?, caminho_ficheiro = ?, id_exercicio = ?, tipo_ficheiro = ? WHERE id = ?',
    [
      ficheiros.nome_ficheiro,
      ficheiros.caminho_ficheiro,
      ficheiros.id_exercicio || null, // id_exercicio é opcional
      ficheiros.tipo_ficheiro || 1, // tipo_ficheiro tem valor padrão 1
      id
    ],
    (err, res) => {
      if (err) {
        console.error('Erro ao atualizar ficheiro:', err);
        result(err, null);
        return;
      }
      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }
      console.log('Ficheiro atualizado: ', { id: id, ...ficheiros });
      result(null, { id: id, ...ficheiros });
    }
  );
};

// Deletar ficheiro por ID
Ficheiro.delete = (id, result) => {
  sql.query('DELETE FROM ficheiros WHERE id = ?', [id], (err, res) => {
    if (err) {
      console.error('Erro ao deletar ficheiro:', err);
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    console.log("Ficheiro apagado com o ID: ", id);
    result(null, res);
  });
};

// Deletar todos os ficheiros
Ficheiro.deleteAll = (result) => {
  sql.query('DELETE FROM ficheiros', (err, res) => {
    if (err) {
      console.error('Erro ao apagar todos os ficheiros:', err);
      result(err, null);
      return;
    }
    console.log(`Todos os ficheiros foram apagados, total: ${res.affectedRows}`);
    result(null, res);
  });
};

// Selecionar todos os tipos de ficheiro
Ficheiro.selectAllTiposFicheiro = (result) => {
  let query = 'SELECT * FROM tipo_ficheiro';
  sql.query(query, (err, res) => {
    if (err) {
      console.log('Erro ao obter tipos de ficheiro: ', err);
      result(null, err);
      return;
    }
    console.log("Tipos de Ficheiros: ", res);
    result(null, res);
  });
};

// Atualizar tipo de ficheiro por ID
Ficheiro.updateTiposFicheirosById = (id, tipo_ficheiro, result) => {
  sql.query(
    'UPDATE tipo_ficheiro SET tipo_ficheiro = ? WHERE id = ?',
    [tipo_ficheiro, id],
    (err, res) => {
      if (err) {
        console.log('Erro ao atualizar tipo de ficheiro: ', err);
        result(null, err);
        return;
      }
      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }
      console.log('Tipo de ficheiro atualizado: ', { id: id, tipo_ficheiro: tipo_ficheiro });
      result(null, { id: id, tipo_ficheiro: tipo_ficheiro });
    }
  );
};

module.exports = Ficheiro;