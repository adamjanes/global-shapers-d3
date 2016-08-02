mapCountries = map["objects"]["TM_WORLD_BORDERS-0"]["geometries"].reduce(function(a, b){
    return a.concat(b.properties["NAME"]);
}, []);
divisionCountries = division.reduce(function(a, b){
    return a.concat(b.country);
}, []);


//console.log(mapCountries.sort());
//console.log(divisionCountries.sort());

var diff = $(mapCountries).not(divisionCountries).get().sort();

var diff2 = $(divisionCountries).not(mapCountries).get().sort();


//console.log(mapCountries)

diff.forEach(function(d){
    console.log(d)
});
//console.log(diff)



/* VIEW SUMMARY DATA HEADERS
 console.log(headers[0]['EmbeddedData-Country']);
 console.log(headers[0]['EmbeddedData-Region_Cont']);
 console.log(headers[0]['QID92'])
 console.log(headers[0]['EmbeddedData-Region_Sub'])
 console.log(headers[0]['EmbeddedData-Index_WEF'])
 console.log(headers[0]['EmbeddedData-CPI2015'])
 console.log(headers[0]['EmbeddedData-UNDP_LEVEL'])
 console.log(headers[0]['EmbeddedData-UNDP_HDI'])
 console.log(headers[0]['EmbeddedData-Q_Language'])
 console.log(headers[0]['QID87']) // Gender
 console.log(headers[0]['QID88']) // Age Range
 console.log(headers[0]['QID91']) // Job Role
 console.log(headers[0]['QID92']) // Education Level */


var genderSummary = data.reduce(function(a, b){
        var gender =  b[['QID87']];
        var num;
        if (gender == "Female"){
            num = 1;
        }
        else {
            num = 0
        }
        return num + a;
    }, 0)/data.length;

console.log(genderSummary)

//var highlight = $("[region="+cont+"]").attr("class", "active");
