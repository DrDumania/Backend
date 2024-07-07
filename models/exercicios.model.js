const sql = require("./db.js");

// Constructor
const Exercicio = function(exercicio) {
  this.id_utilizador = exercicio.id_utilizador;
  this.id_tipo_exercicio = exercicio.id_tipo_exercicio;
  this.id_dificuldade = exercicio.id_dificuldade;
  this.id_categoria = exercicio.id_categoria;
  this.pergunta = exercicio.pergunta;
  this.pontuacao = exercicio.pontuacao;
  this.id_opcao = exercicio.id_opcao;
  this.id_ficheiro = exercicio.id_ficheiro;
};

Exercicio.criarExercicio = (newExercicio, newOpcoes, result) => {
  sql.beginTransaction((err) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }

    sql.query('INSERT INTO opcoes SET ?', newOpcoes, (err, resOpcoes) => {
      if (err) {
        console.log('error: ', err);
        return sql.rollback(() => {
          result(err, null);
        });
      }

      const opcoesId = resOpcoes.insertId;

      const exercicioData = { ...newExercicio, id_opcao: opcoesId };

      sql.query('INSERT INTO exercicio SET ?', exercicioData, (err, resExercicio) => {
        if (err) {
          console.log('error: ', err);
          return sql.rollback(() => {
            result(err, null);
          });
        }

        sql.commit((err) => {
          if (err) {
            console.log('error: ', err);
            return sql.rollback(() => {
              result(err, null);
            });
          }

          console.log("Exercicio inserido: ", { id: resExercicio.insertId, ...exercicioData });
          result(null, { id: resExercicio.insertId, ...exercicioData });
        });
      });
    });
  });
};

Exercicio.listarExercicios = (pergunta, result) => {
  let query = 'SELECT * FROM exercicio';

  if (pergunta) {
    query += ` WHERE username LIKE '%${pergunta}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }

    console.log("Exercicios: ", res);
    result(null, res);
  });
};

Exercicio.listarExercicioPorId = (id, result) => {
  sql.query(`SELECT * FROM exercicio WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log('Erro ao buscar exercicio:', err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log('Exercicio encontrado: ', res[0]);
      result(null, res[0]);
      return;
    }

    // Caso o exercicio não seja encontrado
    result({ exercicio: "not_found" }, null);
  });
};

// Fetch all exercises by category ID
Exercicio.listarExercicioPorCategoria = (id_categoria, result) => {
  sql.query(`SELECT * FROM exercicio WHERE id_categoria = ${id_categoria}`, (err, res) => {
    if (err) {
      console.log('Erro ao buscar exercicio:', err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log('Exercicios encontrados: ', res);
      result(null, res);
      return;
    }

    // Caso os exercicios não sejam encontrados
    result({ exercicio: "not_found" }, null);
  });
};

Exercicio.listarExerciciosPorTipo = (tipoExercicioId, result) => {
  const query = `SELECT * FROM exercicio WHERE id_tipo_exercicio = ?`;

  sql.query(query, [tipoExercicioId], (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }
    console.log("Exercicios: ", res);
    result(null, res);
  });
};

// Fetch options for a list of exercise IDs
Exercicio.listarOpcoesPorIds = (ids, result) => {
  sql.query(`SELECT * FROM opcoes WHERE id IN (${ids.join(",")})`, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log('found options: ', res);
      result(null, res);
      return;
    }

    // Not found options for the given ids
    result({ kind: 'not_found' }, null);
  });
};

Exercicio.listarOpcoesPorId = (id, result) => {
  sql.query(`SELECT * FROM opcoes WHERE id = ${id}`, (err, res) => {
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

Exercicio.eliminarExercicio = (id, result) => {
  sql.query("DELETE FROM exercicio WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted exercicio with id: ", id);
    result(null, res);
  });
};

Exercicio.editarExercicio = (id, exercicio, result) => {
  sql.query(
    'UPDATE exercicio SET pergunta = ?, id_dificuldade = ?, id_categoria = ? ,pontuacao = ?  WHERE id = ?',
    [exercicio.pergunta, exercicio.id_dificuldade, exercicio.id_categoria, exercicio.pontuacao, id],
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        result({ exercicio: "not_found" }, null);
        return;
      }

      console.log('Exercicio atualizado: ', { id: id, ...exercicio });
      result(null, { id: id, ...exercicio });
    }
  );
};

module.exports = Exercicio;