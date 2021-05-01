var ingredientsDiv = document.querySelector(".ingredient-ul");
var ingredientInput = document.querySelector("#ingredient-input");
var addIngredientsButton = document.querySelector("#add-button");
var recipeCollapsible = document.querySelector(".recipe-collapsible");
var deleteButton = document.querySelector(".delete-button");
var googleMapsDiv = document.querySelector(".google-maps-div");
var locationInput = document.querySelector("#location-input");
var locationButton = document.querySelector(".location-button");

// STARTING DATA
// If localStorage has stored ingredients it will be recalled
var temporaryIngredientsArray = localStorage.getItem("ingredients-list")
  ? JSON.parse(localStorage.getItem("ingredients-list"))
  : [];
var apiKey = "9973533";
var googleApiKey = "AIzaSyABvtPk_HXePtQluoRv6BzG5BMfzvqiCf4";
var cocktailIds = []; // Used to store IDs pulled from getData()

// FUNCTIONS

function validateIngredientInput(event) {
  event.preventDefault();
  /* 
    validates by checking for a non-null return
    if non-null return then ingredients are added to temporary
    ingredients array
  */
  var ingredients = ingredientInput.value;
  console.log(ingredients);
  var requestUrl = `https://www.thecocktaildb.com/api/json/v2/${apiKey}/search.php?i=${ingredients}`;
  if (ingredients) {
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data.ingredients !== null) {
          var ingredientString = data.ingredients[0].strIngredient
            .split(" ")
            .join("_");
          if (!temporaryIngredientsArray.includes(ingredientString)) {
            temporaryIngredientsArray.push(ingredientString);
            populateIngredientToIngredientsDiv(temporaryIngredientsArray);
            updateIngredientsListInLocalStorage();
            ingredientInput.value = "";
            getData();
          }
        }
      });
  }
}

function populateIngredientToIngredientsDiv() {
  ingredientsDiv.innerHTML = '<li class="collection-header">Ingredients</li>';
  temporaryIngredientsArray.forEach((ingredient) => {
    var ingredientString = ingredient.split("_").join(" ");
    var indgredientItem = document.createElement("li");
    indgredientItem.textContent = ingredientString;
    indgredientItem.setAttribute("class", "collection-item teal");
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
    console.log("handleingredientclick", cocktailIds);
    getData();
  }
}

function getData() {
  /* 
    Gets the cocktaile recipe from the API using a list of ingredients
    as parameters
  */
  var listofIng = temporaryIngredientsArray.join(","); // joins ingredients into url friendly parameter
  fetch(
    `https://www.thecocktaildb.com/api/json/v2/${apiKey}/filter.php?i=${listofIng}`
  )
    .then((response) => response.json())
    .then((data) => {
      cocktailIds = []; // clears out cocktailIds so that the while loop runs in randomRec()
      randomRec(data.drinks);
      getDrinkRecipes();
    });
}

function getDrinkRecipes() {
  recipeCollapsible.innerHTML = ""; // clears out innerHTML so that it does not create duplicates
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

  for (var i = 1; i < 16; i++) {
    // for each ingredient/measure
    var ingredientString = drink[`strIngredient${i}`];
    var ingredientMeasurement = drink[`strMeasure${i}`];
    if (ingredientString) {
      // validates ingredient string is not null or empty string
      if (ingredientMeasurement) {
        ingredients.push([ingredientString, ingredientMeasurement]);
      } else {
        ingredients.push([ingredientString, ""]);
      }
    }
  }

  // CREATE AND BUILD
  var recipeLi = document.createElement("li");
  recipeLi.setAttribute("class", "center-align");

  // Recipe Name
  var recipeNameDiv = document.createElement("div");
  recipeNameDiv.setAttribute("class", "collapsible-header teal");
  recipeNameDiv.textContent = drinkName;

  // Recipe Body
  var recipeBodyDiv = document.createElement("div");
  recipeBodyDiv.setAttribute("class", "collapsible-body");

  // Recipe Ingredients
  var recipeIngredientsDiv = document.createElement("ul");
  for (ingredient of ingredients) {
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
  if (data.length >= 5) {
    for (var i = 0; i < 5; i++) {
      // generate random index
      var rand = data[Math.floor(Math.random() * data.length)];
      // is the item at that index already in the cocktails id
      if (!cocktailIds.includes(rand.idDrink)) {
        // if not, put it in there
        cocktailIds.push(rand.idDrink);
      }
    }
  } else if (data.length > 0 && data.length < 5) {
    for (var i = 0; i < data.length; i++) {
      cocktailIds.push(data[i].idDrink);
    }
  }
}

function clearAllIngredients() {
  temporaryIngredientsArray = [];
  updateIngredientsListInLocalStorage();
  ingredientsDiv.innerHTML = '<li class="collection-header">Ingredients</li>';
  recipeCollapsible.innerHTML = "";
}

function handleAddIngredientsClick(event) {
  event.preventDefault();
  validateIngredientInput();
  console.log("handleingredientclick", cocktailIds);
}

function loadGoogleMapsWithLocation() {
  var location = locationInput.textContent;
  console.log(location)
  var mapIFrame = document.createElement("iframe");
  mapIFrame.setAttribute("width", "100%");
  mapIFrame.setAttribute("height", "250px");
  mapIFrame.setAttribute("frameborder", "0");
  var mapMode = "search";
  var parameters = `q=grocery+stores+liquor+${location}`;
  mapIFrame.setAttribute(
    "src",
    `https://www.google.com/maps/embed/v1/${mapMode}?key=${googleApiKey}&${parameters}`
  );
  googleMapsDiv.appendChild(mapIFrame);
}

function handleLocationButtonClick(event) {
  event.preventDefault()
  googleMapsDiv.innerHTML = "";
  loadGoogleMapsWithLocation();
}

// inititalization
loadGoogleMapsWithLocation();
$(document).ready(function () {
  $(".collapsible").collapsible();
});

if (temporaryIngredientsArray.length > 0) {
  // if there are ingredients stored in localStorage then fetch recipes
  getData();
}

// Each time item add is clicked it will fetch recipes from the API
// This way the recipe list updates when each new ingredient is added
addIngredientsButton.addEventListener("click", handleAddIngredientsClick);
deleteButton.addEventListener("click", clearAllIngredients);
locationButton.addEventListener("click", handleLocationButtonClick);

// populate ingredients list with ingredients saved to localStorage
populateIngredientToIngredientsDiv(temporaryIngredientsArray);
