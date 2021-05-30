$(function() {
    console.log("Loading companies...");
    function loadCompanies() {
        $.getJSON("api/companies/", function (companies) {
            console.log(companies);
            var messageCompany = "No company here";
            var messageWebsite = "No website here";
            if (companies.length > 0) {
                messageCompany = companies[0].name;
                messageWebsite = companies[0].website;
            }
            $(".company").text(messageCompany);
            $(".website").text(messageWebsite);
        });
    };

    loadCompanies();
    setInterval(loadCompanies, 3000);

});




