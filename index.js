//Requerindo
const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const sesion = require('express-session');
const bodyParser = require('body-parser');
const input = require('./robots/input');


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
    const prefix = req.body.inputSelectPrefix;
    const lang = req.body.inputLanguage;
    input(termSearch,prefix,lang);
    
    
    res.redirect('/');
})




const PORT = process.env.PORT || 1234;
app.listen(PORT,()=>{console.log("Ai caramba!!! Porta "+PORT)});
