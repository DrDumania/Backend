require('dotenv').config();
const Exercicio = require("../models/exercicios.model");

// Devolver um exercicio pelo ID
exports.listarExercicioPorId = (req, res) => {
  const id = req.params.id;

  Exercicio.listarExercicioPorId(id, (err, exercicioData) => {
    if (err) {
      if (err.kind === 'not_found') {
        return res.status(404).send({
          message: `Exercicio with id ${id} not found`
        });
      }
      return res.status(500).send({
        message: 'Error fetching exercicio'
      });
    }

    Exercicio.listarOpcoesPorId(exercicioData.id_opcao, (err, optionsData) => {
      if (err) {
        if (err.kind === 'not_found') {
          return res.status(404).send({
            message: `Options for exercicio with id ${id} not found`
          });
        }
        return res.status(500).send({
          message: 'Error fetching options for exercicio'
        });
      }

      res.send({ ...exercicioData, ...optionsData });
    });
  });
};

// Devolver exercicios pela categoria
exports.listarExercicioPorCategoria = (req, res) => {
  const id_categoria = req.params.id;

  Exercicio.listarExercicioPorCategoria(id_categoria, (err, exerciciosData) => {
    if (err) {
      if (err.kind === 'not_found') {
        return res.status(404).send({
          message: `Exercicios with category id ${id_categoria} not found`
        });
      }
      return res.status(500).send({
        message: 'Error fetching exercicios'
      });
    }

    res.send(exerciciosData);
  });
};

exports.listarExerciciosPorTipo = (req, res) => {
  const tipoExercicioId = req.params.tipoExercicioId;

  Exercicio.listarExerciciosPorTipo(tipoExercicioId, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Ocorreu um erro na obtenção dos exercícios por tipo."
      });
    } else {
      res.send(data);
    }
  });
};

// Inserir um novo exercicio
exports.criarExercicio = (req, res) => {
    console.log('Controller: Received request body:', req.body); // Log request body received by the controller
  
    // Validate the request
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).send({
        message: "O conteúdo do exercicio deve estar definido."
      });
    }
  
    // Create a new Exercicio instance with the request body
    const exercicio = new Exercicio({
      id_utilizador: req.body.id_utilizador,
      id_tipo_exercicio: req.body.id_tipo_exercicio,
      id_dificuldade: req.body.id_dificuldade,
      id_categoria: req.body.id_categoria,
      id_ficheiro: req.body.id_ficheiro,
      pergunta: req.body.pergunta,
      pontuacao: req.body.pontuacao,
    });

    const opcoes = {
      opcao_1: req.body.options1,
      opcao_2: req.body.options2,
      opcao_3: req.body.options3,
      opcao_4: req.body.options4,
      opcao_correta: req.body.correctAnswer,
    };
  
    Exercicio.criarExercicio(exercicio, opcoes, (err, data) => {
      if (err) {
        console.error('Erro ao criar exercicio:', err); 
        return res.status(500).send({
          message: err.message || "Ocorreu um erro ao inserir o exercicio..."
        });
      }
      console.log('Exercicio criado:', data); 
      res.send(data);
    });
  };


  // Devolver todos os exercicios
exports.listarExercicios = (req, res) => {
  const title = req.query.title;

  Exercicio.listarExercicios(title, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Ocorreu um erro na obtenção do(s) utilizadore(s)..."
      });
    else res.send(data);
  });
};

exports.eliminarExercicio = (req, res) => {
  const id = req.params.id;

  Exercicio.eliminarExercicio(id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Exercise with id ${id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Exercise with id " + id
        });
      }
    } else res.send({ message: `Exercise was deleted successfully!` });
  });
};

// Atualizar um exercicio pelo seu id
exports.editarExercicio = (req, res) => {
  // Validar a request
  if (!req.body) {
    res.status(400).send({
      message: "O conteúdo do exercicio deve estar definido."
    });
  }

  Exercicio.editarExercicio(
    req.params.id,
    new Exercicio(req.body),
    (err, data) => {
      if (err) {
        if (err.Exercicio === "not_found") {
          res.status(404).send({
             message: `Não foi encontrado o exercicio com id = ${req.params.id}.`
          });
        } else {
          res.status(500).send({
             message: `Foi gerado um erro a atualizar o excercicio com id = ${req.params.id}.`
          });
        }
      } else res.send(data);
    }
  );
};