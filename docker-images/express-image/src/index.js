var Chance  = require('chance');
var chance = new Chance();

var express  = require('express');
var app = express();

app.get('/test', function(req, res){
    res.send("Hello RES - test ");
});

app.get("/companies", function(req, res){
    res.send(generateCompanies());
});

app.get('/', function(req, res){
    res.send("Welcome on the RES server");
});

app.listen(3000, function () {
    console.log("Accept HTTP requests on port 3000");
});


function generateCompanies(){
    var numberOfCompanies = chance.integer({
        min:0,
        max:10
    });
    console.log("Number of companies generated: " + numberOfCompanies);
    var companies = [];
    for(var i = 0; i < numberOfCompanies; ++i) {
        var companyName = chance.company();
        var companyNameNoSpace = companyName.replace(/\W/g, '');
        companies.push({
            name: companyName,
            adress: chance.address({
                short_suffix: true
            }),
            website: chance.url({
                domain: "www." + companyNameNoSpace + ".com"
            }),
            income: chance.dollar({
                min: 100000,
                max: 1000000000
            })
        });
    }

    console.log(companies);
    return companies;
}
