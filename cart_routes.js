var express = require('express');
module.exports = function(app) {
  app.use('/static', express.static( './static')).
      use('/images', express.static( '../images')).
      use('/lib', express.static( '../lib')).
      use('/js', express.static( './js')
  );
  app.get('/', function(req, res){
    res.render('shopping');
  });
}
