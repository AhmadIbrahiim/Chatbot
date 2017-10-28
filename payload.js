
var facebook = require('./app.js')
var db = require('./database.js');
var ans = require('./ans.js');
var co = require('co')

function Payload(ID,type)
{
  co(function* ()
  {
    if(type=='nopay')
    {

        yield facebook.sendTextMessage(ID,'Ok! No problem');
        yield db.Step(ID,'set','user');
    }
    else if(type=="paynowar")
    {
      yield facebook.sendTextMessage(ID,"برجاء كتابة رقم الفيزا الخاصه بكـ ")
      yield db.Step(ID,'lang',"ar")
      yield db.Step(ID,'set','creditcardar')
    }
    else if(type=="paynowen")
    {
      yield facebook.sendTextMessage(ID,"Enter your credit card no.")
      yield db.Step(ID,'lang',"en")
      yield db.Step(ID,'set','creditcarden')
    }
    else if(type=="nopayar")
    {
      yield facebook.sendTextMessage(ID,'لا مشكلة ! يومك سعيد :) ');
      yield db.Step(ID,'set','user');
    }
  })
}

exports.Payload=Payload;


// [{
//             title: "rift",
//             subtitle: "Next-generation virtual reality",
//             item_url: "https://www.oculus.com/en-us/rift/",
//             image_url: SERVER_URL + "/assets/rift.png",
//             buttons: [{
//               type: "web_url",
//               url: "https://www.oculus.com/en-us/rift/",
//               title: "Open Web URL"
//             }, {
//               type: "postback",
//               title: "Call Postback",
//               payload: "Payload for first bubble",
//             }],
//           }, {
//             title: "touch",
//             subtitle: "Your Hands, Now in VR",
//             item_url: "https://www.oculus.com/en-us/touch/",
//             image_url: SERVER_URL + "/assets/touch.png",
//             buttons: [{
//               type: "web_url",
//               url: "https://www.oculus.com/en-us/touch/",
//               title: "Open Web URL"
//             }, {
//               type: "postback",
//               title: "Call Postback",
//               payload: "Payload for second bubble",
//             }]
//           }]
