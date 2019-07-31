//Chamando a IA algorithmia
const algorithmia = require('algorithmia');
// Api key
const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey

const sentenceBondaryDetection = require('sbd');

async function robot(content){
    await fecthContentForwWikipedia(content)
    sanitizeContent(content)
    breakContentIntoSetences(content)


   async function fecthContentForwWikipedia(content){
        const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey)
        const wikipediaAlgorithm = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2')
        const wikipediaResponde = await wikipediaAlgorithm.pipe(content.searchTerms)
        const wikipediaContent =  wikipediaResponde.get();        
        content.sourceContentOriginal = wikipediaContent.content
    }
    function sanitizeContent(content){// Iniciando limpeza do texto
        // declarando funções
        const whithoutBlankLinesAndMarkdown = removeBlankLinesAndMarkdown(content.sourceContentOriginal)
        const whithoutDatesInParenteses = removeDatesInParenteses(whithoutBlankLinesAndMarkdown)
        // Salvando o conteudo limpo
        content.sourceContentSanitized = whithoutDatesInParenteses
        // funções

       function removeBlankLinesAndMarkdown(text){
           const allLines = text.split('\n')// buscar por quebras de pagina
           const whithoutBlankLinesAndMarkdown = allLines.filter((line)=>{// Passar um filtro em todas as linhas
               // Buscando as linhas em branco e marcadores
            if(line.trim().length === 0 || line.trim().startsWith('=')){// se a decisão for positiva excluir a linha
                 return false;
               }
               return true;
           })
           return whithoutBlankLinesAndMarkdown.join(' ')
       }
       function removeDatesInParenteses(text){
        return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g,' ')
       }
    }
    function breakContentIntoSetences(content){
        const sentences = sentenceBondaryDetection.sentences(content.sourceContentSanitized);
        sentences.forEach((sentence)=>{
            content.sentences.push({
                text: sentence,
                keywords: [],
                images: []
            })
        })
    }
}
module.exports = robot