//Chamando a IA algorithmia
const algorithmia = require('algorithmia');
// Api key
const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey
const watsonNluApiKey = require('../credentials/watson-nlu.json').apikey
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1.js');
 
const nlu = new NaturalLanguageUnderstandingV1({
  iam_apikey: watsonNluApiKey,
  version: '2018-04-05',
  url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/'
});
const sentenceBondaryDetection = require('sbd');


async function robot(content){
    await fecthContentForwWikipedia(content)
    sanitizeContent(content)
    breakContentIntoSetences(content)
    limitMaximumSentences(content)
    await fetchKeywordsOfAllSentences(content)
    
   async function fecthContentForwWikipedia(content){
        const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey)
        const wikipediaAlgorithm = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2')      
        const wikipediaResponse = await wikipediaAlgorithm.pipe({
            "articleName": content.searchTerms,
            "lang": content.lang
          })
        const wikipediaContent =  wikipediaResponse.get();        
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
    // Separando o texto em sentenças
    function breakContentIntoSetences(content){
        const sentences = sentenceBondaryDetection.sentences(content.sourceContentSanitized);
        sentences.forEach((sentence)=>{
            content.sentences.push({
                text: sentence ,
                keywords: [],
                images: []              
            })
        })
    }
    // limitando o número de sentenças
    function limitMaximumSentences(content){       
        content.sentences = content.sentences.slice(0,content.maximumSentences)
        console.log(content)
    }
   
    //Pegandos as Keywords de todas as sentenças
    async function fetchKeywordsOfAllSentences(content) {
              
    console.log('> [text-robot] Starting to fetch keywords from Watson')

    for (let sentence of content.sentences) {
      console.log(`> [text-robot] Sentence: "${sentence.text}"`)

      sentence.keywords = await fetchWatsonAndReturnKeywords(sentence.text)

      console.log(`> [text-robot] Keywords: ${sentence.keywords.join(', ')}\n`)
    }
  }
    async function fetchWatsonAndReturnKeywords(sentence){
        return new Promise((resolve,reject)=>{
            nlu.analyze({
                text: sentence,
                features: {
                    keywords: {}
                }
            }, (err, response)=>{
                   if (err) {
                    reject(err)
                    return
                   } 
                   const keywords = response.keywords.map((keyword)=>{
                       return keyword.text
                   })
                resolve(keywords)
            })
        })
    }
}
module.exports = robot