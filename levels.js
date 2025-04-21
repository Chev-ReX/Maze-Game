// Level definitions
// Each level contains:
// - walls: Array of [x, y, width, height] for each wall
// - player1Start: Starting position for player 1
// - player2Start: Starting position for player 2
// - goalPos: Position of the goal
// - size: Size of the game area

const LEVELS = [
    // Level 1 - Simple Maze (Easy)
    {
        walls: [
            [100, 0, 20, 180],
            [200, 120, 20, 180],
            [300, 0, 20, 180],
            [0, 150, 80, 20],
            [150, 250, 150, 20],
            [250, 50, 130, 20]
        ],
        player1Start: { x: 40, y: 40 },
        player2Start: { x: 40, y: 80 },
        goalPos: { x: 360, y: 260 },
        size: { width: 400, height: 300 }
    },
    
    // Level 2 - More complex maze (Medium)
    {
        walls: [
            [100, 0, 20, 150],
            [100, 200, 20, 150],
            [200, 50, 20, 200],
            [300, 100, 20, 200],
            [350, 0, 20, 60],
            [0, 100, 60, 20],
            [60, 200, 100, 20],
            [200, 300, 120, 20],
            [300, 50, 150, 20],
            [400, 150, 100, 20]
        ],
        player1Start: { x: 30, y: 30 },
        player2Start: { x: 30, y: 60 },
        goalPos: { x: 450, y: 350 },
        size: { width: 500, height: 400 }
    },
    
    // Level 3 - Complex maze with tight corridors (Hard)
    {
        walls: [
            [80, 0, 20, 350],
            [80, 350, 20, 100],
            [160, 50, 20, 400],
            [240, 0, 20, 350],
            [320, 100, 20, 400],
            [400, 0, 20, 350],
            [480, 100, 20, 400],
            [0, 80, 60, 20],
            [0, 160, 140, 20],
            [0, 240, 60, 20],
            [0, 320, 140, 20],
            [0, 400, 60, 20],
            [100, 80, 140, 20],
            [180, 160, 140, 20],
            [260, 240, 140, 20],
            [340, 320, 140, 20],
            [420, 80, 140, 20],
            [180, 400, 280, 20]
        ],
        player1Start: { x: 30, y: 30 },
        player2Start: { x: 30, y: 60 },
        goalPos: { x: 540, y: 450 },
        size: { width: 600, height: 500 }
    },
    
    // Level 4 - Maze with multiple paths (Very Hard)
    {
        walls: [
            [100, 0, 20, 500],
            [100, 580, 20, 120],
            [200, 100, 20, 500],
            [300, 0, 20, 500],
            [400, 100, 20, 500], 
            [500, 0, 20, 500],
            [600, 100, 20, 500],
            [0, 100, 80, 20],
            [0, 200, 180, 20],
            [0, 300, 80, 20],
            [0, 400, 180, 20],
            [0, 500, 80, 20],
            [0, 600, 180, 20],
            [120, 100, 160, 20],
            [220, 200, 160, 20],
            [320, 300, 160, 20],
            [420, 400, 160, 20],
            [520, 500, 160, 20],
            [120, 580, 560, 20]
        ],
        player1Start: { x: 30, y: 30 },
        player2Start: { x: 30, y: 70 },
        goalPos: { x: 650, y: 650 },
        size: { width: 700, height: 700 }
    }
];
