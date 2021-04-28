// DEPENDENCIES
var ingredientsDiv = document.querySelector("#list");
var ingredientInput = document.querySelector("#input");

// STARTING DATA
var temporaryIngredientsArray = [];
var API_key = "1";
var listdrinks = [];
var firstLetter = "M";


// FUNCTIONS 
function validateIngredientInput(ingredient) {
  /* 
    validates by checking for a non-null return
    if non-null return then ingredients are added to temporary
    ingredients array
  */
  var requestUrl = "https://www.thecocktaildb.com/api/json/v1/1/search.php?i=";
  var ingredients = ingredient;
  fetch(requestUrl + ingredients)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.ingredients !== null) {
        temporaryIngredientsArray.push(data.ingredients[0].strIngredient);
        populateIngredientToIngredientsDiv(data.ingredients[0].strIngredient);
        updateIngredientsListInLocalStorage();
      }
    });
}

function populateIngredientToIngredientsDiv(ingredient) {
  var indgredientItem = document.createElement("div");
  indgredientItem.textContent = ingredient;
  indgredientItem.setAttribute("class", "ingredient-item");
  ingredientsDiv.appendChild(indgredientItem);
}

function updateIngredientsListInLocalStorage() {
    localStorage.setItem("ingredients-list", JSON.stringify(temporaryIngredientsArray))
}

function removeIngredientFromList(ingredient) {
    if (ingredient in temporaryIngredientsArray) {
        return
    }
}

var getData = async() => {
    var response = await fetch(`https://thecocktaildb.com/api/json/v1/1/search.php?f=${firstLetter}`)
    var data = await response.json()
    console.log(data)
}
getData();

validateIngredientInput("gin");
validateIngredientInput("vodka");
