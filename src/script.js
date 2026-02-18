(function () {
  'use strict';

  // sample recipes
  const RECIPES = [
    {
      id: 1,
      title: 'Spaghetti Carbonara',
      ingredients: ['spaghetti', 'eggs', 'pancetta', 'parmesan'],
      details: 'A classic Italian pasta made with eggs, cheese, pancetta, and pepper.'
    },
    {
      id: 2,
      title: 'Chicken Tikka Masala',
      ingredients: ['chicken', 'yogurt', 'tomato', 'garam masala'],
      details: 'Chunks of roasted marinated chicken cooked in a spiced curry sauce.'
    },
    {
      id: 3,
      title: 'Avocado Toast',
      ingredients: ['bread', 'avocado', 'salt', 'pepper'],
      details: 'Simple and quick breakfast: mashed avocado on toasted bread.'
    },
    {
      id: 4,
      title: 'Beef Tacos',
      ingredients: ['taco shells', 'ground beef', 'lettuce', 'cheese'],
      details: 'Crunchy tacos stuffed with seasoned ground beef and toppings.'
    },
    {
      id: 5,
      title: 'Pancakes',
      ingredients: ['flour', 'milk', 'egg', 'baking powder'],
      details: 'Fluffy pancakes served with syrup, butter, or fruit.'
    },
    {
      id: 6,
      title: 'Caesar Salad',
      ingredients: ['romaine', 'croutons', 'parmesan', 'caesar dressing'],
      details: 'Crisp salad with romaine lettuce, croutons, and creamy dressing.'
    },
    {
      id: 7,
      title: 'Sushi Rolls',
      ingredients: ['rice', 'nori', 'fish', 'vegetables'],
      details: 'Rice and fillings wrapped in seaweed, served with soy sauce.'
    },
    {
      id: 8,
      title: 'Chocolate Chip Cookies',
      ingredients: ['flour', 'sugar', 'butter', 'chocolate chips'],
      details: 'Classic cookies loaded with chocolate chips.'
    }
  ];

  // element references
  const dom = {
    recipesContainer: document.getElementById('recipes'),
    searchInput: document.getElementById('search'),
    sortSelect: document.getElementById('sort'),
    favoritesOnlyCheckbox: document.getElementById('favoritesOnly'),
    counter: document.getElementById('counter')
  };

  // state
  let visibleRecipes = [...RECIPES];
  let favorites = new Set();

  // localStorage key
  const STORAGE_KEY = 'favoriteRecipes';

  /**
   * load favorites from localStorage into the Set
   */
  function loadFavorites() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const arr = JSON.parse(stored);
        favorites = new Set(arr);
      }
    } catch (e) {
      console.warn('could not parse favorites from storage', e);
    }
  }

  /**
   * persist favorites Set to localStorage
   */
  function saveFavorites() {
    const arr = Array.from(favorites);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  }

  /**
   * update recipe counter text
   */
  function updateCounter() {
    dom.counter.textContent = `Showing ${visibleRecipes.length} of ${RECIPES.length} recipes`;
  }

  /**
   * create a card element for a recipe
   */
  function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.className = 'recipe-card';

    const heart = document.createElement('button');
    heart.className = 'favorite-btn';
    heart.innerHTML = favorites.has(recipe.id) ? '❤️' : '🤍';
    if (favorites.has(recipe.id)) heart.classList.add('favorited');
    heart.addEventListener('click', () => {
      toggleFavorite(recipe.id, heart);
    });
    card.appendChild(heart);

    const title = document.createElement('h2');
    title.textContent = recipe.title;
    card.appendChild(title);

    const ingr = document.createElement('p');
    ingr.className = 'ingredients';
    ingr.textContent = `Ingredients: ${recipe.ingredients.join(', ')}`;
    card.appendChild(ingr);

    const toggle = document.createElement('button');
    toggle.className = 'toggle-details';
    toggle.textContent = 'Show details';
    toggle.addEventListener('click', () => {
      card.classList.toggle('expanded');
      toggle.textContent = card.classList.contains('expanded') ? 'Hide details' : 'Show details';
    });
    card.appendChild(toggle);

    const details = document.createElement('p');
    details.className = 'details';
    details.textContent = recipe.details;
    card.appendChild(details);

    return card;
  }

  /**
   * render visibleRecipes to the DOM
   */
  function renderRecipes() {
    dom.recipesContainer.innerHTML = '';
    visibleRecipes.forEach(r => {
      const card = createRecipeCard(r);
      dom.recipesContainer.appendChild(card);
    });
    updateCounter();
  }

  /**
   * apply filters: search, favorites-only, sort
   */
  function applyFilters() {
    let list = [...RECIPES];

    const query = dom.searchInput.value.trim().toLowerCase();
    if (query) {
      list = list.filter(r => {
        return r.title.toLowerCase().includes(query) ||
               r.ingredients.some(i => i.toLowerCase().includes(query));
      });
    }

    if (dom.favoritesOnlyCheckbox.checked) {
      list = list.filter(r => favorites.has(r.id));
    }

    const sortVal = dom.sortSelect.value;
    if (sortVal === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }

    visibleRecipes = list;
    renderRecipes();
  }

  /**
   * toggle favorite state for a recipe id
   */
  function toggleFavorite(id, btn) {
    if (favorites.has(id)) {
      favorites.delete(id);
      btn.innerHTML = '🤍';
      btn.classList.remove('favorited');
    } else {
      favorites.add(id);
      btn.innerHTML = '❤️';
      btn.classList.add('favorited');
    }
    saveFavorites();
    if (dom.favoritesOnlyCheckbox.checked) {
      applyFilters();
    }
  }

  /**
   * helper debounce: delays fn execution until ms elapsed since last call
   */
  function debounce(fn, ms = 300) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  // initialize
  function init() {
    loadFavorites();
    renderRecipes();

    dom.searchInput.addEventListener('input', debounce(applyFilters, 250));
    dom.sortSelect.addEventListener('change', applyFilters);
    dom.favoritesOnlyCheckbox.addEventListener('change', applyFilters);
  }

  // run
  init();
})();
