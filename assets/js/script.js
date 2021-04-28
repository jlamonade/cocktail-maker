// DEPENDENCIES
var ingredientsDiv = document.querySelector(".collection");
var ingredientInput = document.querySelector("#icon_prefix2");
var addIngredientsButton = document.querySelector("#add-button");

// STARTING DATA
var temporaryIngredientsArray = localStorage.getItem("ingredients-list")
  ? JSON.parse(localStorage.getItem("ingredients-list"))
  : [];
var apiKey = "9973533";
var baseUrl = "";
var listdrinks = [];
var firstLetter = "M";

// FUNCTIONS
function validateIngredientInput() {
  /* 
    validates by checking for a non-null return
    if non-null return then ingredients are added to temporary
    ingredients array
  */
  var ingredients = ingredientInput.value;
  var requestUrl = `https://www.thecocktaildb.com/api/json/v2/${apiKey}/search.php?i=${ingredients}`;
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // console.log(data)
      if (data.ingredients !== null) {
        // console.log(data)
        temporaryIngredientsArray.push(data.ingredients[0].strIngredient);
        populateIngredientToIngredientsDiv(temporaryIngredientsArray);
        updateIngredientsListInLocalStorage();
      }
    });
}

function populateIngredientToIngredientsDiv() {
  temporaryIngredientsArray.forEach((ingredient) => {
    var indgredientItem = document.createElement("li");
    indgredientItem.textContent = ingredient;
    indgredientItem.setAttribute("class", "collection-item");
    ingredientsDiv.appendChild(indgredientItem);
  });
}

function updateIngredientsListInLocalStorage() {
  localStorage.setItem(
    "ingredients-list",
    JSON.stringify(temporaryIngredientsArray)
  );
}

function removeIngredientFromList(ingredient) {
  if (ingredient in temporaryIngredientsArray) {
  }
}

var getData = async () => {
  var response = await fetch(
    `https://thecocktaildb.com/api/json/v2/${apiKey}/search.php?f=${firstLetter}`
  );
  var data = await response.json();
  console.log(data);
};

getData();
addIngredientsButton.addEventListener("click", validateIngredientInput);
// validateIngredientInput("gin");
// validateIngredientInput("vodka");
populateIngredientToIngredientsDiv(temporaryIngredientsArray);
