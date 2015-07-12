var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');

var port = process.env.PORT || 8080;
var staticdir = process.env.NODE_ENV === 'production' ? 'dist.prod' : 'dist.dev';

app.use(bodyParser.json());

app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static(__dirname + '/' + staticdir));

require('./dev.server/routes')(app);

app.listen(port);
console.log('Starting sever on port ' + port);
exports = module.exports = app;