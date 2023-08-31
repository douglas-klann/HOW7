const express = require('express'); //npm install express

//Inicializa o WebService
const app = express();
app.listen(8080);


app.get('/get_pagamentos', function (req, res) {
    let sql = "SELECT p.id AS id_venda, p.data_do_pagamento AS data_do_pagamento, p.valor_do_pagamento AS valor_do_pagamento, i.id AS codigo_imovel, i.descricao AS descricao_imovel, t.name AS tipo_imovel FROM pagamentos p JOIN imoveis i ON p.fk_id_imovel = i.id JOIN tipo_imovel t ON i.fk_id_tipo_imovel = t.id ORDER BY id_venda";
    con.query(sql, function (err, result) {
      if (err){
        res.status(500);
        res.send(JSON.stringify(err));
      }else{
        let totalPerImovel = new Map();
        
        result.forEach ( record => {
          
          if(totalPerImovel.get(record['codigo_imovel']) === undefined){
            totalPerImovel.set(record['codigo_imovel'], {
              value:record['amount'], 
              imovel:record['codigo_imovel']
            });
          }else{
            totalPerImovel.get(record['codigo_imovel']).value += record['valor_do_pagamento'];
          }
       });
        console.log(totalPerImovel);
        let arrayTotalPerImovel = Array.from(totalPerImovel.values());
        console.log("arrayTotalPerImovel",arrayTotalPerImovel);
        const GOLD_VALUE = 2000;
        let goldImoveis = arrayTotalPerImovel.filter(el => el.value > GOLD_VALUE);	
        //CORS
        res.status(200);
        res.setHeader('Content-Type', 'application/json');
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods","POST,GET,OPTIONS,PUT,DELETE,HEAD");
        res.setHeader("Access-Control-Allow-Headers","X-PINGOTHER,Origin,X-Requested-With,Content-Type,Accept");
        res.setHeader("Access-Control-Max-Age","1728000");
        res.send(JSON.stringify(goldImoveis));
      }
    });
  });