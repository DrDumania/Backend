module.exports = app => {
    const dificuldades = require("../controllers/dificuldade.controller.js");
    
    let router = require("express").Router();
    
    router.get("/", dificuldades.listarDificuldades);
    
    app.use('/api/dificuldade', router);
  };
  