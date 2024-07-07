const cookieParser = require("cookie-parser");
  
  module.exports = app => {
    const utilizadores = require("../controllers/utilizadores.controller.js");
  
    let router = require("express").Router();
  
    router.get("/", utilizadores.selectAll);

    router.get("/funcoes", utilizadores.selectAllFuncoes);

    router.get("/:id", utilizadores.findById);

    router.post("/", utilizadores.insert);

    router.put("/:id", utilizadores.update);

    router.put("/:id/funcao", utilizadores.updateFuncao);

    router.delete("/:id", utilizadores.delete);
    
    router.delete("/", utilizadores.deleteAll);

    router.post('/login', utilizadores.findByEmail);

    router.post('/registo', utilizadores.createUser);

    router.put('/:id/pontuacao', utilizadores.atualizarPontuacao);
  
    app.use('/api/utilizadores', router);
  };