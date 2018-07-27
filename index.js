const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

let dataCache;
const DATA_PER_PAGE = 10;

app.use(express.static('public'));

app.use('/onlinekhabar/:year/:month/:id', function(req, res){
  const data = require('./detail.js')(req.params);
  
  data
    .then( d => { 
      res.send(d);
    })
    .catch( err => { 
      console.log(err.message)
      // TODO: send error message and status code to client
    })
});

app.get('/data', function(req, res){
  const data = require('./data.js');

  data
    .then( d => { 

      var newData = {};
      var chunk = d.headlines.filter( (article, index) => {
        return index < DATA_PER_PAGE;
      });
      newData.source = d.source;
      newData.headlines = chunk;
      
      newData.perpage = DATA_PER_PAGE;
      newData.current = DATA_PER_PAGE;
      newData.total = d.headlines.length;
      

      dataCache = Object.create(newData);
      dataCache.headlines = d.headlines;
      dataCache.perpage = DATA_PER_PAGE;
      dataCache.current = DATA_PER_PAGE;
      dataCache.total = d.headlines.length;
      
      res.send(newData);

    })
    .catch( err => { 
      console.log(err.message)
      // TODO: send error message and status code to client
    })
  
});

app.get('/data/:nums', (req,res) => {
   var start = req.params.nums - dataCache.perpage;
   var next = req.params.nums;

   var newSet = {};
   var chunk = dataCache.headlines.filter( (article, index) => {
      return index >= start && index < next ;
    });

    newSet.headlines = chunk;
    newSet.perpage = dataCache.perpage;
    newSet.current = parseInt(next);
    newSet.total = dataCache.total;

   res.send(newSet);
});


app.listen(PORT);