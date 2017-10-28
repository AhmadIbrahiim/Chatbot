var Greeting =
[
    " Hi! may I help you ?",
    "Hello! can I help ?",
    "Hello there! can I help you ",
    "Hey! can I help you",
]

var GreetingAr=
[
    " اهلاً ! هل يمكننى مساعدتك ؟",
    "مرحبا ! هل يمكننى المساعده؟",
    "اهلاً ! هل تقبل منى المساعده ؟",
    "ياالنور! هل يمكننى مساعدتك ؟",
]

var YesHelp = 
[
    "Sure! tell me how do i can help ?",
    "With Plesure! how do I can help ?",
    "Great! How do i can help?",
    "Tell me what do you want me to do?",
    "Such an honor to do that ! tell me how do i can help ?"
]
var Unkonw = 
[
    "I'm sorry! What was that ?",
    "I'm not sure that i understand this",
    "Can't understand this",
    "Sorry! I'm a robot",
    "I'm not a human i'm a robot!",
    

]
var UnkonwAr= 
[
    "اسف! هل يمكننى مساعدتك",
    "للاسف لا يمكننى فهم هذذا",
    "لا يمكننى فهم هذا !",
    "للاسف لا يمكننى الفهم",
    "ماذا كان هذا ؟",
    

]

function RandomGreeting()
{
    return Greeting[Math.floor(Math.random() * Greeting.length)];
}
function RandomGreetinAr()
{
    return GreetingAr[Math.floor(Math.random() * GreetingAr.length)];
}
function RandomYes()
{
    return YesHelp[Math.floor(Math.random() * YesHelp.length)];
}
function RandUnkown()
{
    return Unkonw[Math.floor(Math.random() * Unkonw.length)];    
}
function RandUnkowAr()
{
    return UnkonwAr[Math.floor(Math.random() * UnkonwAr.length)];    
}



module.exports={
    RandomGreeting,
    RandomGreetinAr,
    RandomYes,
    RandUnkown,
    RandUnkowAr
}