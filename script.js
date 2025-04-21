const config = {
    playerSize: 20,
    playerSpeed: 5,
    currentLevel: 0,
    twoPlayerMode: false
};

// Game elements
const gameContainer = document.getElementById('game-container');
const player1 = document.getElementById('player1');
const player2 = document.getElementById('player2');
const goal = document.getElementById('goal');
const message = document.getElementById('message');
const levelNumber = document.getElementById('level-number');

// Player positions
let player1Position = { x: 0, y: 0 };
let player2Position = { x: 0, y: 0 };
let goalPosition = { x: 0, y: 0 };

// Keys pressed state
const keysPressed = {};

// Initialize the game
function initGame() {
    loadLevel(config.currentLevel);
    
    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // Update player 2 visibility based on mode
    player2.style.display = config.twoPlayerMode ? 'block' : 'none';
    
    // Start game loop
    gameLoop();
}

// Load a specific level
function loadLevel(levelIndex) {
    // Clear existing walls
    document.querySelectorAll('.wall').forEach(wall => wall.remove());
    
    // Get level data
    const level = LEVELS[levelIndex];
    
    // Update level number display
    levelNumber.textContent = levelIndex + 1;
    
    // Set game container dimensions
    gameContainer.style.width = level.size.width + 'px';
    gameContainer.style.height = level.size.height + 'px';
    
    // Set player positions
    player1Position = { ...level.player1Start };
    player2Position = { ...level.player2Start };
    
    // Set goal position
    goalPosition = { ...level.goalPos };
    goal.style.left = goalPosition.x + 'px';
    goal.style.top = goalPosition.y + 'px';
    
    // Update player positions on screen
    updatePlayerPositions();
    
    // Create walls
    createWalls(level.walls);
    
    // Clear message
    message.textContent = "";
    message.style.color = "#333";
}

// Create wall elements
function createWalls(walls) {
    walls.forEach((wall, index) => {
        const wallElement = document.createElement('div');
        wallElement.className = 'wall';
        wallElement.style.left = wall[0] + 'px';
        wallElement.style.top = wall[1] + 'px';
        wallElement.style.width = wall[2] + 'px';
        wallElement.style.height = wall[3] + 'px';
        gameContainer.appendChild(wallElement);
    });
}

// Handle key down
function handleKeyDown(e) {
    keysPressed[e.key] = true;
    // Prevent page scrolling with movement keys
    if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D'].includes(e.key)) {
        e.preventDefault();
    }
}

// Handle key up
function handleKeyUp(e) {
    keysPressed[e.key] = false;
    if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D'].includes(e.key)) {
        e.preventDefault();
    }
}

// Game loop
function gameLoop() {
    movePlayer1();
    if (config.twoPlayerMode) {
        movePlayer2();
    }
    checkWin();
    requestAnimationFrame(gameLoop);
}

// Move player 1 based on WASD keys
function movePlayer1() {
    let dx = 0;
    let dy = 0;

    // WASD controls
    if (keysPressed['w'] || keysPressed['W']) {
        dy -= config.playerSpeed;
    }
    if (keysPressed['a'] || keysPressed['A']) {
        dx -= config.playerSpeed;
    }
    if (keysPressed['s'] || keysPressed['S']) {
        dy += config.playerSpeed;
    }
    if (keysPressed['d'] || keysPressed['D']) {
        dx += config.playerSpeed;
    }

    movePlayer(player1Position, dx, dy, 1);
}

// Move player 2 based on arrow keys
function movePlayer2() {
    let dx = 0;
    let dy = 0;

    // Arrow key controls
    if (keysPressed['ArrowUp']) {
        dy -= config.playerSpeed;
    }
    if (keysPressed['ArrowLeft']) {
        dx -= config.playerSpeed;
    }
    if (keysPressed['ArrowDown']) {
        dy += config.playerSpeed;
    }
    if (keysPressed['ArrowRight']) {
        dx += config.playerSpeed;
    }

    movePlayer(player2Position, dx, dy, 2);
}

// Common player movement logic
function movePlayer(playerPos, dx, dy, playerNum) {
    if (dx === 0 && dy === 0) return;
    
    // Get current level data
    const level = LEVELS[config.currentLevel];
    
    // Calculate new position
    let newX = playerPos.x + dx;
    let newY = playerPos.y + dy;

    // Check boundaries
    if (newX < 0) newX = 0;
    if (newY < 0) newY = 0;
    if (newX > level.size.width - config.playerSize) {
        newX = level.size.width - config.playerSize;
    }
    if (newY > level.size.height - config.playerSize) {
        newY = level.size.height - config.playerSize;
    }

    // Check if the new position would cause a collision
    const wouldCollide = checkWallCollision(newX, newY);
    
    // Only update position if no collision would occur
    if (!wouldCollide) {
        playerPos.x = newX;
        playerPos.y = newY;
        
        // Update player position on screen
        if (playerNum === 1) {
            player1.style.left = playerPos.x + 'px';
            player1.style.top = playerPos.y + 'px';
        } else {
            player2.style.left = playerPos.x + 'px';
            player2.style.top = playerPos.y + 'px';
        }
    }
}

// Update both player positions on screen
function updatePlayerPositions() {
    player1.style.left = player1Position.x + 'px';
    player1.style.top = player1Position.y + 'px';
    player2.style.left = player2Position.x + 'px';
    player2.style.top = player2Position.y + 'px';
}

// Check if a position would collide with any wall
function checkWallCollision(x, y) {
    const playerRect = {
        left: x,
        top: y,
        right: x + config.playerSize,
        bottom: y + config.playerSize
    };

    const level = LEVELS[config.currentLevel];

    // Check each wall
    for (const wall of level.walls) {
        const wallRect = {
            left: wall[0],
            top: wall[1],
            right: wall[0] + wall[2],
            bottom: wall[1] + wall[3]
        };

        // Check for collision with a small buffer to prevent getting stuck
        if (
            playerRect.right > wallRect.left + 1 &&
            playerRect.left < wallRect.right - 1 &&
            playerRect.bottom > wallRect.top + 1 &&
            playerRect.top < wallRect.bottom - 1
        ) {
            return true; // Collision would occur
        }
    }
    return false; // No collision
}

// Check if either player has reached the goal
function checkWin() {
    // Check player 1
    const distance1 = Math.sqrt(
        Math.pow(player1Position.x - goalPosition.x, 2) +
        Math.pow(player1Position.y - goalPosition.y, 2)
    );
    
    // Check player 2 if in two player mode
    const distance2 = config.twoPlayerMode ? Math.sqrt(
        Math.pow(player2Position.x - goalPosition.x, 2) +
        Math.pow(player2Position.y - goalPosition.y, 2)
    ) : Infinity;

    if (distance1 < config.playerSize || distance2 < config.playerSize) {
        // Determine which player won
        let winMessage = "";
        if (distance1 < config.playerSize && distance2 < config.playerSize) {
            winMessage = "Both players reached the goal together!";
        } else if (distance1 < config.playerSize) {
            winMessage = "Player 1 reached the goal!";
        } else {
            winMessage = "Player 2 reached the goal!";
        }
        
        // Check if there are more levels
        if (config.currentLevel < LEVELS.length - 1) {
            message.textContent = winMessage + " Advancing to next level...";
            message.style.color = "green";
            
            // Go to next level after a delay
            setTimeout(() => {
                config.currentLevel++;
                loadLevel(config.currentLevel);
            }, 2000);
        } else {
            // Game completed
            message.textContent = winMessage + " You completed all levels!";
            message.style.color = "green";
        }
    }
}

// Reset the current level
function resetGame() {
    loadLevel(config.currentLevel);
}

// Emergency reset - teleport players to starting positions
function emergencyReset() {
    const level = LEVELS[config.currentLevel];
    player1Position = { ...level.player1Start };
    player2Position = { ...level.player2Start };
    updatePlayerPositions();
    
    message.textContent = "Emergency reset applied!";
    setTimeout(() => {
        message.textContent = "";
    }, 2000);
}

// Toggle between 1 player and 2 player modes
function togglePlayers() {
    config.twoPlayerMode = !config.twoPlayerMode;
    player2.style.display = config.twoPlayerMode ? 'block' : 'none';
    
    message.textContent = config.twoPlayerMode ? 
        "Two player mode activated!" : 
        "One player mode activated!";
    
    setTimeout(() => {
        message.textContent = "";
    }, 2000);
}

// Initialize game when page loads
window.onload = initGame;
