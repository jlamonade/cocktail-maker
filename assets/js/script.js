var ingredientsDiv = document.querySelector(".collection");
var ingredientInput = document.querySelector("#ingredient-input");
var addIngredientsButton = document.querySelector("#add-button");
var recipeCollapsible = document.querySelector(".collapsible");

// STARTING DATA
var temporaryIngredientsArray = localStorage.getItem("ingredients-list")
  ? JSON.parse(localStorage.getItem("ingredients-list"))
  : [];
var apiKey = "9973533";
var baseUrl = "";
var firstLetter = "M";
var cocktailIds = [];



var colArr = [];
var cocktailIds = [];
var drinks = [];


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
        var ingredientString = data.ingredients[0].strIngredient
          .split(" ")
          .join("_");
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
    var ingredientString = ingredient.split("_").join(" ");
    var indgredientItem = document.createElement("li");
    indgredientItem.textContent = ingredientString;
    indgredientItem.setAttribute("class", "collection-item teal lighten-1");
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
  var ingredientString = event.target.textContent.split(" ").join("_");
  var removeIndex = temporaryIngredientsArray.indexOf(ingredientString);
  if (removeIndex > -1) {
    // if item exists it will return a number larger than -1
    temporaryIngredientsArray.splice(removeIndex, 1);
    updateIngredientsListInLocalStorage();
    populateIngredientToIngredientsDiv(temporaryIngredientsArray);
  }
}

var getData = async () => {
  var listofIng = temporaryIngredientsArray.join(",");
  fetch(
    `https://www.thecocktaildb.com/api/json/v2/${apiKey}/filter.php?i=${listofIng}`
  )
    .then((response) => response.json())
    .then((data) => {
      randomRec(data.drinks);
      getDrinkRecipes();
    });
};

function getDrinkRecipes() {
  recipeCollapsible.innerHTML = "";
  for (var i = 0; i < cocktailIds.length; i++) {
    fetch(
      `https://www.thecocktaildb.com/api/json/v2/${apiKey}/lookup.php?i=${cocktailIds[i]}`
    )
      .then((response) => response.json())
      .then((data) => {
        drinks.push(data.drinks[0]);
        populateCollapsibleWithRecipes(data.drinks[0]);
      });
  }
}

function populateCollapsibleWithRecipes(drink) {
  console.log(drink);
  var drinkName = drink.strDrink;
  var ingredients = [];
  var instructions = drink.strInstructions;
  console.log(instructions);

  for (var i = 1; i < 16; i++) {
    // for each ingredient/measure
    var ingredientString = drink[`strIngredient${i}`];
    if (ingredientString) {
      // validates ingredient string is not null or empty string
      ingredients.push([drink[`strIngredient${i}`], drink[`strMeasure${i}`]]);
    }
  }

  var recipeLi = document.createElement("li");

  var recipeNameDiv = document.createElement("div");
  recipeNameDiv.setAttribute("class", "collapsible-header teal lighten-2");
  recipeNameDiv.textContent = drinkName;

  var recipeBodyDiv = document.createElement("div");
  recipeBodyDiv.setAttribute("class", "collapsible-body teal lighten-3");

  var recipeIngredientsDiv = document.createElement("ul");

  var recipeInstructionsDiv = document.createElement("div");
  recipeInstructionsDiv.innerHTML = `${instructions}`;

  recipeBodyDiv.appendChild(recipeIngredientsDiv);
  recipeBodyDiv.appendChild(recipeInstructionsDiv);

  recipeLi.appendChild(recipeNameDiv);
  recipeLi.appendChild(recipeBodyDiv);

  recipeCollapsible.appendChild(recipeLi);
}

function randomRec(data) {
  // go through the data array until we have at least five items
  while (cocktailIds.length < 5) {
    // generate random index
    var rand = data[Math.floor(Math.random() * data.length)];
    // is the item at that index already in the cocktails id
    // console.log("random rec:", rand);
    if (!cocktailIds.includes(rand)) {
      // if not, put it in ther
      cocktailIds.push(rand.idDrink);
    }
  }
}

// inititalization
$(document).ready(function () {
  $(".collapsible").collapsible();
});

// getData();
// randomRec();

addIngredientsButton.addEventListener("click", validateIngredientInput);
// validateIngredientInput("gin");
// validateIngredientInput("vodka");

// populateIngredientToIngredientsDiv(temporaryIngredientsArray);
