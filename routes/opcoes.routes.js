module.exports = app => {
    const opcoes = require("../controllers/opcoes.controller.js");
  
    let router = require("express").Router();

    router.get("/", opcoes.listarOpcoes);

    router.get('/:id', opcoes.listarOpcoesPorId);

    router.put('/:id', opcoes.editarOpcao);
      
    app.use('/api/opcao', router);
  };