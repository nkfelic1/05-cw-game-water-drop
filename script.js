// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let dropMaker; // Will store our timer that creates drops regularly
let score = 0; // Player's score
let timeLeft = 30; // Total game time in seconds
let timerInterval; // Will store our countdown timer interval

// Wait for button click to start the game
document.getElementById("start-btn").addEventListener("click", startGame);

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

function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;

  gameRunning = true;

  // Create new drops every second (1000 milliseconds)
  dropMaker = setInterval(createDrop, 1000);

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
