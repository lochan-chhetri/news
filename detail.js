const http = require('http');
const rp = require('request-promise');
const cheerio =require('cheerio');

const getDetails = (urlObj) => {
    return new Promise( function (resolve, reject) {
        
        const url = 'https://www.onlinekhabar.com/' + urlObj.year + '/' + urlObj.month + '/' + urlObj.id;
        
        const onlinekhabar = {
            uri: url,
            transform: function (body) {
                return cheerio.load(body);
            }
    };

    let article = {};

    rp(onlinekhabar)
        .then(function ($) {

            article.title = $('h1').text(); 
            article.content = $('.ok-single-content').children('p').text();
            article.date = $('.updated_date').text().trim();
            article.link = onlinekhabar.uri;
        })
        .then(function() {
            resolve(article)
        })
        .catch(function (err) {
            reject('failed')
        });
    });
}

module.exports = getDetails; 
