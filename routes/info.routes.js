module.exports = app => {
  const informacoes = require("../controllers/info.controller.js");

  let router = require("express").Router();

  router.get("/", informacoes.selectAll);

  router.get("/:id", informacoes.findById);

  router.post("/", informacoes.insert);

  router.put("/:id", informacoes.update);

  router.delete("/:id", informacoes.delete);

  router.delete("/", informacoes.deleteAll);

  app.use('/api/informacoes', router);
};