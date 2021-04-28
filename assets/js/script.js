


=======
var API_key = "1";
var listdrinks = [];
var firstLetter = "M";

var getData = async() => {
    var response = await fetch(`https://thecocktaildb.com/api/json/v1/1/search.php?f=${firstLetter}`)
    var data = await response.json()
    console.log(data)
}
getData();

