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
var colArr= [];

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

function randomRec() {
    while (colArr.length < 5 ){
        var rand = temporaryIngredientsArray[Math.floor(Math.random() * temporaryIngredientsArray.length)];
        if (!colArr.includes(rand)){
            colArr.push(rand);
        }
    }
    console.log(colArr);
    return "#" + colArr.join("")
}
randomRec();
getData();
addIngredientsButton.addEventListener("click", validateIngredientInput);
// validateIngredientInput("gin");
// validateIngredientInput("vodka");
populateIngredientToIngredientsDiv(temporaryIngredientsArray);
