//Requerindo
const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const sesion = require('express-session');
const bodyParser = require('body-parser');
const content = require('./modules/cotent');
const robot={
    text: require('./robots/text')
}
//Inicializando
 app.engine('handlebars', handlebars({defaultLayout: 'main'}));
 app.set('view engine','handlebars');
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({extended: true}));
 app.use(sesion({secret: 'bundaDeMacaco',
    resave: true,
    saveUninitialized: true
}));
// Midleweres
app.use((req,res,next)=>{    
    
    next()
});
//rotas pricipais
app.get('/',(req,res)=>{
    res.render('index');
});
app.post('/start',(req,res)=>{    
    const termSearch = req.body.inputSearch;
    const prefix = req.body.inputSelectPrefix
    
    start(termSearch,prefix);
    res.redirect('/');
})

async function start(term,prefix){
    
    //Aramazenado termo de busca
   
    content.searchTerms = askAndReturnSearchTerm();
    content.prefix = askAndReturnPrefix();
    await  robot.text(content);
     function askAndReturnSearchTerm(){
        return term;
    }
     function askAndReturnPrefix(){
        const selectedPrefix = prefix;
        return selectedPrefix;
    }
    
    console.log(content)
    
}


const PORT = process.env.PORT || 1234;
app.listen(PORT,()=>{console.log("Ai caramba!!! Porta "+PORT)});
