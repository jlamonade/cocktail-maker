// DEPENDENCIES
var ingredientsDiv = document.querySelector("#list");
var ingredientInput = document.querySelector("#input");

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
        temporaryIngredientsArray.push(data.ingredients[0].strIngredient);
        populateIngredientToIngredientsDiv(data.ingredients[0].strIngredient);
      }
    });
}

function populateIngredientToIngredientsDiv(ingredient) {
  var indgredientItem = document.createElement("div");
  indgredientItem.textContent = ingredient;
  indgredientItem.setAttribute("class", "ingredient-item");
  ingredientsDiv.appendChild(indgredientItem)
}

validateIngredientInput("gin");
validateIngredientInput("vodka");
console.log(temporaryIngredientsArray);

