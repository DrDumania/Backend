require('dotenv').config();
const Utilizadores = require("../models/utilizadores.model.js");
const bcryptjs = require('bcryptjs');
const jwt = require("jsonwebtoken");
var cookieParser = require('cookie-parser')

// Inserir um novo utilizadore
exports.insert = (req, res) => {
  // Validar a request
  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).send({
      message: "O conteúdo do utilizadore deve estar definido."
    });
  } else {

  const utilizadores = new Utilizadores({
    username	 : req.body.username,
    password	: req.body.password,
    email	: req.body.email,
    nacionalidade	: req.body.nacionalidade
  });

  // Guardar "Utilizadores" na base de dados
  Utilizadores.insert(utilizadores, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Ocorreu um erro ao inserir o utilizadore..."
      });
    else res.send(data);
  });
}
};

// Devolver todos os utilizadores (ou filtrar por determinado nome - total ou parcial)
exports.selectAll = (req, res) => {
  const title = req.query.title;

  Utilizadores.selectAll(title, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Ocorreu um erro na obtenção do(s) utilizadore(s)..."
      });
    else res.send(data);
  });
};

exports.selectAllFuncoes = (req, res) => {
  const funcao = req.query.funcao;

  Utilizadores.selectAllFuncoes(funcao, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Ocorreu um erro na obtenção da(s) funçoes(s)..."
      });
    else res.send(data);
  });
};

// Devolver um utilizadore pelo seu id
exports.findById = async (req, res) => {
  Utilizadores.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.utilizador === "not_found") {
        res.status(404).send({
          message: `Não foi encontrado o utilizador com id = ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Erro ao obter utilizador com id = " + req.params.id
        });
      }
    } else res.send(data);
  });
};

exports.findByEmail = async (req, res) => {
  try {
    // Find the user by email
    const user = await Utilizadores.findByEmail(req.body.email);
    
    if (!user) {
      return res.status(404).send({
        message: `Não foi encontrado o utilizador com email = ${req.body.email}.`
      });
    }

    // Generate the token
    const token = jwt.sign({ id_utilizador: user.id, email: user.email, username: user.username, id_funcao: user.id_funcao }, 'verySecretKey', { expiresIn: "1h" });

    // Send the token as a cookie
    res.status(200).cookie("token", token, { httpOnly: true }).json({
      message: "Autenticação bem-sucedida.",
      token: token
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Erro ao obter utilizador com email = " + req.body.email
    });
  }
};


exports.createUser = async (req, res) => {
  try {
    // Validate the request
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).send({
        message: "O conteúdo do utilizador deve estar definido."
      });
    }

    // Check if the email already exists
    const existingUser = await Utilizadores.findByEmail(req.body.email);
    if (existingUser) {
      return res.status(400).send({
        message: "O email já tem uma conta atribuída."
      });
    }

    // Encrypt the password
    const hashedPassword = await bcryptjs.hash(req.body.password, 10);

    // Create a new user object
    const utilizadores = new Utilizadores({
      email: req.body.email,
      username: req.body.username,
      nacionalidade: req.body.nacionalidade,
      password: hashedPassword,
    });

    // Save the user to the database
    const user = await Utilizadores.createUser(utilizadores);
    if (!user) {
      return res.status(500).send({
        message: "Erro ao criar o utilizador."
      });
    }

    // Generate a token for the new user
    const token = jwt.sign({ id_utilizador: user.id, email: user.email, username: user.username, id_funcao: user.id_funcao }, 'verySecretKey', { expiresIn: '1h' });

    // Send the response
    res.status(201).send({
      message: "Utilizador criado com sucesso.",
      token: token
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Ocorreu um erro ao criar o utilizador..."
    });
  }
};

// Atualizar um utilizadore pelo seu id
exports.update = (req, res) => {
  // Validar a request
  if (!req.body) {
    res.status(400).send({
      message: "O conteúdo do utilizadore deve estar definido."
    });
  }

  Utilizadores.updateById(
    req.params.id,
    new Utilizadores(req.body),
    (err, data) => {
      if (err) {
        if (err.Utilizadores === "not_found") {
          res.status(404).send({
             message: `Não foi encontrado o utilizadore com id = ${req.params.id}.`
          });
        } else {
          res.status(500).send({
             message: `Foi gerado um erro a atualizar o utilizadore com id = ${req.params.id}.`
          });
        }
      } else res.send(data);
    }
  );
};

// Atualizar a função de um utilizador pelo seu id
exports.updateFuncao = (req, res) => {
  // Validar a request
  if (!req.body || !req.body.id_funcao) {
    res.status(400).send({
      message: "O conteúdo da função deve estar definido."
    });
    return;
  }

  Utilizadores.updateFuncaoById(req.params.id, req.body.id_funcao, (err, data) => {
    if (err) {
      if (err.utilizador === "not_found") {
        res.status(404).send({
          message: `Não foi encontrado o utilizador com id = ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: `Erro ao atualizar a função do utilizador com id = ${req.params.id}.`
        });
      }
    } else res.send(data);
  });
};


// Apagar um utilizadore pelo seu id
exports.delete = (req, res) => {
  Utilizadores.delete(req.params.id, (err, data) => {
    if (err) {
      if (err.Utilizadores === "not_found") {
        res.status(404).send({
          message: `Não foi encontrado o utilizadore com id = ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: `Foi gerado um erro a apagar o utilizadore com id = ${req.params.id}.`
        });
      }
    } else res.send({ message: 'O utilizadore foi eliminado com sucesso.' });
  });
};

// Apagar todos os utilizadores da base de dados
exports.deleteAll = (req, res) => {
  Utilizadores.deleteAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || 'Foi gerado um erro a apagar a totalidade dos utilizadores.'
      });
    else res.send({ message: 'Todos os utilizadores foram eliminados...' });
  });
};

exports.atualizarPontuacao = async (req, res) => {
  const id_utilizador = req.params.id;
  const pontos = req.body.pontos;

  try {
    Utilizadores.atualizarPontuacao(id_utilizador, pontos, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found User with id ${id_utilizador}.`
          });
        } else {
          res.status(500).send({
            message: `Error updating points for User with id ${id_utilizador}`
          });
        }
      } else res.send(data);
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while updating the user's points."
    });
  }
};
