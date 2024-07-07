// models/tipo_exercicio.model.js
const sql = require("./db.js");

const TipoExercicio = function(tipoExercicio) {
  this.id = tipoExercicio.id;
  this.tipo = tipoExercicio.tipo;
};

TipoExercicio.listarTiposExercicio = (result) => {
  let query = 'SELECT * FROM tipo_exercicio';

  sql.query(query, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }
    console.log("TiposExercicio: ", res);
    result(null, res);
  });
};

TipoExercicio.listarTiposExercicioPorId = (id, result) => {
  const query = `SELECT * FROM tipo_exercicio WHERE id = ?`;

  sql.query(query, [id], (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }
    if (res.length) {
      console.log('found tipo_exercicio: ', res[0]);
      result(null, res[0]);
      return;
    }
    // Not found tipo_exercicio with the id
    result({ kind: 'not_found' }, null);
  });
};

module.exports = TipoExercicio;