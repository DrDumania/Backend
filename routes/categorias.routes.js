module.exports = app => {
    const categorias = require("../controllers/categorias.controller.js");
  
    let router = require("express").Router();

    router.get("/", categorias.listarCategorias);

    router.get('/:id', categorias.listarCategoriasPorId);
      
    app.use('/api/categoria', router);
  };