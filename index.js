const mysql = require('mysql');
const express = require('express');

//Inicia Web Server
const app = express();
app.listen(8080);

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

/*Executa Query
if (con.query(sql)) {
  console.log("Query Realizada com sucesso!");
} else {
  console.log("Ocorreu um erro!");
}*/

//Total imóvel id
app.get('/total_per_id', function (req, res) {
  con.query(sql, function (err, result) {
    if (err){
      res.status(500);
      res.send(JSON.stringify(err));
    }else{
      let totalPerId = new Map();
      console.log(result);
      
      result.forEach ( record => {
        
        if(totalPerId.get(record['codigo_imovel']) === undefined){
          totalPerId.set(record['codigo_imovel'], {
            total_value: record['valor_do_pagamento'], 
            id_imovel:record['codigo_imovel']
          });
        }else{
          totalPerId.get(record['codigo_imovel']).total_value += record['valor_do_pagamento'];
        }
      });

      //monta array
      let arrayTotalPerId = Array.from(totalPerId.values());

      //exibe resultados
      res.status(200);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods","POST,GET,OPTIONS,PUT,DELETE,HEAD");
      res.setHeader("Access-Control-Allow-Headers","X-PINGOTHER,Origin,X-Requested-With,Content-Type,Accept");
      res.setHeader("Access-Control-Max-Age","1728000");
      res.send(JSON.stringify(arrayTotalPerId));
      
    }
  });
});

//Total por mês/ano
app.get('/total_per_month_year', function (req, res) {
  con.query(sql, function (err, result) {
    if (err){
      res.status(500);
      res.send(JSON.stringify(err));
    }else{
      let totalPerMonth = new Map()
      
      result.forEach ( record => {
        let date = new Date(record['data_do_pagamento']);
        let year = date.getFullYear();
        let month = date.getMonth()+1;
        let periodKey = year+"_"+month;
        console.log(periodKey);
        if(totalPerMonth.get(periodKey) === undefined){
          totalPerMonth.set(periodKey , {
            total_value: record['valor_do_pagamento'], 
            year : year,
            month: month
          });
        }else{
          totalPerMonth.get(periodKey).total_value += record['valor_do_pagamento'];
        }
     });

     //monta array
      let arrayTotalPerMonth = Array.from(totalPerMonth.values());
 
      //exibe resultados
      res.status(200);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods","POST,GET,OPTIONS,PUT,DELETE,HEAD");
      res.setHeader("Access-Control-Allow-Headers","X-PINGOTHER,Origin,X-Requested-With,Content-Type,Accept");
      res.setHeader("Access-Control-Max-Age","1728000");
      res.send(JSON.stringify(arrayTotalPerMonth));
      
    }
  });
});

//Proporção por tipo
app.get('/proportion_per_type', function (req, res) {
  con.query(sql, function (err, result) {
    if (err){
      res.status(500);
      res.send(JSON.stringify(err));
    }else{
      let proportionPerType = new Map()
      let totalElements = result.length;
      result.forEach ( record => {
        let type = record['tipo_imovel'];
        if(proportionPerType.get(type) === undefined){
          proportionPerType.set(type , {
            value: 1, 
            rating: type,
          });
        }else{
          proportionPerType.get(type).value++;
        }
     });

      //monta array
      let arrayproportionPerType = Array.from(proportionPerType.values());
      arrayproportionPerType = arrayproportionPerType.map( el => {
        el.proportion = (el.value/totalElements)*100;
        return el;
      });

      //exibe resultados
      res.status(200);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods","POST,GET,OPTIONS,PUT,DELETE,HEAD");
      res.setHeader("Access-Control-Allow-Headers","X-PINGOTHER,Origin,X-Requested-With,Content-Type,Accept");
      res.setHeader("Access-Control-Max-Age","1728000");
      res.send(JSON.stringify(arrayproportionPerType));
      
    }
  });
});