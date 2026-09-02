const mongoose = require('mongoose')

const cardSchema = mongoose.Schema({
    keyword: {
        type: String,
        required: true
    },
    author: {
        type: String,
        default: null,
    },
    content: {
        type: String,
        default: null,
    },
    description: {
        type: String,
        default: null,
    },
    publishedAt: {
        type: Date,
        required: true,
    },
    source: {
        id: {
            type: String,
            default: null,
        },

        name: {
            type: String,
            required: true,
        }
    },
    title: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    urlToImage: {
        type: String,
        default: null,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    savedAt: {
        type: Date,
        default: Date.now // Automaticamente define a data atual
    }
})

module.exports = mongoose.model('card', cardSchema);