var ingredientsDiv = document.querySelector(".collection");
var ingredientInput = document.querySelector("#icon_prefix2");
var addIngredientsButton = document.querySelector("#add-button");
var recipeCollapsible = document.querySelector(".collapsible");

// STARTING DATA
// If localStorage has stored ingredients it will be recalled
var temporaryIngredientsArray = localStorage.getItem("ingredients-list")
  ? JSON.parse(localStorage.getItem("ingredients-list"))
  : [];
var apiKey = "9973533";
var cocktailIds = []; // Used to store IDs pulled from getData()

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
          getData();
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
  // Creates a URL friendly string which is what was used in the temporaryIngredientsArray
  var ingredientString = event.target.textContent.split(" ").join("_");
  var removeIndex = temporaryIngredientsArray.indexOf(ingredientString);
  if (removeIndex > -1) {
    // if item exists it will return a number larger than -1
    temporaryIngredientsArray.splice(removeIndex, 1);
    updateIngredientsListInLocalStorage();
    populateIngredientToIngredientsDiv(temporaryIngredientsArray);
    getData();
  }
}

var getData = async () => {
  /* 
    Gets the cocktaile recipe from the API using a list of ingredients
    as parameters
  */
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
  recipeCollapsible.innerHTML = ""; // Empties out innerHTML so that it does not create duplicates
  for (var i = 0; i < cocktailIds.length; i++) {
    fetch(
      `https://www.thecocktaildb.com/api/json/v2/${apiKey}/lookup.php?i=${cocktailIds[i]}`
    )
      .then((response) => response.json())
      .then((data) => {
        populateCollapsibleWithRecipes(data.drinks[0]);
      });
  }
}

function populateCollapsibleWithRecipes(drink) {
  /* 
    takes a random drink object, parses it for name, ingredients, and instructions
    and creates a new recipe collapsible element
  */
  var drinkName = drink.strDrink;
  var ingredients = [];
  var instructions = drink.strInstructions;
  console.log(instructions);

  for (var i = 1; i < 16; i++) {
    // for each ingredient/measure
    var ingredientString = drink[`strIngredient${i}`];
    var ingredientMeasurement = drink[`strMeasure${i}`];
    if (ingredientString) {
      // validates ingredient string is not null or empty string
      if (ingredientMeasurement) {
        ingredients.push([ingredientString, ingredientMeasurement]);
      } else {
        console.log(drink);
        ingredients.push([ingredientString, ""]);
      }
    }
  }

  // CREATE AND BUILD
  var recipeLi = document.createElement("li");

  // Recipe Name
  var recipeNameDiv = document.createElement("div");
  recipeNameDiv.setAttribute("class", "collapsible-header teal lighten-2");
  recipeNameDiv.textContent = drinkName;

  // Recipe Body
  var recipeBodyDiv = document.createElement("div");
  recipeBodyDiv.setAttribute("class", "collapsible-body teal lighten-3");

  // Recipe Ingredients
  var recipeIngredientsDiv = document.createElement("ul");
  for (ingredient of ingredients) {
    console.log(ingredient);
    var ingredientLi = document.createElement("li");
    ingredientLi.textContent = `${ingredient[1]} ${ingredient[0]}`;
    recipeIngredientsDiv.appendChild(ingredientLi);
  }

  // Recipe Instructions
  var recipeInstructionsDiv = document.createElement("div");
  recipeInstructionsDiv.innerHTML = `${instructions}`;

  // PLACE
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
      // if not, put it in there
      cocktailIds.push(rand.idDrink);
    }
  }
}

// inititalization
$(document).ready(function () {
  $(".collapsible").collapsible();
});

if (temporaryIngredientsArray) {
  getData();
}

// Each time item add is clicked it will fetch recipes from the API
// This way the recipe list updates when each new ingredient is added
addIngredientsButton.addEventListener("click", validateIngredientInput);

// populate ingredients list with ingredients saved to localStorage
populateIngredientToIngredientsDiv(temporaryIngredientsArray);
