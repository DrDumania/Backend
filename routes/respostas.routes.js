module.exports = app => {
    const respostas = require("../controllers/respostas.controller.js");
  
    let router = require("express").Router();

    router.get("/", respostas.listarRespostas);

    router.get('/:id', respostas.listarRespostasPorId);

    router.post('/', respostas.criarResposta);
      
    app.use('/api/resposta', router);
  };