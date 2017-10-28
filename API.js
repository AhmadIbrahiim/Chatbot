var Promise = require('bluebird');
var db = require('./database.js');
var Engli = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "G", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];//Alphabet&Digit
var co = require('co');
var NLP = require('./NLP.js');
var Ans = require('./ans.js')

function Text(ID, text) {
    return new Promise((res, rej) => {
        console.log("User text : " + text + " PH:" + ID)
        co(function* () {
            var call = yield db.Step(ID, 'get', '');
            console.log('----------------');
            ;
            console.log(cl);
            //var object = yield facebook.GetuserData(ID);
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
            else {
                lang = lango
            }
            console.log("Lang is : " + lang)
            console.log("User text is : " + text);
            if (step == 'comtexten') {
                if (newtext.includes('send')) {
                    //comtexten1
                    var cl = yield db.GetPayText('comtexten1')
                    res([cl[0].text, { options: cl[0].options }]);
                    yield db.Step(ID, 'set', 'phoneen');
                }
                else {
                    //comtexten2
                    var cl = yield db.GetPayText('comtexten2')
                    res([cl[0].text, { options: cl[0].options }]);
                    yield db.Step(ID, 'comset', text + " ");

                }

            }
            if (step == 'comtextar') {
                if (newtext.includes('ارسال')) {
                    //comtextar1
                    var cl = yield db.GetPayText('comtextar1')
                    res([cl[0].text, { options: null }]);
                    yield db.Step(ID, 'set', 'phonear');
                }
                else {
                    //comtextar2
                    var cl = yield db.GetPayText('comtextar2')
                    res([cl[0].text, { options: null }]);
                    yield db.Step(ID, 'comset', text);
                }

            }
            else if (step == 'phoneen') {
                if (newtext.includes('yes') || /^\d{10}$/.test(text)) {
                    //phoneen1
                    var cl = yield db.GetPayText('phoneen1')
                    res([cl[0].text, { options: ["yes", "no"] }])
                    yield db.Step(ID, 'set', 'surveryen');
                    yield db.Step(ID, 'phone', text);

                }
                else {
                    //phoneen2
                    var cl = yield db.GetPayText('phoneen2')
                    res([cl[0].text, { options: null }]);
                }
            }
            else if (step == 'phonear') {
                if (/^\d{10}$/.test(text)) {
                    //phonear1
                    var cl = yield db.GetPayText('phonear1')

                    res([cl[0].text, { options: null }]);
                    yield db.Step(ID, 'phone', text);
                    yield db.Step(ID, 'set', 'user');
                    yield db.Step(ID, 'lang', null);
                }
                else {
                    //phonear2
                    var cl = yield db.GetPayText('phonear2')
                    res([cl[0].text, { options: null }]);
                }
            }

            console.log("Before English or Arabic --> ")
            if (lang == "en") {
                console.log("Inside text English -->")
                if ((step == 'new') || typeof NL.greeting != 'undefined') {
                    //welcomeen
                    var cl = yield db.GetPayText('welcomeen')

                    res([cl[0].text, { options: ["Visa/RP Information", "Traffic Tickets", "Complain"] }]);
                    yield db.Step(ID, 'set', 'waitfortrorvisa')


                }

                else if (newtext == 'yes' && step == 'waityes') {
                    //yeshelpen
                    var cl = yield db.GetPayText('yeshelpen')

                    res([cl[0].text, { options: null }]);
                    yield db.Step(ID, 'set', 'yeshelp');

                }
                else if (newtext == 'no' && step == 'waityes') {
                    res("Okay !");
                    yield db.Step(ID, 'set', 'user');
                    yield db.Step(ID, 'lang', null)


                }
                else if (step == 'waityes') {
                    var cl = yield db.GetPayText('waityesar')
                    //waityesar
                    res([cl[0].text, { options: ["نعم", "لا"] }]);
                }
                else if (step == 'complain') {
                    if (newtext.includes('etisalat') || newtext.includes('du') || newtext.includes('vergion')) {
                        //com1
                        var cl = yield db.GetPayText('com1')
                        res([cl[0].text, { options: null }]);

                        yield db.Step(ID, 'set', 'comtexten');
                    }
                    else {
                        //com2
                        var cl = yield db.GetPayText('com2')

                        res([cl[0].text, { options: ['du', 'etisalat', 'vergion'] }]);

                    }

                }
                else if (step == "creditcarden") {
                    //credit1
                    var cl = yield db.GetPayText('credit1')
                    res([cl[0].text, { options: null }])
                    yield db.Step(ID, 'set', 'expen');
                }
                else if (step == "expen") {
                    //expen
                    var cl = yield db.GetPayText('expen')
                    res([cl[0].text, { options: null }])
                    yield db.Step(ID, 'set', 'backcodeen')
                }
                else if (step == "backcodeen") {
                    //backcode
                    var cl = yield db.GetPayText('backcode')

                    res([cl[0].text, { options: ['yes', 'no'] }]);
                    yield db.Step(ID, 'set', 'waitholden')
                    // setTimeout(() => {
                    //     facebook.sendTextMessage(ID, "thanks for waiting, the Payment of AED 1456 was successfully processed using your credit card ending with 9999. The payment confirmation no is 293792749, would you like to receive the invoice on SMS?")
                    //     db.Step(ID, 'set', 'confirmsmsenglish')
                    // }, 10000)
                }
                else if (step == 'confirmsmsenglish') {
                    if (newtext.includes('yes')) {
                        //confirmys
                        var cl = yield db.GetPayText('confirmys')

                        res([cl[0].text, { options: cl[0].options }])
                        yield db.Step(ID, 'set', 'surveryen')
                    }
                    else if (newtext.includes('no')) {
                        //confirmnoen
                        var cl = yield db.GetPayText('confirmnoen')

                        res([cl[0].text, { options: null }])


                    }
                    else if (newtext.includes('home')) {
                        //welcomeen
                        var cl = yield db.GetPayText('welcomeen')

                        res([cl[0].text, { options: ["Visa/RP Information", "Traffic Tickets", "Complain"] }]);
                        yield db.Step(ID, 'set', 'waitfortrorvisa')
                        //	message(ID,"text","hi")

                    }
                    else {
                        //replywelcome
                        var cl = yield db.GetPayText('replywelcome')
                        res([cl[0].text, { options: null }])

                    }
                }
                else if (step == 'waitholden') {

                }
                else if (step == 'nextscalfrom') {
                    if (text > 10) {
                        //surverfirst
                        var cl = yield db.GetPayText('surverfirst')

                        res([cl[0].text, { options: null }]);
                        yield db.Step(ID, 'set', 'user');
                        yield db.Step(ID, 'lang', null);

                    }
                    else if (text > 5) {
                        //suerver1
                        res(["Thank you so much", { options: null }])
                        yield db.Step(ID, 'set', 'user');
                        yield db.Step(ID, 'lang', null);
                    }
                    else {
                        //elsesurvery
                        var cl = yield db.GetPayText('elsesurvery')

                        res([cl[0].text, { options: null }]);
                        yield db.Step(ID, 'set', 'resonlowrate')
                    }
                }
                else if (step == 'resonlowrate') {
                    //reasonrate
                    var cl = yield db.GetPayText('reasonrate')
                    res([cl[0].text, { options: null }]);
                    yield db.Step(ID, 'set', 'readytocall')
                }
                else if (step == 'readytocall') {
                    if (newtext.includes('yes')) {
                        //yescallready
                        var cl = yield db.GetPayText('yescallready')
                        res([cl[0].text, { options: ["Visa/RP Information", "Traffic Tickets", "Complain"] }]);
                        yield db.Step(ID, 'set', 'waitfortrorvisa')

                    }
                    else if (newtext.includes('no')) {
                        //noreadyforcall
                        var cl = yield db.GetPayText('noreadyforcall')

                        res([cl[0].text, { options: ["Visa/RP Information", "Traffic Tickets", "Complain"] }])
                        yield db.Step(ID, 'set', 'waitfortrorvisa')
                    }
                    else if (newtext.includes('home')) {
                        //welcomeen
                        var cl = yield db.GetPayText('welcomeen')
                        res([cl[0].text, { options: ["Visa/RP Information", "Traffic Tickets", "Complain"] }]);
                        yield db.Step(ID, 'set', 'waitfortrorvisa')
                    }
                    else {
                        //replywelcome
                        var cl = yield db.GetPayText('replywelcome')
                        res([cl[0].text, { options: null }])
                    }

                }
                else if (step == 'scalefrom') {
                    if (text > 10) {
                        //scalfefrom
                        var cl = yield db.GetPayText('scalfefrom')

                        res([cl[0].text, { options: null }]);

                    }
                    else if (text > 5) {
                        //ratebelow5
                        var cl = yield db.GetPayText('ratebelow5')
                        res([cl[0].text, { options: null }]);
                    }
                    else {
                        res("We're sorry to hear that" + " on a scale from 1 to 10, how do are you satisfied with the electronic services of MOI in general?", { options: null })
                    }
                    yield db.Step(ID, 'set', 'nextscalfrom')
                }
                else if (step == 'surveryen') {
                    if (newtext.includes('yes')) {
                        //surveryen
                        var cl = yield db.GetPayText('surveryen')

                        res([cl[0].text, { options: null }])
                        yield db.Step(ID, 'set', 'scalefrom')
                    }
                    else if (newtext.includes('no')) {
                        //noprosurv
                        res(['Oh Okay no problem :) ', { options: null }]);
                        yield db.Step(ID, 'set', 'user');
                        yield db.Step(ID, 'lang', null);
                    }
                    else if (newtext.includes('home')) {
                        //welcomeen
                        var cl = yield db.GetPayText('welcomeen')
                        res([cl[0].text, { options: ["Visa/RP Information", "Traffic Tickets", "Complain"] }]);
                        yield db.Step(ID, 'set', 'waitfortrorvisa')

                    }
                    else {
                        //expecthome
                        var cl = yield db.GetPayText('expecthome')

                        res([cl[0].text, { options: null }]);
                    }
                }
                else if ((newtext.includes('visa') || newtext.includes('traffic')) && step == 'waitfortrorvisa') {
                    //visatrafi
                    var cl = yield db.GetPayText('visatrafi')

                    res([cl[0].text, { options: ["AD 12/32432", "AD 12/3242", "All"] }]);
                    yield db.Step(ID, 'set', 'waitselection')
                }
                else if (step == 'payamountafter') {
                    console.log('Insdie payment after --> ')
                    if (newtext.includes('pay')) {
                        //payafter
                        var cl = yield db.GetPayText('payafter')

                        res([cl[0].text, { options: ["yes", "no"] }]);

                    }
                    else if (newtext.includes('no')) {
                        //nopay
                        var cl = yield db.GetPayText('nopay')
                        res([cl[0].text, { options: null }]);
                        yield db.Step(ID, 'set', 'user');
                        yield db.Step(ID, 'lang', null)
                    }
                    else if (newtext.includes('yes') || newtext.includes('pay it') || newtext.includes('mobile')) {
                        //thankspaying
                        var cl = yield db.GetPayText('thankspaying')

                        res([cl[0].text, { options: null }]);
                        yield db.Step(ID, 'set', 'user');
                        yield db.Step(ID, 'lang', null)

                    }
                    else if (newtext.includes('home')) {
                        //welcomeen
                        var cl = yield db.GetPayText('welcomeen')

                        res([cl[0].text, { options: ["Visa/RP Information", "Traffic Tickets", "Complain"] }]);
                        yield db.Step(ID, 'set', 'waitfortrorvisa')

                    }
                    else {
                        //expecthome
                        var cl = yield db.GetPayText('expecthome')

                        res([cl[0].text, { options: null }])
                    }

                }
                else if (step == 'waitselection') {
                    yield db.Step(ID, 'set', 'payamountafter')
                    //totalpayment
                    var cl = yield db.GetPayText('totalpayment')
                    res([cl[0].text, { options: ["Pay amount", "See Details", "Go back"] }])
                }
                else if (step == 'payrelatedto') {
                    if (typeof NL.postive != 'undefined') {
                        //nopostiveres
                        var cl = yield db.GetPayText('nopostiveres')

                        res([cl[0].text, { options: ["Visa/RP Information", "Traffic Tickets", "Complain"] }]);
                        yield db.Step(ID, 'set', 'waitfortrorvisa')
                    }
                    else {
                        //replywithvisa
                        var cl = yield db.GetPayText('replywithvisa')

                        res([cl[0].text, { options: ["yes", "no"] }])
                    }
                }
                else if (step == 'waitfortrorvisa') {
                    if (typeof NL.action != 'undefined' && typeof NL.tobe != 'undefined') {
                        //waitforvisatake
                        var cl = yield db.GetPayText('waitforvisatake')

                        res(["Thanks,, let me confirm, you wish to pay your " + NL.tobe[0].value + ". is this correct", { options: ["yes", "no"] }])
                        yield db.Step(ID, 'set', 'payrelatedto')

                    }
                    else if (typeof NL.complaint != 'undefined') {
                        //agianstwho
                        var cl = yield db.GetPayText('agianstwho')

                        res([cl[0].text, { options: cl[0].options }]);
                        yield db.Step(ID, 'set', 'complain')
                        //Github deploy ..
                    }
                    else if (newtext.includes('no')) {
                        //haveagreatdayno

                        res(['Okay , Have a great day :) ', { options: null }]);
                        yield db.Step(ID, 'set', 'user');
                        yield db.Step(ID, 'lang', null);

                    }
                    else if (newtext.includes('home')) {
                        //welcomeen
                        var cl = yield db.GetPayText('welcomeen')

                        res([cl[0].text, { options: cl[0].options }]);
                        yield db.Step(ID, 'set', 'waitfortrorvisa')

                    }
                    else {
                        //replyvisafor
                        var cl = yield db.GetPayText('replyvisafor')

                        res([cl[0].text, { options: null }]);
                    }

                }
                else if (step == 'user') {
                    console.log('else')
                    if (typeof NL.thanks != 'undefined') {
                        res(['Glad to help :) ', { options: null }])
                    }
                    else if (newtext.includes('no')) {
                        res("Have a great day :)")
                        yield db.Step(ID, 'lang', null)

                    }
                    else {
                        //welcomeen
                        var cl = yield db.GetPayText('welcomeen')

                        res([cl[0].text, { options: cl[0].options }]);
                        yield db.Step(ID, 'set', 'waitfortrorvisa')
                        //res(Ans.RandUnkown())
                    }

                }
            }
            if (lang == "ar") {
                if ((step == 'user' || step == 'new') /* && typeof NL.greeting != 'undefined' */) {
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
                    var cl = yield db.GetPayText('weclomear')

                    res([cl[0].text, { options:cl[0].options }]);
                    yield db.Step(ID, 'set', 'waitfortrorvisaar')
                    //weclomear

                    //}
                }
                else if (step == 'waitselectionar') {
                    yield db.Step(ID, 'set', 'payamountafterar')
                    //totalpayar
                    var cl = yield db.GetPayText('totalpayar')
                    
                    res([cl[0].text, { options: ["ادفع"] }]);
                }
                else if (step == "creditcardar") {
                    //expdataarcred
                    var cl = yield db.GetPayText('expdataarcred')
                    
                    res([cl[0].text, { options: null }])
                    yield db.Step(ID, 'set', 'expar');
                }
                else if (step == "expar") {
                    //expback
                    var cl = yield db.GetPayText('expback')
                    res([cl[0].text, { options: null }])
                    yield db.Step(ID, 'set', 'backcodear')
                }
                else if (step == "backcodear") {
                    //backcodear
                    var cl = yield db.GetPayText('backcodear')
                    
                    res([cl[0].text, { options: ["نغم", "لا"] }]);
                    yield db.Step(ID, 'set', 'confirmsmsarabic')

                }
                else if (step == 'confirmsmsarabic') {
                    if (text.includes('نعم')) {
                        //yesnotifiar
                        var cl = yield db.GetPayText('yesnotifiar')
                        
                        res([cl[0].text, { options: null }])
                        yield db.Step(ID, 'set', 'user');
                        yield db.Step(ID, 'lang', null)
                    }
                    else if (text.includes('لا')) {
                        res("لا مشكله .. يومك سعيد")
                        yield db.Step(ID, 'set', 'user');
                        yield db.Step(ID, 'lang', null)
                    }
                    else {
                        //replywithyesar
                        var cl = yield db.GetPayText('replywithyesar')
                        
                        res([cl[0].text, { options: null }])

                    }


                }
                else if (step == 'payamountafterar') {
                    if (newtext.includes('ادفع')) {
                        //doyouwanttopay
                        var cl = yield db.GetPayText('doyouwanttopay')
                        
                        res([cl[0].text, { options: ["وسيط", "موبيل"] }])
                    }
                    else if (newtext.includes('وسيط') || newtext.includes('موبيل')) {
                        //processtoar
                        var cl = yield db.GetPayText('processtoar')
                        
                        res([cl[0].text, { options: null }])
                        yield db.Step(ID, 'set', 'user');
                        yield db.Step(ID, 'lang', null);

                    }
                    else if (newtext.includes('الغاء')) {
                        //cancelprocess
                        var cl = yield db.GetPayText('cancelprocess')
                        
                        res([cl[0].text, { options: null }])
                        yield db.Step(ID, 'set', 'user');
                        yield db.Step(ID, 'lang', null);
                    }
                    else {
                        //youhavetoreply
                        var cl = yield db.GetPayText('youhavetoreply')
                        
                        res([cl[0].text, { options: null }])
                    }
                }
                else if (newtext == 'نعم' && step == 'waityes') {
                    res(["شكراً لك .. كيف يمكننى مساعدتك ؟", { options: null }]);
                    yield db.Step(ID, 'set', 'yeshelp');

                }
                else if (newtext == 'لا' && step == 'waityes') {
                    res("لا مشكله :)");
                    yield db.Step(ID, 'set', 'user');
                    yield db.Step(ID, 'lang', null);
                }
                else if (step == 'waityes') {
                    res(['يجب ان يكون رد بـ نعم او لا', { options: null }]);
                }
                else if (step == 'complainar') {
                    if (newtext.includes('اتصالات')||newtext.includes('دو')||newtext.includes('فيرجين')) {
                        //writecomar
                        var cl = yield db.GetPayText('writecomar')
                        res([cl[0].text, { options: null }]);
                        yield db.Step(ID, 'set', 'comtextar');
                    }
                    else {
                        //youhavetoreplyc
                        var cl = yield db.GetPayText('youhavetoreplyc')
                        res([cl[0].text, { options: cl[0].options }])
                    }


                }
                else if (step == 'waitfortrorvisaar') {
                    if (typeof NL.action != 'undefined' && typeof NL.tobe != 'undefined') {
                        res(["الـ " + NL.tobe[0].value + " الخاصه بك هي 1000 دينار" + "هل تريد ان تدفعها ؟", { options: ["نعم", "لا"] }]);
                    }
                    else if (typeof NL.complaint != 'undefined') {
                        var cl = yield db.GetPayText('writecomar')
                        //againswhoar
                        var cl = yield db.GetPayText('againswhoar')
                        
                        res([cl[0].text, { options: cl[0].options }]);
                        yield db.Step(ID, 'set', 'complainar')

                    }
                    else if (newtext.includes('فيزا') || newtext.includes('رخصه') || typeof NL.traffic != 'undefined') {

                        res(["هذه هي المركبات المسجله على الحساب .. اي مركبة تريد ؟", { options: ["Ad/555", "Ad/77555"] }])
                        yield db.Step(ID, 'set', 'waitselectionar')
                    }
                    else {
                        res(["يجب ان يكون ردك له علاقة بالفيزا او الرخصة ", { options: null }])
                    }

                }
                else if (step == 'user') {

                    yield db.Step(ID, 'lang', null)
                    res([Ans.RandUnkowAr(), { options: null }])
                }

            }








        })

    })

}

module.exports = { Text, }