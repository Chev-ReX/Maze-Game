// Game configuration
const config = {
    width: 400,
    height: 300,
    playerSize: 20,
    playerSpeed: 5
};

// Game elements
const gameContainer = document.getElementById('game-container');
const player = document.getElementById('player');
const goal = document.getElementById('goal');
const message = document.getElementById('message');

// Set game container size
gameContainer.style.width = config.width + 'px';
gameContainer.style.height = config.height + 'px';

// Player position
let playerPosition = {
    x: 40,
    y: 40
};

// Goal position
const goalPosition = {
    x: config.width - 60,
    y: config.height - 60
};

// Define walls - format: [x, y, width, height]
// Adjusted walls to ensure there's always a clear path
const walls = [
    [100, 0, 20, 180],      // Left gap at bottom
    [200, 120, 20, 180],    // Left gap at top
    [300, 0, 20, 180],      // Left gap at bottom
    [0, 150, 80, 20],       // Smaller wall
    [150, 250, 150, 20],    // Bottom wall
    [250, 50, 130, 20]      // Upper right wall
];

// Keys pressed state
const keysPressed = {};

// Initialize the game
function initGame() {
    // Set game container dimensions
    gameContainer.style.width = config.width + 'px';
    gameContainer.style.height = config.height + 'px';

    // Place player
    updatePlayerPosition();

    // Place goal
    goal.style.left = goalPosition.x + 'px';
    goal.style.top = goalPosition.y + 'px';

    // Create walls
    createWalls();

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Start game loop
    gameLoop();
}

// Create wall elements
function createWalls() {
    // Clear existing walls first
    document.querySelectorAll('.wall').forEach(wall => wall.remove());
    
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
    // Prevent page scrolling with arrow keys and WASD
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
    movePlayer();
    checkCollisions();
    checkWin();
    requestAnimationFrame(gameLoop);
}

// Move player based on keys pressed
function movePlayer() {
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

    // Calculate new position
    let newX = playerPosition.x + dx;
    let newY = playerPosition.y + dy;

    // Check boundaries - better boundary checking
    if (newX < 0) newX = 0;
    if (newY < 0) newY = 0;
    if (newX > config.width - config.playerSize) newX = config.width - config.playerSize;
    if (newY > config.height - config.playerSize) newY = config.height - config.playerSize;

    // Check if the new position would cause a collision
    const wouldCollide = checkWallCollision(newX, newY);
    
    // Only update position if no collision would occur
    if (!wouldCollide) {
        playerPosition.x = newX;
        playerPosition.y = newY;
        updatePlayerPosition();
    }
}

// Check if a position would collide with any wall
function checkWallCollision(x, y) {
    const playerRect = {
        left: x,
        top: y,
        right: x + config.playerSize,
        bottom: y + config.playerSize
    };

    // Check each wall
    for (const wall of walls) {
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

// Update player element position
function updatePlayerPosition() {
    player.style.left = playerPosition.x + 'px';
    player.style.top = playerPosition.y + 'px';
}

// Check for collisions with walls (this is now just for visual feedback)
function checkCollisions() {
    const playerRect = {
        left: playerPosition.x,
        top: playerPosition.y,
        right: playerPosition.x + config.playerSize,
        bottom: playerPosition.y + config.playerSize
    };

    // Check each wall
    for (const wall of walls) {
        const wallRect = {
            left: wall[0],
            top: wall[1],
            right: wall[0] + wall[2],
            bottom: wall[1] + wall[3]
        };

        // Check for collision
        if (
            playerRect.right > wallRect.left &&
            playerRect.left < wallRect.right &&
            playerRect.bottom > wallRect.top &&
            playerRect.top < wallRect.bottom
        ) {
            // Just show a message, but don't reset position to avoid trapping
            message.textContent = "You're touching a wall! Be careful.";
            setTimeout(() => {
                message.textContent = "";
            }, 1000);
            return;
        }
    }
}

// Check if player has reached the goal
function checkWin() {
    const distance = Math.sqrt(
        Math.pow(playerPosition.x - goalPosition.x, 2) +
        Math.pow(playerPosition.y - goalPosition.y, 2)
    );

    if (distance < config.playerSize) {
        message.textContent = "Congratulations! You reached the goal!";
        message.style.color = "green";
        // Disable controls
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
    }
}

// Reset the game
function resetGame() {
    playerPosition.x = 40;
    playerPosition.y = 40;
    updatePlayerPosition();
    message.textContent = "";
    message.style.color = "#333";
    
    // Re-add event listeners
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
}

// Emergency reset - teleport player to a safe location
function emergencyReset() {
    playerPosition.x = 40;
    playerPosition.y = 40;
    updatePlayerPosition();
    message.textContent = "Emergency reset applied!";
    setTimeout(() => {
        message.textContent = "";
    }, 2000);
}

// Initialize game when page loads
window.onload = initGame;
