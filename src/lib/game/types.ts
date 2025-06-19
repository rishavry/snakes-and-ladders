export interface PlayerStats {
  totalRolls: number;
  snakeBites: number;
  ladderClimbs: number;
  totalDiceValue: number;
}

export interface Player {
  id: number;
  name: string;
  color: string;
  position: number;
  isCPU: boolean;
  isWinner: boolean;
  isActive: boolean;
  stats: PlayerStats;
}

export interface Snake {
  start: number;
  end: number;
}

export interface Ladder {
  start: number;
  end: number;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  diceValue: number;
  gameStatus: 'setup' | 'playing' | 'finished';
  winner: Player | null;
  boardSize: number;
  snakes: Snake[];
  ladders: Ladder[];
  totalRolls: number;
  diceMin: number;
  diceMax: number;
  snakeCount: number;
  ladderCount: number;
}

export interface GameSettings {
  playerCount: number;
  cpuCount: number;
  playerNames: string[];
  playerColors: string[];
  diceMin: number;
  diceMax: number;
  snakeCount: number;
  ladderCount: number;
}

export type Difficulty = 'easy' | 'medium' | 'hard'; 