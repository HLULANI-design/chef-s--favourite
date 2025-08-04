// MealDB API integration
async function fetchRandomMeal(ingredient) {
  try {
    // First try to find a meal with the exact ingredient
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
    const data = await response.json();
    
    if (data.meals && data.meals.length > 0) {
      // Get a random meal from the filtered results
      const randomMeal = data.meals[Math.floor(Math.random() * data.meals.length)];
      const mealResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${randomMeal.idMeal}`);
      const mealData = await mealResponse.json();
      return mealData.meals[0];
    } else {
      // If no meals found with ingredient, use Unsplash image matching the ingredient
      return {
        strMeal: `${ingredient} Special`,
        strMealThumb: `https://source.unsplash.com/random/600x400/?${ingredient},food`,
        strCategory: 'Custom Creation',
        strArea: 'International',
        strInstructions: `Our chef's special preparation with ${ingredient}.`,
        strYoutube: '#'
      };
    }
  } catch (error) {
    console.error('Error fetching meal:', error);
    return null;
  }
}

// Display meal function
function displayMeal(meal, ingredient) {
  if (!meal) {
    document.getElementById('orderMsg').textContent = 'Failed to fetch a meal. Please try again.';
    return;
  }

  const mealImageContainer = document.getElementById('mealImageContainer');
  const noMealDisplay = document.getElementById('noMealDisplay');
  
  mealImageContainer.classList.remove('d-none');
  noMealDisplay.classList.add('d-none');
  
  // Use Unsplash image if no meal image exists
  const mealImage = meal.strMealThumb || `https://source.unsplash.com/random/600x400/?${ingredient},food`;
  document.getElementById('mealImage').src = mealImage;
  document.getElementById('mealName').textContent = meal.strMeal;
  document.getElementById('mealCategory').textContent = `Category: ${meal.strCategory || 'Custom'}`;
  document.getElementById('mealArea').textContent = `Cuisine: ${meal.strArea || 'International'}`;
  document.getElementById('mealInstructions').textContent = meal.strInstructions || `Our chef's special preparation with ${ingredient}.`;
  document.getElementById('recipeLink').href = meal.strYoutube || '#';
  
  // Add to orders list
  const ordersList = document.getElementById('ordersList');
  const orderId = Date.now();
  const orderCard = document.createElement('div');
  orderCard.className = 'col-md-4 mb-3';
  orderCard.innerHTML = `
    <div class="card custom-card">
      <div class="card-body">
        <h5 class="card-title">Order #${orderId.toString().slice(-4)}</h5>
        <p class="card-text">${meal.strMeal}</p>
        <p class="card-text text-muted">${meal.strCategory || 'Custom'}</p>
      </div>
    </div>
  `;
  ordersList.prepend(orderCard);
}

// Event listener for order button
document.getElementById('orderBtn').addEventListener('click', async function() {
  const ingredient = document.getElementById('ingredientInput').value.trim();
  if (ingredient) {
    document.getElementById('orderMsg').textContent = `Searching for ${ingredient} recipes...`;
    const meal = await fetchRandomMeal(ingredient);
    displayMeal(meal, ingredient);
    document.getElementById('orderMsg').textContent = `Enjoy your ${ingredient} meal!`;
  } else {
    document.getElementById('orderMsg').textContent = 'Please enter an ingredient!';
  }
});

// Initialize carousel
const myCarousel = new bootstrap.Carousel(document.getElementById('carouselExample'), {
  interval: 3000,
  wrap: true
});