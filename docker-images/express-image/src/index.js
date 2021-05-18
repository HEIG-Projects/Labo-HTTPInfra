var Chance = require('chance');
var chance = new Chance();

var express = require('express');
var app = express();

app.get('/', function(req, res) {
	res.send("<h1>Bonjour</h1><br>Votre mot de passe généré est " + randomPassword());
});

app.listen(3000, function () {
	console.log('Accepting HTTP request on port 3000.');
});

function randomPassword() {
	return chance.string({ lenght: 20 });
}
