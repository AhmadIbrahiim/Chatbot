var facebook = require('./app.js');
var db = require('./database.js');
var Engli = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "G", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];//Alphabet&Digit
var co = require('co');
var NLP = require('./NLP.js');
var Ans = require('./ans.js')
//GetEntitys('Hi ',function(err){ console.log(err.greetings)})
function message(ID, type, text) {
	co(function* () {
		var call = yield db.Step(ID, 'get', '');
		var object = yield facebook.GetuserData(ID);
		var newtext = text.toLowerCase();
		var NL = yield NLP.GetEntitys(newtext);
		var step = call[0].step;
		var lango = call[0].lang
		console.log(call[0])
		var lang = 'ar'
		if (Engli.indexOf(text[0]) > -1) {
			lang = 'en';
		}
		if (lango == null) {
			yield db.Step(ID, 'lang', lang)
		}
		console.log("--->> : "+newtext)
		if (type == "text" /*&& lango == "en"*/) {
			if ((step == 'user' || step == 'new') && typeof NL.greeting != 'undefined') {
				yield facebook.sendQuickReply(ID,
					{
						text: "Welcome to DP Chatbot, how can I help you",
						quick_replies:
						[
							{
								content_type: 'text',
								payload: 'Investor helper',
								title: 'Investor helper'
							},
							{
								content_type: 'text',
								payload: 'Complain',
								title: 'Complain'
							},
							{
								content_type: 'text',
								payload: 'Community Portal',
								title: 'Community Portal'
							},
						]

					})
				yield db.Step(ID, 'set', 'waitforactionwaitforaction')

				//	}
			}
			else if (step == "waitforactionwaitforaction") {
				if(newtext.includes('community'))
				{
					yield facebook.sendQuickReply(ID,
						{
							text: "Please let me know what service do you want?",
							quick_replies:
							[
								{
									content_type: 'text',
									payload: 'Market',
									title: 'Market'
								},
								{
									content_type: 'text',
									payload: 'Handyman',
									title: 'Handyman'
								},
								{
									content_type: 'text',
									payload: 'Security',
									title: 'Security'
								},
							]
	
						})
						yield db.Step(ID,'set','waitforcomun');
				}
				else if(newtext.includes('complaint'))
				{
					yield facebook.sendQuickReply(ID,
						{
							text: "In which Community?",
							quick_replies:
							[
								{
									content_type: 'text',
									payload: 'Shorooq',
									title: 'Shorooq'
								},
								{
									content_type: 'text',
									payload: 'Remraam',
									title: 'Remraam'
								},
								{
									content_type: 'text',
									payload: 'Ghoroob',
									title: 'Ghoroob'
								},
								{
									content_type: 'text',
									payload: 'Layan',
									title: 'Layan'
								}
							]
	
						})
						yield db.Step(ID,'set','waitforcomplaint');	
				}
				else if(newtext.includes('home'))
				{
					yield db.Step(ID, 'set', 'user')
					message(ID,'text','Hi')
					
					
				}
				else
				{
					yield facebook.sendTextMessage(ID,"Please reply with *community* , *complaint* or *home* to back to proceed");
				}
			}
			else if(step=="waitforcomplaint")
			{
				yield facebook.sendTextMessage(ID,"Please write your complaint");
				yield db.Step(ID,'set','complaintext');	
				
			}
			else if(step=="complaintext")
			{
				if(newtext.includes('send'))
				{
					yield facebook.sendTextMessage(ID,"Thank you the complaint was filed and a customer service will be in touch with you soon.Thank you for using DP Chatbot");
					yield facebook.sendTextMessage(ID,"would you have a few minutes to fill a survey related to our services? It will only only be 2 questions taking about 30 seconds");
					yield db.Step(ID,'set','surveryfirst')
				}
				else
				{
					yield facebook.sendTextMessage(ID,"Are you done writing your complaint? Type send to confirm sending your complain")
				}
			}
			else if(step=="surveryfirst")
			{
				if(newtext.includes('yes'))
				{
					yield facebook.sendTextMessage(ID,"Great, thanks. On a scale 1 to 10, how do are you satisfied with our services?");
					yield db.Step(ID,'set','surveryscale')
				}
				else if(newtext.includes('no'))
				{
					yield facebook.sendTextMessage(ID,"Uh Okay , No problem :)")
					yield db.Step(ID, 'set', 'user');
					//yield db.Step(ID, 'lang', null);
				}
				else 
				{
					yield facebook.sendTextMessage(ID,"Please reply with yes or no .. to proceed with the survery.")
				}
			}
			else if(step=="surveryscale")
			{
				if(newtext>0)
				{
					yield facebook.sendTextMessage(ID,"Thank you so much on a scale from 1 to 10, how do are you satisfied with the electronic services of DP ChatBot in general?");
					yield db.Step(ID,'set','ratesurveryscond');
				}
				else{
					
					yield facebook.sendTextMessage(ID,"You have to reply a number between 0 - 10 ");
				}

			}
			else if(step=="ratesurveryscond")
			{
				if(newtext>0)
				{
					yield facebook.sendTextMessage(ID,"Thank you so much!");
					yield db.Step(ID,'set','ratesurveryscond');
				}
				else{
					
					yield facebook.sendTextMessage(ID,"You have to reply a number between 0 - 10 ");
				}
			}
			else if (step == 'waitforcomun') {
				if (newtext.includes('handyman')) {
					yield facebook.sendTextMessage(ID, "How can our handyman help you?");
					yield db.Step(ID, 'set', 'hendyman')
				}
				else if(newtext.includes('home'))
				{
					
					yield db.Step(ID, 'set', 'user')
					message(ID,'text','Hi')
					
					
				}
				else {
					yield facebook.sendTextMessage(ID, "You have to reply with handyman to proceed or home to back!");
				}
			}
			else if (step == "hendyman") {
				yield facebook.sendTextMessage(ID, "Please select a day for our handyman to come");
				yield db.Step(ID, 'set', 'handydate')
			}
			else if (step == "handydate") {
				if (/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/.test(newtext)) {
					yield facebook.sendTextMessage(ID, "Please select a time.");
					yield db.Step(ID, 'set', 'handydatetime')
				}
				else if(newtext.includes('home'))
				{
					yield db.Step(ID, 'set', 'user')
					message(ID,'text','Hi')
					
					
				}
				else {
					yield facebook.sendTextMessage(ID, "You have to reply with a vaild date i.e 7/11/2017 or home to back !");
				}

			}
			else if (step == "handydatetime") {
				if (newtext.includes(':')) {
					yield facebook.sendTextMessage(ID, "Thank you! We have logged your inquiry with regards to Painting Services Required - Living room with Ref No: 00916072 on 7/27/2017.");
					yield db.Step(ID, 'set', 'user');
					//yield db.Step(ID, 'lang', null);
				}
				else {
					yield facebook.sendTextMessage(ID, "Your time format should be simlar to 12:22 ");
				}
			}
			else 
			{
				yield facebook.sendTextMessage(ID,"I'm Sorry but i cannot understand this ! you can type *Hi* to get started ");
				yield db.Step(ID, 'set', 'user');
				
			}

		}
	







	})


}


exports.message = message;
