const mysql = require('mysql'); //npm install mysql

//Define variáveis do MYSQL
const MYSQL_IP="localhost";
const MYSQL_LOGIN="root";
const MYSQL_PASSWORD="admin";

//Monta Conexão
let con = mysql.createConnection({
  host:  MYSQL_IP,
  user: MYSQL_LOGIN,
  password: MYSQL_PASSWORD,
  database: "mydb"
});

//Realiza conexão com MySQL
con.connect(function(err) {
  if (err){
    console.log(err);
    throw err;
  }
  console.log("Conexão Estabelecida!");
});

//Monta Query de Busca
let sql = "SELECT p.id AS id_venda, p.data_do_pagamento AS data_do_pagamento, p.valor_do_pagamento AS valor_do_pagamento, i.id AS codigo_imovel, i.descricao AS descricao_imovel, t.name AS tipo_imovel FROM pagamentos p JOIN imoveis i ON p.fk_id_imovel = i.id JOIN tipo_imovel t ON i.fk_id_tipo_imovel = t.id ORDER BY id_venda";

//Executa Query
if (con.query(sql)) {
  console.log("Query Realizada com sucesso!");
} else {
  console.log("Ocorreu um erro!");
}