import { rollDice } from './gameLogic';
import type { Difficulty, Player } from './types';

export function makeCPUMove(player: Player, snakes: any[], ladders: any[], difficulty: Difficulty): number {
  // Add a small delay to make CPU moves feel more natural
  const delay = getDelayByDifficulty(difficulty);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const diceValue = rollDice();
      resolve(diceValue);
    }, delay);
  });
}

function getDelayByDifficulty(difficulty: Difficulty): number {
  switch (difficulty) {
    case 'easy':
      return 1000 + Math.random() * 1000; // 1-2 seconds
    case 'medium':
      return 500 + Math.random() * 500; // 0.5-1 seconds
    case 'hard':
      return 200 + Math.random() * 300; // 0.2-0.5 seconds
    default:
      return 500;
  }
}

export function shouldCPUPlayAggressively(player: Player, difficulty: Difficulty): boolean {
  const distanceToWin = 100 - player.position;
  
  switch (difficulty) {
    case 'easy':
      return distanceToWin <= 20;
    case 'medium':
      return distanceToWin <= 30;
    case 'hard':
      return distanceToWin <= 40;
    default:
      return false;
  }
} 