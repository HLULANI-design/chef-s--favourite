// Fetch a random meal from MealDB API based on ingredient
async function fetchRandomMeal(ingredient) {
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
    const data = await response.json();

    if (data.meals && data.meals.length > 0) {
      const randomMeal = data.meals[Math.floor(Math.random() * data.meals.length)];
      const mealResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${randomMeal.idMeal}`);
      const mealData = await mealResponse.json();
      return mealData.meals[0];
    } else {
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

// Save order to sessionStorage
function saveOrder(meal) {
  let orders = JSON.parse(sessionStorage.getItem('orders')) || [];
  let orderCount = parseInt(sessionStorage.getItem('orderCount') || "0");

  orderCount++;
  sessionStorage.setItem('orderCount', orderCount);

  const newOrder = {
    id: orderCount,
    name: meal.strMeal,
    category: meal.strCategory || 'Custom',
    image: meal.strMealThumb
  };

  orders.push(newOrder);
  sessionStorage.setItem('orders', JSON.stringify(orders));
}

// Display all orders from sessionStorage
function displayOrders() {
  const ordersList = document.getElementById('ordersList');
  const badge = document.getElementById('orderCountBadge');
  ordersList.innerHTML = '';

  let orders = JSON.parse(sessionStorage.getItem('orders')) || [];

  badge.textContent = orders.length;

  orders.forEach(order => {
    const orderCard = document.createElement('div');
    orderCard.className = 'col-md-4 mb-3';
    orderCard.innerHTML = `
      <div class="card custom-card">
        <div class="card-body">
          <h5 class="card-title">Order #${order.id}</h5>
          <p class="card-text">${order.name}</p>
          <p class="card-text text-muted">${order.category}</p>
          <button class="btn btn-success btn-sm" onclick="completeOrder(${order.id})">Complete</button>
        </div>
      </div>
    `;
    ordersList.prepend(orderCard);
  });
}

// Mark order as complete
function completeOrder(id) {
  let orders = JSON.parse(sessionStorage.getItem('orders')) || [];
  orders = orders.filter(order => order.id !== id);
  sessionStorage.setItem('orders', JSON.stringify(orders));
  displayOrders();
}

// Display fetched meal
function displayMeal(meal, ingredient) {
  if (!meal) {
    document.getElementById('orderMsg').textContent = 'Failed to fetch a meal. Please try again.';
    return;
  }

  const mealImageContainer = document.getElementById('mealImageContainer');
  const noMealDisplay = document.getElementById('noMealDisplay');

  mealImageContainer.classList.remove('d-none');
  noMealDisplay.classList.add('d-none');

  const mealImage = meal.strMealThumb || `https://source.unsplash.com/random/600x400/?${ingredient},food`;
  document.getElementById('mealImage').src = mealImage;
  document.getElementById('mealName').textContent = meal.strMeal;
  document.getElementById('mealCategory').textContent = `Category: ${meal.strCategory || 'Custom'}`;
  document.getElementById('mealArea').textContent = `Cuisine: ${meal.strArea || 'International'}`;
  document.getElementById('mealInstructions').textContent = meal.strInstructions || `Our chef's special preparation with ${ingredient}.`;
  document.getElementById('recipeLink').href = meal.strYoutube || '#';

  saveOrder(meal);
  displayOrders();
}

// Handle order button click
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

// Show saved orders on page load
window.addEventListener('DOMContentLoaded', displayOrders);

// Initialize carousel
const myCarousel = new bootstrap.Carousel(document.getElementById('carouselExample'), {
  interval: 3000,
  wrap: true
});
