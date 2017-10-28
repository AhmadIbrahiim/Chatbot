var facebook = require('./app.js');
var db = require('./database.js');
var Engli = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "G", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];//Alphabet&Digit
var co =require('co');
var NLP = require('./NLP.js');
var Ans = require('./ans.js')
//GetEntitys('Hi ',function(err){ console.log(err.greetings)})
function message(ID,type,text)
{	
		co(function* ()	
		{
			var call = yield db.Step(ID,'get','');
			var object = yield facebook.GetuserData(ID);
			var newtext=text.toLowerCase();			
			var NL =  yield NLP.GetEntitys(newtext);
			var step =call[0].step;
			var lango = call[0].lang
			console.log(call[0])
			var lang='ar'
			if(Engli.indexOf(text[0])>-1)
			{
				lang='en';
			}
			if(lango==null)
			{
			 yield	db.Step(ID,'lang',lang)
			}
			else
			{
				lang=lango
			}
			if(step=='comtexten')
			{
				yield facebook.sendTextMessage(ID,"could you please give your phone number ? or can we use your fb phone number ? ");
				yield db.Step(ID,'set','phoneen');
			}
			if(step=='comtextar')
			{
				yield facebook.sendTextMessage(ID,"من فضلك اكتب رقم هاتفك ");
				yield db.Step(ID,'set','phonear');
			}
			else if(step=='phoneen')
			{
				if(newtext.includes('yes')||NL.phone_number!='undefined')
				{
					yield facebook.sendTextMessage(ID,"thank you the complaint was filed and a customer service will be in touch with you soon.");
					yield db.Step(ID,'set','user');
					yield db.Step(ID,'lang',null)
					
				}
				else 
				{
					yield facebook.sendTextMessage(ID,"You may type your phone number or reply with yes to use your facebook phone number");
				}
			}
			else if(step=='phonear')
			{
				if(NL.phone_number!='undefined')
				{
					yield facebook.sendTextMessage(ID,"شكراً لك .. تم تسجيل شكوتك وسوف يتم التواصل مع من قبل الفريق المختص ");
					yield facebook.sendQuickReply(ID,
						{
							text:"Thank you for using MOI Chatbot, would you have a few minutes to fill a survey related to our services? It will only only be 3 questions taking about 30 seconds",
							quick_replies:
							[
								{
									content_type:'text',
									title:'Yes',
									payload:'yessurveren'
								},
								{
									content_type:'text',
									title:'No',
									payload:'nosuveryen'
								}
							]
						})
					
					yield db.Step(ID,'set','surveryen');
					// yield db.Step(ID,'lang',null)
					
				}
				else 
				{
					yield facebook.sendTextMessage(ID,"يجب كتابة رقم الهاتف .. لنواصل مع تسجيل الشكوى");
				}
			}

			if(type=="text"&&lang=="en")
			{
				if((step=='user'||step=='new')&&typeof NL.greeting !='undefined')
				{
					// if(step=='new')
					// {
					// 	yield facebook.sendTextMessage(ID,"Welcome "+object.first_name+" to our Demo bot!\n It's your first experince we hope you enjoyed it!");
					// 	yield facebook.sendQuickReply(ID,
					// 		{
					// 			text:"May i help you ?",
					// 			quick_replies:
					// 			[
					// 				{
					// 					content_type:'text',
					// 					payload:'yeshelp',
					// 					title:'Yes'
					// 				},
					// 				{
					// 					content_type:'text',
					// 					payload:'nohelp',
					// 					title:'No'
					// 				},
					// 			]
	
					// 		})
					// 		yield db.Step(ID,'set','waityes')
							
					// }
					// else 
					// {
						yield facebook.sendQuickReply(ID,
							{
								text:"Welcome "+object.first_name+" to our MOI Chatbot, how can I help you ?",
								quick_replies:
								[
									{
										content_type:'text',
										payload:'visa/rp',
										title:'Visa/RP Information'
									},
									{
										content_type:'text',
										payload:'triffctext',
										title:'Traffic Tickets'
									},
									{
										content_type:'text',
										payload:'complainen',
										title:'Complain'
									},
								]
	
							})
							yield db.Step(ID,'set','waitfortrorvisa')
							
				//	}
				}
			
				else if(newtext=='yes'&&step=='waityes')
				{
					yield facebook.sendTextMessage(ID,Ans.RandomYes());
					yield db.Step(ID,'set','yeshelp');
		  
				} 
				else if(newtext=='no'&&step=='waityes')
				{
					yield facebook.sendTextMessage(ID,"Okay !");
					yield db.Step(ID,'set','user');
					yield	db.Step(ID,'lang',null)
					
		  
				} 
				else if(step=='waityes')
				{
					yield facebook.sendTextMessage(ID,'يكب ان يكون ردك بنعم او لا');
				}
				else if(step=='complain')
				{
					yield facebook.sendTextMessage(ID,'Ok, please type your complaint');
					yield db.Step(ID,'set','comtexten');
					

				}
				else if(step=="creditcarden")
				{
					yield facebook.sendTextMessage(ID,"Enter the expiry date in the format mm/yyyy")
					yield db.Step(ID,'set','expen');
				}
				else if(step=="expen")
				{
					yield facebook.sendTextMessage(ID,"Enter the security code at the back of the card")
					yield db.Step(ID,'set','backcodeen')
				}
				else if(step=="backcodeen")
				{
					yield facebook.sendTextMessage(ID,"Thank you for the information, Please hold until we process your payment.");
					yield db.Step(ID,'set','waitholden')
					setTimeout(()=>
						{
							facebook.sendTextMessage(ID,"thanks for waiting, the Payment of AED 1456 was successfully processed using your credit card ending with 9999. The payment confirmation no is 293792749, would you like to receive the invoice on SMS?")
							db.Step(ID,'set','confirmsmsenglish')
						},10000)
				}
				else if(step=='confirmsmsenglish')
				{
					if(newtext.includes('yes'))
					{
						yield facebook.sendTextMessage(ID,"Thank you ,We'll keep you notifed thorught SMS ")
						yield db.Step(ID,'set','user');
						yield db.Step(ID,'lang',null);
						yield	facebook.sendQuickReply(ID,
							{
								text:"Thank you for using MOI Chatbot, would you have a few minutes to fill a survey related to our services? It will only only be 3 questions taking about 30 seconds",
								quick_replies:
								[
									{
										content_type:'text',
										title:'Yes',
										payload:'yessurveren'
									},
									{
										content_type:'text',
										title:'No',
										payload:'nosuveryen'
									}
								]
							})
						yield db.Step(ID,'set','surveryen')
					}
					else if(newtext.includes('no'))
					{
						yield facebook.sendTextMessage(ID,"No problem , Enjoy your day ")


					}
					else if(newtext.includes('home'))
					{
						yield db.Step(ID,'set','user');
						yield db.Step(ID,'lang',"en");
						message(ID,"text","hi")
						
					}
					else
					{
						yield facebook.sendTextMessage(ID,"You have to reply with *yes* to proceed *no* or *home* to move to another service. .")
						
					}
				}
				else if(step=='waitholden')
				{

				}
				else if(step=='nextscalfrom')
				{
					if(text>10)
					{
						yield facebook.sendTextMessage(ID,"Thanks for the compliment, we will consider that as 10. :D");
						yield db.Step(ID,'set','user');
						yield db.Step(ID,'lang',null);

					}
					else if(text>5)
					{
						yield facebook.sendTextMessage(ID,"Thank you so much")
						yield db.Step(ID,'set','user');
						yield db.Step(ID,'lang',null);
					}
					else 
					{
						yield facebook.sendTextMessage(ID,"Sorry to hear that, can you provide us with a brief description why you rate the services this low?");
						yield db.Step(ID,'set','resonlowrate')
					}
				}
				else if(step=='resonlowrate')
				{
					yield facebook.sendTextMessage(ID,"Thanks for your response, would you mind if one of our customer care staff contacted you to discuss your experience further more?");
					yield db.Step(ID,'set','readytocall')
				}
				else if(step=='readytocall')
				{
					if(newtext.includes('yes'))
					{
						yield facebook.sendTextMessage(ID,"Thanks! We will contact you very soon to check this matter..");
						yield facebook.sendQuickReply(ID,
							{
								text:"Great, Anything else I can help you with?",
								quick_replies:
								[
									{
										content_type:'text',
										payload:'visa/rp',
										title:'Visa/RP Information'
									},
									{
										content_type:'text',
										payload:'triffctext',
										title:'Traffic Tickets'
									},
									{
										content_type:'text',
										payload:'complainen',
										title:'Complain'
									},
								]
	
							})
							yield db.Step(ID,'set','waitfortrorvisa')					
							
					}
					else if(newtext.includes('no'))
					{
						yield facebook.sendQuickReply(ID,
							{
								text:"Great, Anything else I can help you with?",
								quick_replies:
								[
									{
										content_type:'text',
										payload:'visa/rp',
										title:'Visa/RP Information'
									},
									{
										content_type:'text',
										payload:'triffctext',
										title:'Traffic Tickets'
									},
									{
										content_type:'text',
										payload:'complainen',
										title:'Complain'
									},
								]
	
							})
							yield db.Step(ID,'set','waitfortrorvisa')					
					}
					else if(newtext.includes('home'))
					{
						yield db.Step(ID,'set','user');
						yield db.Step(ID,'lang',"en");
						message(ID,"text","hi")
						
					}
					else
					{
						yield facebook.sendTextMessage(ID,"Please reply with *yes* or *no* or *home* to back to services")
					}
					
				}
				else if(step=='scalefrom')
				{
					if(text>10)
					{
						yield facebook.sendTextMessage(ID,"Thanks for the compliment, we will consider that as 10. :)");

					}
					else if(text>5)
					{
						yield facebook.sendTextMessage(ID,"Thank you so much")
					}
					else 
					{
						yield facebook.sendTextMessage(ID,"We're sorry to hear that")
					}
					yield facebook.sendTextMessage(ID,"on a scale from 1 to 10, how do are you satisfied with the electronic services of MOI in general?");
					yield db.Step(ID,'set','nextscalfrom')
				}
				else if(step=='surveryen')
				{
					if(newtext.includes('yes'))
					{
						yield facebook.sendTextMessage(ID,'Great, thanks.')
						yield facebook.sendTextMessage(ID,"On a scale 1 to 10, how do are you satisfied with this chatbot?");
						yield db.Step(ID,'set','scalefrom')
					}
					else if(newtext.includes('no'))
					{
						yield facebook.sendTextMessage(ID,'Oh Okay no problem :) ');
						yield db.Step(ID,'set','user');
						yield db.Step(ID,'lang',null);
					}
					else if(newtext.includes('home'))
					{
						yield db.Step(ID,'set','user');
						yield db.Step(ID,'lang',"en");
						message(ID,"text","hi")
						
					}
					else{
						yield facebook.sendTextMessage(ID,'I expect to reply with yes, no  or *home* to back to services:) ');
				
						
					}
				}
				else  if((newtext.includes('visa')||newtext.includes('traffic'))&&step=='waitfortrorvisa')
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
				else if(step=='payamountafter')
				{
					console.log('Insdie payment after --> ')
					if(newtext.includes('pay')||newtext.includes('yes'))
					{
						// yield db.Step(ID,'set','user');		
						// yield	db.Step(ID,'lang',null)
						
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
							})
						

					}
					else if(newtext.includes('no'))
					{
						yield db.Step(ID,'set','user');
						yield	db.Step(ID,'lang',null)
						
						yield facebook.sendTextMessage(ID,'Okay no problem we have cancled it :) ')
					}
					else if(newtext.includes('home'))
					{
						yield db.Step(ID,'set','user');
						yield db.Step(ID,'lang',"en");
						message(ID,"text","hi")
						
					}
					else{
						yield facebook.sendTextMessage(ID,"I expect that you will say *pay it* to proceed *no* to cancel or *home* to move to another service. ")
					}
				
				}
				else if(step=='waitselection')
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
				else if(step=='payrelatedto')
				{
					if(typeof NL.postive!='undefined')
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
					else
					{
						yield facebook.sendTextMessage(ID,'You have to type something related to *visa* or *traffic* or *home* to back to scervice ')
					}
				}
				else if(step=='waitfortrorvisa'||NL.length>1)
				{
						if(typeof NL.action!='undefined'&&typeof NL.tobe!='undefined')
						{
							yield facebook.sendQuickReply(ID,
								{
									text:"Thanks,, let me confirm, you wish to pay your "+NL.tobe[0].value+". is this correct",
									quick_replies:
									[
										{
											content_type:'text',
											payload:'yesfine',
											title:'Yes'

										},
										{
											content_type:'text',
											payload:'nofine',
											title:'No'

										},
									]
								})

								 yield db.Step(ID,'set','payrelatedto')
								  
						}
						else if(typeof NL.complaint!='undefined')
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
								//Github deploy ..
						}
						else if(newtext.includes('no'))
						{
							yield facebook.sendTextMessage(ID,'Okay , Have a great day :) ');
							yield db.Step(ID,'set','user');
							yield db.Step(ID,'lang',null);

						}
						else if(newtext.includes('home'))
						{
							yield db.Step(ID,'set','user');
							yield db.Step(ID,'lang',"en");
							message(ID,"text","hi")
							
						}
						else 
						{
						yield facebook.sendTextMessage(ID,"Sorry !You have to answer with something related to visa or traffic or fines or home to back to serviescs  ");
						}

				}
				else if(step=='user')
				{
					console.log('else')
					if(typeof NL.thanks !='undefined')
					{
						facebook.sendTextMessage(ID,'Glad to help :) ')
					}
					else if(newtext.includes('no'))
					{
						yield facebook.sendTextMessage(ID,"Have a great day :)")						
						yield	db.Step(ID,'lang',null)						
						
					}
					else 
					{
						yield	db.Step(ID,'lang',null)						
						yield facebook.sendQuickReply(ID,
							{
								text:Ans.RandUnkown(),
								quick_replies:
								[
									{
										content_type:'text',
										payload:'talktohuman',
										title:'Talk to human'
									}
								]
							})	
					}

				}
			}
			if(type=="text"&&lang=="ar")
			{
				if((step=='user'||step=='new')&&typeof NL.greeting !='undefined')
				{
					// if(step=='new')
					// {
					// 	yield facebook.sendTextMessage(ID,"مرحباً "+object.first_name+" الى البوت التجريبى !\n نتمنى لك تجربه سعيده!");
					// 	yield facebook.sendQuickReply(ID,
					// 		{
					// 			text:"هل يمكننى مساعدتك؟ ?",
					// 			quick_replies:
					// 			[
					// 				{
					// 					content_type:'text',
					// 					payload:'yeshelpar',
					// 					title:'نعم'
					// 				},
					// 				{
					// 					content_type:'text',
					// 					payload:'nohelpar',
					// 					title:'لا'
					// 				},
					// 			]
	
					// 		})

					// 	yield db.Step(ID,'set','waityes')
					// }
					// else 
					// {
						yield facebook.sendQuickReply(ID,
							{
								text:"اهلا  "+object.first_name+"  , كيف يمكننى المساعده",
								quick_replies:
								[
									{
										content_type:'text',
										payload:'visa/rpar',
										title:'فيزا/معلومات'
									},
									{
										content_type:'text',
										payload:'triffctextar',
										title:'رخص القيادة'
									},
									{
										content_type:'text',
										payload:'complaintar',
										title:'الشكاوى'
									}
								]
	
							})
							yield db.Step(ID,'set','waitfortrorvisaar')
							
					//}
				}
				else if(step=='waitselectionar')
				{
					yield db.Step(ID,'set','payamountafterar')					
					yield facebook.sendQuickReply(ID,
					{
						text:"اجمالى الغرامات هي 1402 دينار .. ماذا تريد ان تفعل ؟",
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
				else if(step=="creditcardar")
				{
					yield facebook.sendTextMessage(ID,"برجاء كتابة رقم انتهاء الصلاحيه بصيغه شهر/سنه")
					yield db.Step(ID,'set','expar');
				}
				else if(step=="expar")
				{
					yield facebook.sendTextMessage(ID,"برجاء كتابة الثلاث ارقام الخاص بالبنك بظهر الكارت ..")
					yield db.Step(ID,'set','backcodear')
				}
				else if(step=="backcodear")
				{
					yield facebook.sendTextMessage(ID,"شكراً لك .. برجاء الانتظار حتى يتم تنفيذ العملية");
					yield db.Step(ID,'set','waitholdar')
					setTimeout(()=>
						{
							facebook.sendTextMessage(ID,"شكراً لك .. تم تأكيد عملية الدفع مبلغ *1250 ريال * بالكارت الذى ينتهى بـ 9999.. رقم العملية هو *9895552111* هل ترغب ف استقبال المراسالات عن طريق الرسائل النصية ")
							db.Step(ID,'set','confirmsmsarabic')
						},10000)
				}
				else if(step=='confirmsmsarabic')
				{
					if(text.includes('نعم'))
					{
						yield facebook.sendTextMessage(ID,"شكراً لك  .. سوف تستقبل كل التنبيهات علي هاتفك.")
						yield db.Step(ID,'set','user');
						yield db.Step(ID,'lang',null)
					}
					else if(text.includes('لا'))
					{
						yield facebook.sendTextMessage(ID,"لا مشكله .. يومك سعيد")
						yield db.Step(ID,'set','user');
						yield db.Step(ID,'lang',null)
					}
					else
					{
						yield facebook.sendTextMessage(ID,"يجب ان يكن ردك .. ب *نعم* او *لا* للمتابعه")
						
					}

					$.ajax({
						type: "POST",
						url: url,
						data: data,
						success: function(x)
						{
							
						},
						dataType: dataType
					  });
				}
				else if(step=='waitholdar')
				{

				}
				else if(step=='payamountafterar')
				{
					if(newtext.includes('ادفع'))
					{
						yield db.Step(ID,'set','user');	
						yield	db.Step(ID,'lang',null)
						
						yield facebook.sendButtonMessage(ID,
							{
								template_type: "button",
								text: "هل ترغب ف دفع المبلغ بإستخدام وسيط الدفع ام عن طريق الموبيل ؟",
								buttons:[{
								  type: "web_url",
								  url: "https://warm-woodland-54786.herokuapp.com/open.html?id="+ID,
								  title: "وسيط الدفع",
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
					else if(newtext.includes('الغاء'))
					{
						yield db.Step(ID,'set','user');	
						yield	db.Step(ID,'lang',null)
						yield facebook.sendTextMessage(ID,"لا مشكله .. تم الغاء العملية")						
					}
					else
					{
						yield facebook.sendTextMessage(ID,"يجب عليك ان تكتب *ادفع* او *الغاء* للمتابعة")
					}
				}
				else if(newtext=='نعم'&&step=='waityes')
				{
					yield facebook.sendTextMessage(ID,"شكراً لك .. كيف يمكننى مساعدتك ؟");
					yield db.Step(ID,'set','yeshelp');

				} 
				else if(newtext=='لا'&&step=='waityes')
				{
					yield facebook.sendTextMessage(ID,"لا مشكله :)");
					yield db.Step(ID,'set','user');
					yield db.Step(ID,'lang',null);
				} 
				else if(step=='waityes')
				{
					yield facebook.sendTextMessage(ID,'يجب ان يكون رد بـ نعم او لا');
				}
				else if(step=='complainar')
				{
					yield facebook.sendTextMessage(ID,'برجاء كتابة الشكوى : ');
					yield db.Step(ID,'set','comtextar');
					
				}
				else if(step=='waitfortrorvisaar'||NL.length>0)
				{
						if(typeof NL.action!='undefined'&&typeof NL.tobe!='undefined')
						{
							yield facebook.sendTextMessage(ID,"الـ "+NL.tobe[0].value+" الخاصه بك هي 1000 دينار");
							yield facebook.sendButtonMessage(ID,
								{
									template_type: "button",
									text: "هل تريد ان تدفعها ؟",
									buttons:[{
									  type: "web_url",
									  url: "https://www.oculus.com/en-us/rift/",
									  title: "نعم"
									},
									{
										type: "postback",
										payload: "nopayar",
										title: "لا"
									  }]
								  })
								  yield db.Step(ID,'set','user');
								  yield	db.Step(ID,'lang',null)
								  
								  
								  
						}
						else if(typeof NL.complaint!='undefined')
						{
						 yield	facebook.sendQuickReply(ID,
								{
									text:" ؟ضد من  ",
									quick_replies:
									[
										{
											content_type:"text",
											title:'Du',
											payload:'comar'
										},
										{
											content_type:"text",
											title:'Etisalat',
											payload:'comar'
										}

									]
								})
								yield db.Step(ID,'set','complainar')
								
						}
						else if(newtext.includes('فيزا')||newtext.includes('رخصه')||typeof NL.traffic !='undefined')
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
						else 
						{
							facebook.sendTextMessage(ID,"لم افهم ماذا تريد ان اساعدك به ؟")
						}

				}
				else if(step=='user')
				{

					yield	db.Step(ID,'lang',null)					
					yield facebook.sendQuickReply(ID,
						{
							text:Ans.RandUnkowAr(),
							quick_replies:
							[
								{
									content_type:'text',
									payload:'talktohuman',
									title:'تحدث الى انسان'
								}
							]
						})
				}

			}

	

	



			
		})	

	
}


exports.message=message;
