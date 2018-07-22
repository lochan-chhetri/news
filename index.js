const express = require('express');
const app = express();

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
      res.send(d);
    })
    .catch( err => { 
      console.log(err.message)
      // TODO: send error message and status code to client
    })
  
});


app.listen(3000);