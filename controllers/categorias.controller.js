require('dotenv').config();
const Categoria = require("../models/categorias.model");

exports.listarCategorias = (req, res) => {
    Categoria.listarCategorias((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Ocorreu um erro na obtenção da(s) categoria(s)..."
      });
    else res.send(data);
  });
};

// Devolver uma opcao
exports.listarCategoriasPorId = async (req, res) => {
    const id_categoria = req.params.id;

    Categoria.listarCategoriasPorId(id_categoria, (err, categoriaData) => {
    if (err) {
      if (err.kind === 'not_found') {
        return res.status(404).send({
          message: `Categorias with id ${id} not found`
        });
      }
      return res.status(500).send({
        message: 'Error fetching categorias'
      });
    }

    res.send(categoriaData);
  });
};
