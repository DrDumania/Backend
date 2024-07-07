// routes/tipo_exercicio.routes.js
module.exports = app => {
    const tipoExercicio = require("../controllers/tipo_exercicio.controller.js");
  
    let router = require("express").Router();
  
    router.get("/", tipoExercicio.listarTiposExercicio);
    router.get("/:id", tipoExercicio.listarTiposExercicioPorId);
  
    app.use('/api/tipo_exercicio', router);
  };
  