const sql = require("./db.js");

// construtor
const Utilizador = function(utilizador) {
  this.username= utilizador.username;
  this.password	= utilizador.password;
  this.email	= utilizador.email;
  this.nacionalidade	= utilizador.nacionalidade;
}

Utilizador.insert = (newUtilizador, result) => {
  sql.query('INSERT INTO utilizadores SET ?', newUtilizador, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }

    console.log("Utilizador inserido: ", { id: res.insertId, ...newUtilizador });
    result(null, { id: res.insertId, ...newUtilizador });
  });
}
// ...newUtilizador
// ... é um operador, o spread operator (operador de propagação),utilizado em várias situações, sendo que a mais usual é "espalhar" elementos de um array ou propriedades de um objeto. No exemplo acima serve para combinar, num só objeto, o novo id do Utilizador inserido com o objeto que constitui o novo Utilizador.

// Método para buscar utilizador pelo ID
Utilizador.findById = (id, result) => {
  sql.query(`SELECT * FROM utilizadores WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log('Erro ao buscar utilizador:', err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log('Utilizador encontrado: ', res[0]);
      result(null, res[0]);
      return;
    }

    // Caso o utilizador não seja encontrado
    result({ utilizador: "not_found" }, null);
  });
};

Utilizador.findByEmail = (email) => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM utilizadores WHERE email = ?`, [email], (err, res) => {
      if (err) {
        console.log('error: ', err);
        reject(err);
        return;
      }

      if (res.length) {
        console.log('found user: ', res[0]);
        resolve(res[0]);
        return;
      }

      // not found User with the email
      resolve(null);
    });
  });
};

Utilizador.createUser = (newUser) => {
  return new Promise((resolve, reject) => {
    sql.query('INSERT INTO utilizadores SET ?', newUser, (err, res) => {
      if (err) {
        console.log('error: ', err);
        reject(err);
        return;
      }

      console.log('created user: ', { id: res.insertId, ...newUser });
      resolve({ id: res.insertId, ...newUser });
    });
  });
};

Utilizador.selectAll = (username, result) => {
  let query = 'SELECT * FROM utilizadores';

  if (username) {
    query += ` WHERE username LIKE '%${username}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }

    console.log("Utilizadors: ", res);
    result(null, res);
  });
};


Utilizador.selectAllFuncoes = (funcao, result) => {
  let query = 'SELECT * FROM funcao';

  if (funcao) {
    query += ` WHERE funcao LIKE '%${funcao}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }

    console.log("Funçoes: ", res);
    result(null, res);
  });
};

Utilizador.selectFuncaoById = (idFuncao, result) => {
  let query = `SELECT * FROM funcao WHERE id_funcao = ${idFuncao}`;

  if (idFuncao) {
    query += ` WHERE id_funcao LIKE '%${idFuncao}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }

    console.log("Funçoes: ", res);
    result(null, res);
  });
};


Utilizador.updateById = (id, utilizador, result) => {
  sql.query(
    'UPDATE utilizadores SET username = ?, email = ?, password = ? ,nacionalidade = ?  WHERE id = ?',
    [utilizador.username, utilizador.email, utilizador.password, utilizador.nacionalidade, id],
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found utilizador
        result({ utilizador: "not_found" }, null);
        return;
      }

      console.log('Utilizador atualizado: ', { id: id, ...utilizador });
      result(null, { id: id, ...utilizador });
    }
  );
};

Utilizador.updateFuncaoById = (id, id_funcao, result) => {
  sql.query(
    'UPDATE utilizadores SET id_funcao = ? WHERE id = ?',
    [id_funcao, id],
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found utilizador
        result({ utilizador: "not_found" }, null);
        return;
      }

      console.log('Função atualizada: ', { id: id, id_funcao: id_funcao });
      result(null, { id: id, id_funcao: id_funcao });
    }
  );
};


Utilizador.delete = (id, result) => {
  sql.query('DELETE FROM utilizadores WHERE id = ?', id, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found utilizador with the id
      result({ utilizador: "not_found" }, null);
      return;
    }

    console.log("Utilizador eliminado com o id: ", id);
    result(null, res);
  });
};

Utilizador.deleteAll = result => {
  sql.query("DELETE FROM utilizadores", (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }

    console.log(`Eliminado(s) ${res.affectedRows} Utilizador(s)`);
    result(null, res);
  });
};

Utilizador.atualizarPontuacao = (id, pontos, result) => {
  sql.query(
    "UPDATE utilizadores SET pontos = pontos + ? WHERE id = ?",
    [pontos, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Utilizador with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated utilizador: ", { id: id, pontos: pontos });
      result(null, { id: id, pontos: pontos });
    }
  );
};


module.exports = Utilizador;