
const state = require('./state')
const robot = {
    text: require('./text')
}


async function input(term,prefix,lang){
    const content= {
        maximumSentences: 9,
        sentences: []
    }
    
    //Aramazenado termo de busca
   
    content.searchTerms = term;
    content.prefix = prefix;
    content.lang = lang; 
    state.save(content)
    await robot.text()           
    const saida = state.load()
    
    console.dir(saida,{depth: null})
    
}
module.exports = input