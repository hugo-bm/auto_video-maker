const state = require("./state");
const google = require('googleapis').google
const customSearch = google.customsearch('v1')
const goolgleSearchCredentials = require('../credentials/search-google.json')

async function robot(){

    const content = state.load()

    await fechtImagesofAllSentences(content)

    state.save(content);

//funções
    async function fechtImagesofAllSentences(content){
        for(const sentence of content.sentences){
            const query = String(content.searchTerms +' '+ sentence.keywords[0])
            sentence.images = await fechtGoogleAndReturnImagensLinks(query)
            sentence.searchGoogleQuery = query;
        }
    }

    async function fechtGoogleAndReturnImagensLinks(query){
        const response = await customSearch.cse.list({
            key: goolgleSearchCredentials.apikey,
            cx:  goolgleSearchCredentials.searchEngineId,
            q: query,
            searchType: 'image',
            num: 2 
        })
        const imagesUrl = response.data.items.map((item)=>{
            return item.link;
        })
        return imagesUrl;
    }       
}

module.exports = robot