var mysql = require("mysql");
var facebook = require('./app.js')
var Promise = require('bluebird')


var connection = mysql.createConnection({
  host: 'prayerconnection.cr9xax1d2k8r.us-west-2.rds.amazonaws.com',
  user: 'prayer',
  password: 'qoln5n5ayad',
  database: 'Prayer'
});
setInterval(function () {
  connection.query('SELECT 1');
}, 5000);

function Step(ID, target, val) {
  return new Promise((res, rej) => {
    if (target == 'get') {
      QueryBuilder("SELECT * from user where ID=?", [ID], (ca) => {
        if (ca.length == 0) {

          QueryBuilder("insert into user (ID,step) values (?,?)", [ID, 'user'], (xx) => { })
          res([{ step: 'new' }])


        }

        else {
          res(ca)
        }

      })
    }
    else if (target == 'lang') {
      QueryBuilder("update user set lang=? where ID=?", [val, ID], (xs) => { res(xs) });

    }
    else if (target == 'phone') {
      QueryBuilder("update user set phone=? where ID=?", [val, ID], (xs) => { res(xs) });
    }
    else if (target == 'comset') {
      QueryBuilder("update user set com= CONCAT(?,com) where ID=?", [val, ID], (xs) => { res(xs) });
    }
    else if (target == 'comreset') {
      QueryBuilder("update user set com='' where ID=?", [val, ID], (xs) => { res(xs) });
    }
    else if (target == 'set') {
      QueryBuilder("update user set step=? where ID=?", [val, ID], (xs) => { res(xs) });
    }
  })
}

function GetPayText(pay)
{
  return new Promise((res,rej)=>
  {
    QueryBuilder("Select * from payload where payload.key=?",[pay],x=>
    {
     if(x[0].options!=null)
     {
       x[0].options = x[0].options.split(',');
     }
      res(x);
    })
  })
}

function InseryPayload(key,text,option)
{
  return new Promise((res,rej)=>{
  

     QueryBuilderA("Insert into payload values (?,?,?)",[key,text,option]).catch(er=>
      {
        console.log(er)
        QueryBuilderA("update payload set text=? , options=? where payload.key=?",[text,option,key]).catch(x=>{console.log("ُErro with update")})  
        res('done')
      })
    
      
  

  })
}
function QueryBuilder(query, prams, callback) {
  connection.query(query, prams, (err, data) => {
    if (err)
      console.log(err);
    else
      callback(data);
  })
}
function QueryBuilderA(query, prams) {
  return new Promise((res,rej)=>{
  connection.query(query, prams, (err, data) => {
    if (err)
    {
      console.log(err);
      rej("err");      
    }
    else
      res(data);
  })
})
}


module.exports =
  {
    Step: Step,
    InseryPayload,
    GetPayText
  }


