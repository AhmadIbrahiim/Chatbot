var facebook = require('./app.js')
var db = require('./database.js')
var co =require('co');
var NLP = require('./NLP.js');
var Ans = require('./ans.js')

function Quick(ID,type,text) 
{

  console.log(type,Ans.RandomYes())
      co(function* ()
      {
        var call = yield db.Step(ID,'get','');
        var step =call[0].step;
        if(type=='yeshelp')
        {
          yield facebook.sendTextMessage(ID,Ans.RandomYes());
          yield db.Step(ID,'set','yeshelp');

          
        }
        else if(type=="vichs")
        {
          yield db.Step(ID,'set','payamountafter')					
					yield facebook.sendQuickReply(ID,
					{
						text:"The total amount for all fines pending payment is AED 1456, would you like to",
						quick_replies:
						[
							{
								content_type:'text',
								payload:'payamount',
								title:'Pay amount'
							},
							{
								content_type:'text',
								payload:'option',
								title:'See Details'
							},
							{
								content_type:'text',
								payload:'option',
								title:'Go back'
							}
						]
					})
        }
        else if(type=="vichsar")
        {
          yield db.Step(ID,'set','payamountafterar')					
					yield facebook.sendQuickReply(ID,
					{
						text:"جميع مبلغ الغرامات هو 1230 دينار ..ماذا تريد ان تفعل؟",
						quick_replies:
						[
							{
								content_type:'text',
								payload:'payamountar',
								title:'ادفع المبلغ'
							},
							{
								content_type:'text',
								payload:'option',
								title:'عرض التفاصيل'
							},
							{
								content_type:'text',
								payload:'option',
								title:'ارجع للخلف'
							}
						]
					})
        }
        else if(type=='payamount')
        {
          yield db.Step(ID,'set','user');	
          yield	db.Step(ID,'lang',null)
					
          yield facebook.sendButtonMessage(ID,
            {
              template_type: "button",
              text: "Would like to pay using this chat or using or mobile payment gateway?",
              buttons:[{
                type: "web_url",
                url: "https://warm-woodland-54786.herokuapp.com/open.html?id="+ID,
                title: "Getway",
                webview_height_ratio: "full",
                messenger_extensions: true, 
              },
              {
                type: "postback",
                payload: "paynowen",
                title: "Pay now"
                }]
            }

            
              
          )

        }
        else if(type=="yessurveren")
        {
          yield facebook.sendTextMessage(ID,'Great, thanks.')
          yield facebook.sendTextMessage(ID,"On a scale 1 to 10, how do are you satisfied with this chatbot?");
          yield db.Step(ID,'set','scalefrom')
        }
        else if(type=='nosuveryen')
        {
          facebook.sendTextMessage(ID,"No problem , have a great day :) ");
          yield db.Step(ID,'set','user');	
          yield	db.Step(ID,'lang',null)
        }
        else if(type=='payamountar')
        {
          yield db.Step(ID,'set','user');	
          yield	db.Step(ID,'lang',null)
					
          yield facebook.sendButtonMessage(ID,
            {
              template_type: "button",
              text: "هل ترغب بالدفع بإستخدام وسيط .. ام عن طريق الموبيل ",
              buttons:[{
                type: "web_url",
                url: "https://warm-woodland-54786.herokuapp.com/open.html?id="+ID,
                title: "وسيط",
                webview_height_ratio: "full",
                messenger_extensions: true, 
              },
              {
                type: "postback",
                payload: "paynowar",
                title: "ادفع الان"
                }]
            }

              
          )
        }
        else if(type=='yesfine')
        {
          yield facebook.sendQuickReply(ID,
						{
							text:"Great, is the fine related to Traffic, Visa/RP, or Something else?",
							quick_replies:
							[
								{
									content_type:'text',
									payload:'triffctext',
									title:'Visa/RP Information'
								},
								{
									content_type:'text',
									payload:'triffctext',
									title:'Traffic Tickets'
								},
							]
						})
						yield db.Step(ID,'set','waitfortrorvisa')
        }
        else if(type=="triffctext"||type=='visa/rp')
        {
          yield facebook.sendQuickReply(ID,
            {
              text:"Great! These are the vehicles registered with your account, for which vehicle do you wish to view?",
              quick_replies:
              [
                {
                  content_type:'text',
                  payload:'vichs',
                  title:'AD 12/32432'
                },
                {
                  content_type:'text',
                  payload:'vichs',
                  title:'AD 19/31442'
                },
                {
                  content_type:'text',
                  payload:'vichs',
                  title:'DB TR-213214'
                },
                {
                  content_type:'text',
                  payload:'vichs',
                  title:'DB TR-213214'
                },
                {
                  content_type:'text',
                  payload:'vichs',
                  title:'All Vehicles'
                }
              ]
  
            })
  
            yield db.Step(ID,'set','waitselection')
        }
        else if(type=="triffctextar"||type=='visa/rpar')
        {
          yield facebook.sendQuickReply(ID,
            {
              text:"هذه هي المركبات المسجله على الحساب .. اي مركبة تريد ؟",
              quick_replies:
              [
                {
                  content_type:'text',
                  payload:'vichsar',
                  title:'AD 12/32432'
                },
                {
                  content_type:'text',
                  payload:'vichsar',
                  title:'AD 19/31442'
                },
                {
                  content_type:'text',
                  payload:'vichsar',
                  title:'DB TR-213214'
                },
                {
                  content_type:'text',
                  payload:'vichsar',
                  title:'DB TR-213214'
                },
                {
                  content_type:'text',
                  payload:'vichsar',
                  title:'جميع السيارات'
                }
              ]
  
            })
  
            yield db.Step(ID,'set','waitselectionar')
        }
        else if(type=='yeshelpar')
        {
          yield facebook.sendTextMessage(ID,"شكراً لك .. كيف يمكننى مساعدتك ؟");
          yield db.Step(ID,'set','yeshelp');
        }
        else if(type=='com')
        {
          yield facebook.sendTextMessage(ID,'Ok, please type your complaint');
					yield db.Step(ID,'set','comtexten');
        }
        else if(type=='complainen')
        {
          yield	facebook.sendQuickReply(ID,
            {
              text:"against who ?",
              quick_replies:
              [
                {
                  content_type:"text",
                  title:'Du',
                  payload:'com'
                },
                {
                  content_type:"text",
                  title:'Etisalat',
                  payload:'com'
                }

              ]
            })
            yield db.Step(ID,'set','complain')
        }
        else if(type=='complaintar')
        {
          yield	facebook.sendQuickReply(ID,
            {
              text:"ضد من ؟",
              quick_replies:
              [
                {
                  content_type:"text",
                  title:'Du',
                  payload:'com'
                },
                {
                  content_type:"text",
                  title:'Etisalat',
                  payload:'com'
                }

              ]
            })
            yield db.Step(ID,'set','complainar')
        }
        else if(type=='comar')
        {
          yield facebook.sendTextMessage(ID,'برجاء كتابة نص الشكوى ');
					yield db.Step(ID,'set','comtextar');
        }
        else if(type=='nohelp')
        {
          yield facebook.sendTextMessage(ID,"No problem with that i wished to help");
        }
        else if(type=='nohelpar')
        {
          yield facebook.sendTextMessage(ID,"لا مشكلة .. تمنيت ان اساعد :)");
        }
        else if(type=='paynow'||type=='paynowar')
        {
          facebook.sendTextMessage(ID,'**Not active yet**')
        }
      }
      );
}

exports.Quick=Quick;
