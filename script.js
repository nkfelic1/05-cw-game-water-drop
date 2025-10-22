// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let dropMaker; // Will store our timer that creates drops regularly
let badDropMaker; // Will store our timer for bad drops
let score = 0; // Player's score
let timeLeft = 30; // Total game time in seconds
let timerInterval; // Will store our countdown timer interval

// Winning and losing messages
const winMessages = [
  "Amazing! You made every drop count!",
  "You’re a water hero! Great job!",
  "Fantastic! Clean water for all!",
  "You crushed it! Thanks for playing!",
  "Outstanding! You’re making a difference!"
];
const loseMessages = [
  "Keep trying! Every drop helps.",
  "Almost there! Give it another go!",
  "Don’t give up! Try again for a higher score.",
  "You can do it! Play again to improve.",
  "Not quite 20, but every effort counts!"
];

// Wait for button click to start the game
document.getElementById("start-btn").addEventListener("click", startGame);

// Add event listener for reset button
document.getElementById("reset-btn").addEventListener("click", resetGame);

// Handle clicks on water drops using event delegation
document.getElementById("game-container").addEventListener("click", function(event) {
  if (event.target.classList.contains("water-drop")) {
    // Increase score when a drop is clicked
    score++;
    document.getElementById("score").textContent = `${score}`;

    // Remove the clicked drop from the game
    event.target.remove();
  }
});

// Handle clicks on bad drops using event delegation
document.getElementById("game-container").addEventListener("click", function(event) {
  if (event.target.classList.contains("bad-drop")) {
    // Decrease score when a bad drop is clicked
    score = Math.max(0, score - 1); // Prevent negative scores
    document.getElementById("score").textContent = `${score}`;

    // Remove the clicked bad drop from the game
    event.target.remove();
  }
});

function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;

  gameRunning = true;

  // Create new drops every second (1000 milliseconds)
  dropMaker = setInterval(createDrop, 1000);

  // Create new bad drops every 3 seconds (3000 milliseconds)
  badDropMaker = setInterval(createBadDrop, 3000);

  // Reset score and update display
  score = 0;
  document.getElementById("score").textContent = `${score}`;

  // Update timer
  timeLeft = 30;
  document.getElementById("time").textContent = `${timeLeft}`;

  // Countdown timer every second
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("time").textContent = `${timeLeft}`;

    // End game when time runs out
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function resetGame() {
  // Stop all intervals
  clearInterval(dropMaker);
  clearInterval(badDropMaker);
  clearInterval(timerInterval);

  // Remove all drops from the game area
  const gameContainer = document.getElementById("game-container");
  while (gameContainer.firstChild) {
    gameContainer.removeChild(gameContainer.firstChild);
  }

  // Reset score and timer
  score = 0;
  document.getElementById("score").textContent = `${score}`;
  timeLeft = 30;
  document.getElementById("time").textContent = `${timeLeft}`;

  // Allow game to be started again
  gameRunning = false;
}

function createDrop() {
  // Create a new div element that will be our water drop
  const drop = document.createElement("div");
  drop.className = "water-drop";

  // Make drops different sizes for visual variety
  const initialSize = 60;
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const size = initialSize * sizeMultiplier;
  drop.style.width = drop.style.height = `${size}px`;

  // Position the drop randomly across the game width
  // Subtract 60 pixels to keep drops fully inside the container
  const gameWidth = document.getElementById("game-container").offsetWidth;
  const xPosition = Math.random() * (gameWidth - 60);
  drop.style.left = xPosition + "px";

  // Make drops fall for 4 seconds
  drop.style.animationDuration = "4s";

  // Add the new drop to the game screen
  document.getElementById("game-container").appendChild(drop);

  // Remove drops that reach the bottom (weren't clicked)
  drop.addEventListener("animationend", () => {
    drop.remove(); // Clean up drops that weren't caught
  });
}

function createBadDrop() {
  // Create a new div element that will be our bad drop
  const badDrop = document.createElement("div");
  badDrop.className = "bad-drop";

  // Make bad drops different sizes for visual variety
  const initialSize = 60;
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const size = initialSize * sizeMultiplier;
  badDrop.style.width = badDrop.style.height = `${size}px`;

  // Position the bad drop randomly across the game width
  const gameWidth = document.getElementById("game-container").offsetWidth;
  const xPosition = Math.random() * (gameWidth - 60);
  badDrop.style.left = xPosition + "px";

  // Make bad drops fall for 4 seconds
  badDrop.style.animationDuration = "4s";

  // Add the new bad drop to the game screen
  document.getElementById("game-container").appendChild(badDrop);

  // Remove bad drops that reach the bottom (weren't clicked)
  badDrop.addEventListener("animationend", () => {
    badDrop.remove(); // Clean up bad drops that weren't caught
  });
}

function endGame() {
  gameRunning = false;

  // Stop creating new drops
  clearInterval(dropMaker);
  clearInterval(badDropMaker);
  clearInterval(timerInterval);

  // Remove all existing drops from the game area
  const gameContainer = document.getElementById("game-container");
  while (gameContainer.firstChild) {
    gameContainer.removeChild(gameContainer.firstChild);
  }

  // Pick a message based on score
  let message, title;
  if (score >= 20) {
    message = winMessages[Math.floor(Math.random() * winMessages.length)];
    title = `You Win! 🎉`;
    if (window.launchConfetti) window.launchConfetti();
  } else {
    message = loseMessages[Math.floor(Math.random() * loseMessages.length)];
    title = `Try Again!`;
  }

  // Show modal with final score and message
  showEndgameModal(title, `Final Score: ${score}<br>${message}`);
}

// Modal logic
function showEndgameModal(title, message) {
  const modal = document.getElementById('endgame-modal');
  document.getElementById('modal-title').innerHTML = title;
  document.getElementById('modal-message').innerHTML = message;
  modal.style.display = 'block';
}

// Close modal on X click
document.getElementById('close-modal').onclick = function() {
  document.getElementById('endgame-modal').style.display = 'none';
}

// Close modal if user clicks outside modal content
window.onclick = function(event) {
  const modal = document.getElementById('endgame-modal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
}

