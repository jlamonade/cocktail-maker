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
var colArr= [1,2,3,4,5];



// FUNCTIONS 


function validateIngredientInput(ingredient) {

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
  ingredientsDiv.innerHTML = "";
  temporaryIngredientsArray.forEach((ingredient) => {
    var indgredientItem = document.createElement("li");
    indgredientItem.textContent = ingredient;
    indgredientItem.setAttribute("class", "collection-item");
    indgredientItem.addEventListener("click", removeIngredientFromList)
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
  console.log(event.target.textContent)
  var removeIndex = temporaryIngredientsArray.indexOf(event.target.textContent);
  if (removeIndex > -1) {
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


function getDrinkRecipes() {
  for (var i = 0; i < cocktailIds.length; i++) {
    fetch(
      `https://www.thecocktaildb.com/api/json/v2/${apiKey}/lookup.php?i=${cocktailIds[i]}`
    )
      .then((response) => response.json())
      .then((data) => {
        drinks.push(data);
        console.log(data.drinks[0]);
        populateCollapsibleWithRecipes(data.drinks[0]);
      });
  }
}

function populateCollapsibleWithRecipes(data) {
  var drinkName = data.strDrink;
  var ingredients = {};
  var instructions = data.strInstructions
  console.log(instructions);
  for (var i = 1; i < 16; i++) {
    var ingredientString = data[`strIngredient${i}`];
    if (ingredientString) {
      // validates ingredient string is not null or empty string
      ingredients[data[`strIngredient${i}`]] = data[`strMeasure${i}`];
    }
  }

  var recipeLi = document.createElement("li");

  var recipeNameDiv = document.createElement("div");
  recipeNameDiv.setAttribute("class", "collapsible-header teal lighten-2");
  recipeNameDiv.textContent = drinkName;

  var recipeBodyDiv = document.createElement("div");
  recipeBodyDiv.setAttribute("class", "collapsible-body teal lighten-3");
  
  var recipeIngredientsDiv = document.createElement("ul");
  for (ingredient of ingredients) {
    return // WORKING 
  }

  var recipeInstructionsDiv = document.createElement("div");
  recipeInstructionsDiv.innerHTML = `${instructions}`;

  recipeBodyDiv.appendChild(recipeIngredientsDiv)
  recipeBodyDiv.appendChild(recipeInstructionsDiv)

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
    console.log(colArr);
    return "#" + colArr.join("")
}

// inititalization
$(document).ready(function(){
    $('.collapsible').collapsible();
  });

randomRec();
getData();
addIngredientsButton.addEventListener("click", validateIngredientInput);
// validateIngredientInput("gin");
// validateIngredientInput("vodka");

populateIngredientToIngredientsDiv(temporaryIngredientsArray);

