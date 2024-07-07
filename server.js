const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;
const corsOptions = { origin: "http://localhost:3000" };

app.use(cors(corsOptions));

// Middleware para analisar pedidos com content-type application/json
app.use(express.json());

// Middleware para analisar pedidos com content-type application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Rota de teste - verifica se o servidor está funcionando
app.get("/", (req, res) => {
  res.json({ message: "Gengo API . IPVC" });
});

// Importa as rotas dos utilizadores
require("./routes/utilizadores.routes.js")(app);
require("./routes/exercicios.routes.js")(app);
require("./routes/opcoes.routes.js")(app);
require("./routes/categorias.routes.js")(app);
require("./routes/respostas.routes.js")(app);
require("./routes/ficheiros.routes.js")(app);
require("./routes/tipo_exercicio.routes.js")(app);
require("./routes/dificuldade.routes.js")(app);
require("./routes/info.routes.js")(app);

// Ativa o servidor para receber pedidos na porta definida
app.listen(PORT, () => {
  console.log(`Servidor ativo na porta ${PORT}.`);
});
