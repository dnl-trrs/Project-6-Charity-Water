// Game configuration and state variables
const GOAL_CANS = 25;        // Total items needed to collect
let currentCans = 0;         // Current number of items collected
let gameActive = false;      // Tracks if game is currently running
let spawnInterval;          // Holds the interval for spawning items
let score = 0;               // Global score variable

const milestones = [
  { score: 5, message: "Great start!" },
  { score: 10, message: "Halfway there!" },
  { score: 15, message: "Almost there!" },
  { score: 20, message: "Just a bit more!" },
  { score: 25, message: "You reached the goal!" }
];

// Creates the 3x3 game grid where items will appear
function createGrid() {
  const grid = document.querySelector('.game-grid');
  grid.innerHTML = ''; // Clear any existing grid cells
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell'; // Each cell represents a grid square
    grid.appendChild(cell);
  }
}

// Ensure the grid is created when the page loads
createGrid();

// Spawns a new item in a random grid cell
function spawnWaterCan() {
  if (!gameActive) return; // Stop if the game is not active
  const cells = document.querySelectorAll('.grid-cell');
  
  // Clear all cells before spawning a new water can
  cells.forEach(cell => (cell.innerHTML = ''));

  // Select a random cell from the grid to place the water can
  const randomCell = cells[Math.floor(Math.random() * cells.length)];

  // Use a template literal to create the wrapper and water-can element
  randomCell.innerHTML = `
    <div class="water-can-wrapper">
      <div class="water-can"></div>
    </div>
  `;

  // Add click handler for the water can
  const waterCan = randomCell.querySelector('.water-can');
  if (waterCan) {
    waterCan.addEventListener('click', () => {
      if (!gameActive) return;
      score++;
      document.getElementById('score').textContent = score;
      const achievementDiv = document.getElementById('achievements');
      const milestone = milestones.find(m => m.score === score);
      if (milestone) {
        achievementDiv.textContent = milestone.message;
        setTimeout(() => {
          achievementDiv.textContent = '';
        }, 2000);
      }
      waterCan.remove(); // Remove the can element after clicking for clarity
    });
  }
}

// Initializes and starts a new game
function startGame() {
  if (gameActive) return; // Prevent starting a new game if one is already active
  gameActive = true;
  score = 0; // Reset score at start
  document.getElementById('score').textContent = score; // Update score display
  createGrid(); // Set up the game grid

  // Get selected difficulty and adjust spawn rate accordingly
  const difficultySelect = document.getElementById('difficulty');
  let spawnRate = 1000; // Default spawn rate in ms
  if (difficultySelect) {
    const difficulty = difficultySelect.value;
    if (difficulty === 'easy') {
      spawnRate = 1500;
    } else if (difficulty === 'medium') {
      spawnRate = 1000;
    } else if (difficulty === 'hard') {
      spawnRate = 500;
    }
  }

  spawnInterval = setInterval(spawnWaterCan, spawnRate); // Spawn water cans at adjusted rate
}

function endGame() {
  gameActive = false; // Mark the game as inactive
  clearInterval(spawnInterval); // Stop spawning water cans
}

// Set up click handler for the start button
document.getElementById('start-game').addEventListener('click', startGame);
