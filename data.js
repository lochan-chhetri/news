const http = require('http');
const rp = require('request-promise');
const cheerio =require('cheerio');

var getNews = new Promise( function (resolve, reject) {
            const onlinekhabar = {
        uri: 'https://www.onlinekhabar.com',
        transform: function (body) {
            return cheerio.load(body);
        }
    };

    let onlinekhabarData = { source: 'Online Khabar', headlines: []};

    rp(onlinekhabar)
        .then(function ($) {
            $('h1, h2').each(function(i, el) {
                if($(el).children('a').text() !== '' || $(el).children('a').attr('href') !== undefined) {
                    if($(el).children('a').text() !== 'सबै') {
                        const link = $(el).children('a').attr('href');
                        const newLink = link.replace('https://www.onlinekhabar.com', '/onlinekhabar');
                        onlinekhabarData.headlines.push({title: $(el).children('a').text(), link: newLink});
                    }
                }
            });
        })
        .then(function() {
            onlinekhabarData.length = onlinekhabarData.headlines.length;
            resolve(onlinekhabarData)
        })
        .catch(function (err) {
            reject('failed')
        });
    });


module.exports = getNews;