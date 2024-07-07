const sql = require("./db.js");

// Constructor
const Categoria = function(categoria) {
  this.id = categoria.id;
  this.categoria = categoria.categoria;
};

Categoria.listarCategorias = (result) => {
  let query = 'SELECT * FROM categoria';

  sql.query(query, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }

    console.log("Categorias: ", res);
    result(null, res);
  });
};

Categoria.listarCategoriasPorId = (id, result) => {
  const query = `SELECT * FROM categoria WHERE id = ?`;

  sql.query(query, [id], (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log('found categoria: ', res[0]);
      result(null, res[0]);
      return;
    }

    // Not found categoria with the id
    result({ kind: 'not_found' }, null);
  });
};

module.exports = Categoria;