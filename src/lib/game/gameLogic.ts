import type { GameState, Ladder, Player, Snake } from './types';

export const BOARD_SIZE = 100;
export const DEFAULT_SNAKES: Snake[] = [
  { start: 16, end: 6 },
  { start: 47, end: 26 },
  { start: 49, end: 11 },
  { start: 56, end: 53 },
  { start: 62, end: 19 },
  { start: 64, end: 60 },
  { start: 87, end: 24 },
  { start: 93, end: 73 },
  { start: 95, end: 75 },
  { start: 98, end: 78 },
];

export const DEFAULT_LADDERS: Ladder[] = [
  { start: 1, end: 38 },
  { start: 4, end: 14 },
  { start: 9, end: 31 },
  { start: 21, end: 42 },
  { start: 28, end: 84 },
  { start: 36, end: 44 },
  { start: 51, end: 67 },
  { start: 71, end: 91 },
  { start: 80, end: 100 },
];

export function rollDice(min: number = 1, max: number = 6): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function movePlayer(
  player: Player,
  diceValue: number,
  snakes: Snake[],
  ladders: Ladder[]
): { player: Player; snakeBite: boolean; ladderClimb: boolean } {
  let newPosition = player.position + diceValue;
  let snakeBite = false;
  let ladderClimb = false;

  // Handle boundary conditions
  if (newPosition < 1) {
    newPosition = 1;
  } else if (newPosition > BOARD_SIZE) {
    newPosition = BOARD_SIZE;
  } else {
    // Check for snakes
    const snake = snakes.find((s) => s.start === newPosition);
    if (snake) {
      newPosition = snake.end;
      snakeBite = true;
    }

    // Check for ladders
    const ladder = ladders.find((l) => l.start === newPosition);
    if (ladder) {
      newPosition = ladder.end;
      ladderClimb = true;
    }
  }

  return {
    player: {
      ...player,
      position: newPosition,
      stats: {
        ...player.stats,
        snakeBites: player.stats.snakeBites + (snakeBite ? 1 : 0),
        ladderClimbs: player.stats.ladderClimbs + (ladderClimb ? 1 : 0),
      },
    },
    snakeBite,
    ladderClimb,
  };
}

export function checkWinCondition(player: Player): boolean {
  return player.position === BOARD_SIZE;
}

export function getNextPlayer(currentIndex: number, players: Player[]): number {
  return (currentIndex + 1) % players.length;
}

export function createInitialGameState(players: Player[]): GameState {
  return {
    players: players.map((player) => ({
      ...player,
      position: 1,
      isWinner: false,
      isActive: true,
      stats: {
        totalRolls: 0,
        snakeBites: 0,
        ladderClimbs: 0,
        totalDiceValue: 0,
      },
    })),
    currentPlayerIndex: 0,
    diceValue: 0,
    gameStatus: 'playing',
    winner: null,
    boardSize: BOARD_SIZE,
    snakes: DEFAULT_SNAKES,
    ladders: DEFAULT_LADDERS,
    totalRolls: 0,
    diceMin: 1,
    diceMax: 6,
    snakeCount: 8,
    ladderCount: 8,
  };
}

export function isSnakePosition(position: number, snakes: Snake[]): boolean {
  return snakes.some(snake => snake.start === position);
}

export function isLadderPosition(position: number, ladders: Ladder[]): boolean {
  return ladders.some(ladder => ladder.start === position);
}

export function getSnakeEnd(position: number, snakes: Snake[]): number | null {
  const snake = snakes.find(s => s.start === position);
  return snake ? snake.end : null;
}

export function getLadderEnd(position: number, ladders: Ladder[]): number | null {
  const ladder = ladders.find(l => l.start === position);
  return ladder ? ladder.end : null;
}

export function getAverageDiceValue(player: Player): number {
  return player.stats.totalRolls > 0
    ? player.stats.totalDiceValue / player.stats.totalRolls
    : 0;
}

export function generateRandomSnakes(count: number = 8): Snake[] {
  const snakes: Snake[] = [];
  const usedPositions = new Set<number>();
  
  // Snake positions should be in the middle to upper range of the board
  const minSnakeStart = 20;
  const maxSnakeStart = 95;
  
  for (let i = 0; i < count; i++) {
    let start: number;
    let end: number;
    let attempts = 0;
    
    do {
      start = Math.floor(Math.random() * (maxSnakeStart - minSnakeStart + 1)) + minSnakeStart;
      // Snake end should be lower than start and not too close to the bottom
      const minEnd = Math.max(1, start - 40);
      const maxEnd = Math.max(1, start - 5);
      end = Math.floor(Math.random() * (maxEnd - minEnd + 1)) + minEnd;
      attempts++;
    } while (
      usedPositions.has(start) || 
      usedPositions.has(end) || 
      start === end ||
      attempts > 50
    );
    
    if (attempts <= 50) {
      snakes.push({ start, end });
      usedPositions.add(start);
      usedPositions.add(end);
    }
  }
  
  return snakes;
}

export function generateRandomLadders(count: number = 8, existingSnakes: Snake[] = []): Ladder[] {
  const ladders: Ladder[] = [];
  const usedPositions = new Set<number>();
  
  // Add existing snake positions to used positions
  existingSnakes.forEach(snake => {
    usedPositions.add(snake.start);
    usedPositions.add(snake.end);
  });
  
  // Ladder positions should be in the lower to middle range of the board
  const minLadderStart = 1;
  const maxLadderStart = 80;
  
  for (let i = 0; i < count; i++) {
    let start: number;
    let end: number;
    let attempts = 0;
    
    do {
      start = Math.floor(Math.random() * (maxLadderStart - minLadderStart + 1)) + minLadderStart;
      // Ladder end should be higher than start and not too close to the top
      const minEnd = Math.min(100, start + 5);
      const maxEnd = Math.min(100, start + 40);
      end = Math.floor(Math.random() * (maxEnd - minEnd + 1)) + minEnd;
      attempts++;
    } while (
      usedPositions.has(start) || 
      usedPositions.has(end) || 
      start === end ||
      attempts > 50
    );
    
    if (attempts <= 50) {
      ladders.push({ start, end });
      usedPositions.add(start);
      usedPositions.add(end);
    }
  }
  
  return ladders;
}

export function createRandomGameState(players: Player[], snakeCount: number = 8, ladderCount: number = 8): GameState {
  // Generate snakes with the specified count
  const snakes = generateRandomSnakes(snakeCount);
  
  // Generate ladders with the specified count and awareness of existing snakes
  const ladders = generateRandomLadders(ladderCount, snakes);
  
  // Validate the board configuration
  const validation = validateBoardConfiguration(snakes, ladders);
  if (!validation.isValid) {
    // Use default configuration as fallback
    return {
      players: players.map((player) => ({
        ...player,
        position: 1,
        isWinner: false,
        isActive: true,
        stats: {
          totalRolls: 0,
          snakeBites: 0,
          ladderClimbs: 0,
          totalDiceValue: 0,
        },
      })),
      currentPlayerIndex: 0,
      diceValue: 0,
      gameStatus: 'playing',
      winner: null,
      boardSize: BOARD_SIZE,
      snakes: DEFAULT_SNAKES,
      ladders: DEFAULT_LADDERS,
      totalRolls: 0,
      diceMin: 1,
      diceMax: 6,
      snakeCount: snakeCount,
      ladderCount: ladderCount,
    };
  }
  
  return {
    players: players.map((player) => ({
      ...player,
      position: 1,
      isWinner: false,
      isActive: true,
      stats: {
        totalRolls: 0,
        snakeBites: 0,
        ladderClimbs: 0,
        totalDiceValue: 0,
      },
    })),
    currentPlayerIndex: 0,
    diceValue: 0,
    gameStatus: 'playing',
    winner: null,
    boardSize: BOARD_SIZE,
    snakes: snakes,
    ladders: ladders,
    totalRolls: 0,
    diceMin: 1,
    diceMax: 6,
    snakeCount: snakeCount,
    ladderCount: ladderCount,
  };
}

export function validateBoardConfiguration(snakes: Snake[], ladders: Ladder[]): { isValid: boolean; conflicts: string[] } {
  const conflicts: string[] = [];
  const usedPositions = new Set<number>();
  
  // Check for conflicts within snakes
  snakes.forEach((snake, index) => {
    if (usedPositions.has(snake.start)) {
      conflicts.push(`Snake ${index + 1} start position ${snake.start} conflicts with another element`);
    }
    if (usedPositions.has(snake.end)) {
      conflicts.push(`Snake ${index + 1} end position ${snake.end} conflicts with another element`);
    }
    if (snake.start === snake.end) {
      conflicts.push(`Snake ${index + 1} has same start and end position: ${snake.start}`);
    }
    usedPositions.add(snake.start);
    usedPositions.add(snake.end);
  });
  
  // Check for conflicts within ladders
  ladders.forEach((ladder, index) => {
    if (usedPositions.has(ladder.start)) {
      conflicts.push(`Ladder ${index + 1} start position ${ladder.start} conflicts with another element`);
    }
    if (usedPositions.has(ladder.end)) {
      conflicts.push(`Ladder ${index + 1} end position ${ladder.end} conflicts with another element`);
    }
    if (ladder.start === ladder.end) {
      conflicts.push(`Ladder ${index + 1} has same start and end position: ${ladder.start}`);
    }
    usedPositions.add(ladder.start);
    usedPositions.add(ladder.end);
  });
  
  return {
    isValid: conflicts.length === 0,
    conflicts
  };
}

export function createDefaultGameState(players: Player[]): GameState {
  return {
    players: players.map((player) => ({
      ...player,
      position: 1,
      isWinner: false,
      isActive: true,
      stats: {
        totalRolls: 0,
        snakeBites: 0,
        ladderClimbs: 0,
        totalDiceValue: 0,
      },
    })),
    currentPlayerIndex: 0,
    diceValue: 0,
    gameStatus: 'playing',
    winner: null,
    boardSize: BOARD_SIZE,
    snakes: DEFAULT_SNAKES,
    ladders: DEFAULT_LADDERS,
    totalRolls: 0,
    diceMin: 1,
    diceMax: 6,
    snakeCount: 8,
    ladderCount: 8,
  };
} 