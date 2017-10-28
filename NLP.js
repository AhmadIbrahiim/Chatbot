const request = require('request');
var Promise = require('bluebird')
function GetEntitys(text) {
return new Promise((res,rej)=>{
  request({
      url: 'https://api.wit.ai/message',
      qs: {
        q: text,
        access_token: "HT3WKD7M6UG4CP7WG4ANWSC727DK7W2Y"
      },
      method: 'GET'
    }, function(err, respon, data)

    {

      if (!err) {
        var objejct = JSON.parse(data);
        res(objejct.entities)
      } else {
        console.log(err);
        rej(err);
      }
    }


  );
})
}
exports.GetEntitys=GetEntitys;