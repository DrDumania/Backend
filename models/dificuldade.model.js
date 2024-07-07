const sql = require("./db.js");

const Dificuldade = function(dificuldade) {
  this.id = dificuldade.id;
  this.dificuldade = dificuldade.dificuldade;
};

Dificuldade.listarDificuldades = result => {
  const query = "SELECT * FROM dificuldade";
  
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
  
    console.log("Dificuldades: ", res);
    result(null, res);
  });
};

module.exports = Dificuldade;
