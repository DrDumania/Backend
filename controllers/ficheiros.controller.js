const Ficheiro = require("../models/ficheiros.model.js");
const fs = require('fs');
const path = require('path');

// Inserir uma nova Ficheiro
exports.insert = (req, res) => {
  if (!req.file || !req.body.nome_ficheiro) {
    return res.status(400).send({
      message: "O conteúdo do ficheiro deve estar definido."
    });
  }

  const ficheiro = new Ficheiro({
    nome_ficheiro: req.body.nome_ficheiro,
    caminho_ficheiro: `ficheiros/${req.file.filename}`, // Caminho relativo para servir o ficheiro
    tipo_ficheiro: req.body.tipo_ficheiro || 1, // valor padrão de 1
    id_alinea: req.body.id_alinea || null, // Adicionando id_alinea opcionalmente
  });

  Ficheiro.insert(ficheiro, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Ocorreu um erro ao criar o ficheiro."
      });
    } else {
      res.send(data);
    }
  });
};

// Devolver todas as ficheiros
exports.selectAll = (req, res) => {
  Ficheiro.selectAll((err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send({
        message: err.message || "Ocorreu um erro ao obter os ficheiros."
      });
    }
    res.send(data);
  });
};

// Devolver um ficheiro pelo seu id
exports.findById = (req, res) => {
  Ficheiro.findById(req.params.id, (err, data) => {
    if (err) {
      console.error(err);
      if (err.kind === "not_found") {
        return res.status(404).send({
          message: `Não foi encontrado o ficheiro com id = ${req.params.id}.`
        });
      } else {
        return res.status(500).send({
          message: `Erro ao obter o ficheiro com id = ${req.params.id}`
        });
      }
    }
    res.send(data);
  });
};

// Atualizar um ficheiro pelo seu id
exports.update = (req, res) => {
  // Validar a request
  if (!req.body && !req.file) {
    return res.status(400).send({
      message: "O conteúdo não pode estar vazio!"
    });
  }

  // Buscar o ficheiro atual antes de atualizar
  Ficheiro.findById(req.params.id, (err, ficheiroAtual) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).send({
          message: `Ficheiro não encontrado com o id ${req.params.id}.`
        });
      } else {
        return res.status(500).send({
          message: `Erro ao obter o ficheiro com id ${req.params.id}.`
        });
      }
    }

    // Construir objeto ficheiro com dados do body ou file
    const ficheiro = {
      nome_ficheiro: req.body.nome_ficheiro || req.file?.originalname,
      caminho_ficheiro: req.file ? `ficheiros/${req.file.filename}` : req.body.caminho_ficheiro,
      tipo_ficheiro: req.body.tipo_ficheiro || 1,
      id_exercicio: req.body.id_exercicio || null,
    };

    // Atualizar o ficheiro na base de dados
    Ficheiro.updateById(req.params.id, ficheiro, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          return res.status(404).send({
            message: `Ficheiro não encontrado com o id ${req.params.id}.`
          });
        } else {
          return res.status(500).send({
            message: `Erro ao atualizar o ficheiro com id ${req.params.id}.`
          });
        }
      }

      // Excluir o ficheiro antigo se um novo ficheiro for carregado
      if (req.file && ficheiroAtual.caminho_ficheiro) {
        const oldFilePath = path.resolve(__dirname, '..', '..', 'frontend', 'public', ficheiroAtual.caminho_ficheiro);
        fs.unlink(oldFilePath, (err) => {
          if (err) {
            console.error(`Erro ao excluir o ficheiro antigo: ${ficheiroAtual.caminho_ficheiro}`, err);
          } else {
            console.log(`Ficheiro antigo excluído: ${ficheiroAtual.caminho_ficheiro}`);
          }
        });
      }

      res.send(data);
    });
  });
};

// Apagar um ficheiro pelo seu id
exports.delete = (req, res) => {
  Ficheiro.findById(req.params.id, (err, ficheiro) => {
    if (err) {
      console.error(err);
      if (err.kind === "not_found") {
        return res.status(404).send({
          message: `Não foi encontrado o ficheiro com id = ${req.params.id}.`
        });
      } else {
        return res.status(500).send({
          message: `Erro ao obter o ficheiro com id = ${req.params.id}.`
        });
      }
    }

    Ficheiro.delete(req.params.id, (err, data) => {
      if (err) {
        console.error(err);
        if (err.kind === "not_found") {
          return res.status(404).send({
            message: `Não foi encontrado o ficheiro com id = ${req.params.id}.`
          });
        } else {
          return res.status(500).send({
            message: `Erro ao apagar o ficheiro com id = ${req.params.id}.`
          });
        }
      }

      // Excluir o ficheiro físico associado
      if (ficheiro && ficheiro.caminho_ficheiro) {
        const filePath = path.resolve(__dirname, '..', '..', 'frontend', 'public', ficheiro.caminho_ficheiro);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Erro ao excluir o ficheiro: ${ficheiro.caminho_ficheiro}`, err);
          } else {
            console.log(`Ficheiro excluído: ${ficheiro.caminho_ficheiro}`);
          }
        });
      }

      res.send({ message: 'O ficheiro foi eliminado com sucesso.' });
    });
  });
};

// Apagar todos os ficheiros da base de dados
exports.deleteAll = (req, res) => {
  Ficheiro.selectAll((err, ficheiros) => {
    if (err) {
      console.error(err);
      return res.status(500).send({
        message: err.message || 'Erro ao obter os ficheiros.'
      });
    }

    Ficheiro.deleteAll((err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send({
          message: err.message || 'Erro ao apagar todos os ficheiros.'
        });
      }

      // Excluir fisicamente todos os ficheiros associados
      ficheiros.forEach((ficheiro) => {
        if (ficheiro.caminho_ficheiro) {
          const filePath = path.resolve(__dirname, '..', '..', 'frontend', 'public', ficheiro.caminho_ficheiro);
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(`Erro ao excluir o ficheiro: ${ficheiro.caminho_ficheiro}`, err);
            } else {
              console.log(`Ficheiro excluído: ${ficheiro.caminho_ficheiro}`);
            }
          });
        }
      });

      res.send({ message: 'Todos os ficheiros foram eliminados.' });
    });
  });
};

// Controlador para selecionar todos os tipos de ficheiro
exports.selectAllTiposFicheiro = (req, res) => {
  Ficheiro.selectAllTiposFicheiro((err, data) => {
    if (err) {
      return res.status(500).send({
        message: err.message || "Ocorreu um erro na obtenção dos tipos de ficheiro."
      });
    }
    res.send(data);
  });
};

// Controlador para atualizar um tipo de ficheiro pelo seu id
exports.updateTiposFicheiros = (req, res) => {
  // Validar a request
  if (!req.body || !req.body.tipo_ficheiro) {
    return res.status(400).send({
      message: "O conteúdo do tipo de ficheiro deve estar definido."
    });
  }

  Ficheiro.updateTiposFicheirosById(req.params.id, req.body.tipo_ficheiro, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).send({
          message: `Não foi encontrado o tipo de ficheiro com id = ${req.params.id}.`
        });
      } else {
        return res.status(500).send({
          message: `Erro ao atualizar o tipo de ficheiro com id = ${req.params.id}.`
        });
      }
    }
    res.send(data);
  });
};
