// Sizzle & Serve — ingredients, recipes and order generation.
// A recipe is a list of finished items the plate must hold: every entry is
// an ingredient id plus the state it must be in when it lands on the plate.
const INGREDIENTS = {
  bun:     { id: 'bun',     name: 'Bun',     color: '#e8a94e', station: null,      time: 0,   ready: 'bun' },
  patty:   { id: 'patty',   name: 'Patty',   color: '#c98a7a', station: 'grill',   time: 4.0, ready: 'grilled' },
  lettuce: { id: 'lettuce', name: 'Lettuce', color: '#7dc383', station: 'chopper', time: 2.0, ready: 'chopped' },
  tomato:  { id: 'tomato',  name: 'Tomato',  color: '#e2574c', station: 'chopper', time: 2.0, ready: 'chopped' },
  cheese:  { id: 'cheese',  name: 'Cheese',  color: '#f2c94c', station: 'chopper', time: 2.0, ready: 'chopped' },
  pasta:   { id: 'pasta',   name: 'Pasta',   color: '#f0d48a', station: 'pot',     time: 5.0, ready: 'boiled' },
  sauce:   { id: 'sauce',   name: 'Sauce',   color: '#b03a2e', station: null,      time: 0,   ready: 'sauce' },
};

// Bins along the bottom, left to right.
const BIN_ORDER = ['bun', 'patty', 'lettuce', 'tomato', 'cheese', 'pasta', 'sauce'];

const RECIPES = [
  {
    id: 'burger',
    name: 'Classic Burger',
    price: 14,
    needs: [
      { kind: 'bun', state: 'bun' },
      { kind: 'patty', state: 'grilled' },
      { kind: 'lettuce', state: 'chopped' },
      { kind: 'tomato', state: 'chopped' },
    ],
  },
  {
    id: 'cheeseburger',
    name: 'Cheese Burger',
    price: 16,
    needs: [
      { kind: 'bun', state: 'bun' },
      { kind: 'patty', state: 'grilled' },
      { kind: 'cheese', state: 'chopped' },
      { kind: 'tomato', state: 'chopped' },
    ],
  },
  {
    id: 'salad',
    name: 'Garden Salad',
    price: 11,
    needs: [
      { kind: 'lettuce', state: 'chopped' },
      { kind: 'tomato', state: 'chopped' },
      { kind: 'cheese', state: 'chopped' },
    ],
  },
  {
    id: 'marinara',
    name: 'Pasta Marinara',
    price: 15,
    needs: [
      { kind: 'pasta', state: 'boiled' },
      { kind: 'sauce', state: 'sauce' },
      { kind: 'cheese', state: 'chopped' },
    ],
  },
  {
    id: 'veggiepasta',
    name: 'Veggie Pasta',
    price: 13,
    needs: [
      { kind: 'pasta', state: 'boiled' },
      { kind: 'sauce', state: 'sauce' },
      { kind: 'tomato', state: 'chopped' },
    ],
  },
  {
    id: 'doubleburger',
    name: 'Double Stack',
    price: 20,
    needs: [
      { kind: 'bun', state: 'bun' },
      { kind: 'patty', state: 'grilled' },
      { kind: 'patty', state: 'grilled' },
      { kind: 'cheese', state: 'chopped' },
      { kind: 'lettuce', state: 'chopped' },
    ],
  },
];

function recipeById(id) {
  for (const r of RECIPES) if (r.id === id) return r;
  return RECIPES[0];
}

// Pick a recipe weighted toward the easy ones early, harder ones later.
function pickRecipe(rand, elapsed, shiftLen) {
  const t = elapsed / shiftLen;
  const pool = RECIPES.slice(0, t < 0.35 ? 4 : t < 0.7 ? 5 : 6);
  return pool[Math.floor(rand() * pool.length)];
}

function makeOrder(id, rand, elapsed, shiftLen) {
  const recipe = pickRecipe(rand, elapsed, shiftLen);
  const patience = Math.max(34, 56 - elapsed * 0.09); // seconds; shrinks as the shift wears on
  return {
    id,
    recipeId: recipe.id,
    patience,
    patienceLeft: patience,
    bornAt: elapsed,
  };
}
