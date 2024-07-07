module.exports = app => {
  const exercicios = require("../controllers/exercicios.controller.js");

  let router = require("express").Router();

  router.post("/", (req, res, next) => {
    console.log('API Route Hit:', req.body); 
    next();
  }, exercicios.criarExercicio);

  router.get("/", exercicios.listarExercicios);

  router.get('/:id', exercicios.listarExercicioPorId);

  router.get('/categoria/:id', exercicios.listarExercicioPorCategoria);

  router.get("/tipo/:tipoExercicioId", exercicios.listarExerciciosPorTipo);

  router.delete("/:id", (req, res, next) => {
    console.log(`Delete request received for ID: ${req.params.id}`);
    next();
  }, exercicios.eliminarExercicio);

  router.put("/:id", exercicios.editarExercicio);

  app.use('/api/exercicio', router);
};