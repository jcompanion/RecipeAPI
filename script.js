const get_meal_btn = document.getElementById('get_meals');
const meal_container = document.getElementById('meals');
const categoryList = document.querySelectorAll('.card');
const items = document.getElementsByClassName('items');
const home1 = document.querySelector('#home1');
const home2 = document.querySelector('#home2');
const dropdown = document.getElementById('dropdown');



// Populate page with all categories

fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
  .then(res => res.json())
  .then(res => {
    let data = res.categories;
    generateCategories(data);
    for (let i = 0; i < data.length; i += 1) {
      dropdown.innerHTML += `
  <a class="dropdown-item" onclick="recipes('${data[i].strCategory}')">${data[i].strCategory}</a>
  `;
    }
  });





function categories() {
  meal_container.classList.add("row", "row-cols-1", "row-cols-md-3");
  fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
    .then(res => res.json())
    .then(res => {
      let data = res.categories;
      console.log(data)
      generateCategories(data);
    });
}


function generateCategories(categories) {
  for (let i = 0; i < categories.length; i += 1) {
    meal_container.innerHTML += `
    <div class="col mb-4">
    <div class="card">
    <div class="card-header text-center">${categories[i].strCategory}</div>
    <img class="card-img" src="${categories[i].strCategoryThumb}">
    
      <div class="card-body text-center">
      <p class="card-text">${categories[i].strCategoryDescription.slice(0, 200)}...</p>
        <button onclick="recipes('${categories[i].strCategory}')" class="btn btn-primary">See Meals</button>
      </div>
      </div>
      </div>
  `;

  }
};


function recipes(category) {
  meal_container.classList.add("row", "row-cols-1", "row-cols-md-3");
  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    .then(res => res.json())
    .then(res => {
      console.log(res.meals)
      generateMeals(res.meals);
    });

};




function generateMeals(meals) {
  meal_container.innerHTML = "";
  for (let i = 0; i < meals.length; i += 1) {
    meal_container.innerHTML += `
    <div class="col mb-4">
    <div class="card">
    <img class="card-img-top" src="${meals[i].strMealThumb}">
      <div class="card-body text-center">
        <h5 class="card-title">${meals[i].strMeal}</h5>
        <button onclick="recipesGet('${meals[i].idMeal}')" class="btn btn-primary">See Recipe</button>
      </div>
      </div>
      </div>
  `;
  }
};

// Fetch and turn all recipes into data

function recipesGet(recipeMeal) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeMeal}`)
    .then(res => res.json())
    .then(res => {
      console.log(res.meals)
      generateRecipe(res.meals[0])
    });

};


// Function to generate the recipe per meal id

function generateRecipe(recipe) {
  meal_container.innerHTML = "";
  meal_container.classList.remove("row", "row-cols-1", "row-cols-md-3");
  const ingredients = [];
  // Get all ingredients from the object. Up to 20
  for (let i = 1; i <= 20; i++) {
    if (recipe[`strIngredient${i}`]) {
      ingredients.push(`${recipe[`strIngredient${i}`]} - ${recipe[`strMeasure${i}`]}`);
    } else {
      // Stop if no more ingredients
      break;
    }

  }

  meal_container.innerHTML += `
    <div class="card">
    <div class="card-body">
    <img src="${recipe.strMealThumb}" class="img-fluid rounded mx-auto d-block" alt="Responsive image">
    <h3 class="meal-name card-title">${recipe.strMeal}</h3>
    <p class="card-text">${recipe.strInstructions}</p>
    ${recipe.strCategory ? `<p><strong>Category:</strong> ${recipe.strCategory}</p>` : ''}
				${recipe.strArea ? `<p><strong>Area:</strong> ${recipe.strArea}</p>` : ''}
				${recipe.strTags ? `<p><strong>Tags:</strong> ${recipe.strTags.split(',').join(', ')}</p>` : ''}
    <h5>Ingredients:</h5>
    <ul>
      ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
    </ul>
    ${recipe.strYoutube ? `
		
			<h5>Video Recipe</h5>
			<div class="videoWrapper">
				<iframe width="420" height="315"
				src="https://www.youtube.com/embed/${recipe.strYoutube.slice(-11)}">
				</iframe>
			</div>` : ''}
    </div>
  </div>
  `;



};




// Search function to find categories or food
function search() {
  var input = document.getElementById("search");
  var filter = input.value.toLowerCase();
  var nodes = document.getElementsByClassName('col');

  console.log(filter)

  for (i = 0; i < nodes.length; i++) {
    if (nodes[i].innerText.toLowerCase().includes(filter)) {
      nodes[i].style.display = "flex";
    } else {
      nodes[i].style.display = "none";
    }
  }
}




// Event Listeners for taking us back to the home category screen

home2.addEventListener('click', (e) => {
  e.preventDefault();
  meal_container.innerHTML = "";
  categories();
}
);

home1.addEventListener('click', (e) => {
  e.preventDefault();
  meal_container.innerHTML = "";
  categories();
}
);