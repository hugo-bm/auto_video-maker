

const robot = {
    text: require('./text'),
    state: require('./state'),
    imagem: require('./imagem')
}


async function input(term,prefix,lang){
    const content= {
        searchTerm: "",
        prefix: "",
        maximumSentences: 9,
        sourceContentOriginal: "",
        sourceContentSanitized: "",
        sentences: []
      }
    
    //Aramazenado termo de busca
   
    content.searchTerms = term;
    content.prefix = prefix;
    content.lang = lang;
    robot.state.save(content);
    // Inicalizando os robos

    
    await robot.text();
    await robot.imagem();           
    const saida = robot.state.load();
    
    console.dir(saida,{depth: null})
    
}
module.exports = input