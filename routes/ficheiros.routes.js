const path = require('path');

// Configuração do multer para upload de ficheiros
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.resolve(__dirname, '..', '..', 'frontend', 'public', 'ficheiros'));
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({ storage });

module.exports = app => {
  const ficheiro = require("../controllers/ficheiros.controller.js");

  let router = require("express").Router();

  router.get("/", ficheiro.selectAll);

  router.get("/:id", ficheiro.findById);

  router.post("/", upload.single('file'), ficheiro.insert);

  router.put("/:id", upload.single('file'), ficheiro.update);

  router.delete("/:id", ficheiro.delete);

  router.delete("/", ficheiro.deleteAll);

  router.get("/tipos/ficheiros", ficheiro.selectAllTiposFicheiro);

  router.post("/tipos/ficheiros/:id", ficheiro.updateTiposFicheiros);

  app.use('/api/ficheiros', router);
};