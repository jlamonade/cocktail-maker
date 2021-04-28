// DEPENDENCIES
var ingredientsDiv = document.querySelector(".ingredients-div");
var ingredientInput = document.querySelector(".ingredient-input");

// STARTING DATA
var temporaryIngredientsArray = [];

function validateIngredientInput(ingredient) {
  var requestUrl = "https://www.thecocktaildb.com/api/json/v1/1/search.php?i=";
  var ingredients = ingredient;
  fetch(requestUrl + ingredients)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.ingredients !== null) {
        temporaryIngredientsArray.push(ingredient);
      }
    });
}


validateIngredientInput("gin");
console.log(temporaryIngredientsArray);
