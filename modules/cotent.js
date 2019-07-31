const content = {
    searchTerms: String,
    prefix: String,
    sourceContentOriginal: String,
    sourceContentSanitized: String,
    sentences: [{
        text: String,
        keywords: [String],
        images: [String]
    }]
}

module.exports = content