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
            article.content = [];
            article.title = $('h1').text(); 
            
            $('.ok-single-content').children('p').each( (i, el) => {
                article.content[i] = { text: $(el).text(), images: [] };
                if($(el).find('img').length) {
                    
                    $(el).find('img').each( (i, image) => {
                        article.content[i].images.push($(image).attr('src'));
                    });
                }
            });

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
