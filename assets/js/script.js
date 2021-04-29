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
var colArr = [1, 2, 3, 4, 5, 6, 7];

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
        var ingredientString = data.ingredients[0].strIngredient.split(" ").join('_')
        if (!temporaryIngredientsArray.includes(ingredientString)) {
          temporaryIngredientsArray.push(ingredientString);
          populateIngredientToIngredientsDiv(temporaryIngredientsArray);
          updateIngredientsListInLocalStorage();
        }
      }
    });
}

function populateIngredientToIngredientsDiv() {
  ingredientsDiv.innerHTML = "";
  temporaryIngredientsArray.forEach((ingredient) => {
    var ingredientString = ingredient.split("_").join(" ")
    var indgredientItem = document.createElement("li");
    indgredientItem.textContent = ingredientString;
    indgredientItem.setAttribute("class", "collection-item");
    indgredientItem.addEventListener("click", removeIngredientFromList);
    ingredientsDiv.appendChild(indgredientItem);
  });
}

function updateIngredientsListInLocalStorage() {
  localStorage.setItem(
    "ingredients-list",
    JSON.stringify(temporaryIngredientsArray)
  );
}

function removeIngredientFromList(event) {
  var ingredientString = event.target.textContent.split(" ").join("_")
  var removeIndex = temporaryIngredientsArray.indexOf(ingredientString);
  if (removeIndex > -1) { // if item exists it will return a number larger than -1
    temporaryIngredientsArray.splice(removeIndex, 1);
    updateIngredientsListInLocalStorage();
    populateIngredientToIngredientsDiv(temporaryIngredientsArray);
  }
}

var getData = async () => {
  var response = await fetch(
    `https://thecocktaildb.com/api/json/v2/${apiKey}/search.php?f=${firstLetter}`
  );
  var data = await response.json();
  console.log(data);
};

function randomRec() {
  while (colArr.length < 5) {
    var rand =
      temporaryIngredientsArray[
        Math.floor(Math.random() * temporaryIngredientsArray.length)
      ];
    if (!colArr.includes(rand)) {
      colArr.push(rand);
    }
  }
  console.log(colArr);
  return "#" + colArr.join("");
}

// inititalization
$(document).ready(function () {
  $(".collapsible").collapsible();
});

getData();
// randomRec();

addIngredientsButton.addEventListener("click", validateIngredientInput);
// validateIngredientInput("gin");
// validateIngredientInput("vodka");

populateIngredientToIngredientsDiv(temporaryIngredientsArray);
