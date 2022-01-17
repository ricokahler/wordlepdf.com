import { words } from './words';

// this date is hardcoded in the Wordle sorce code
const epoch = new Date(2021, 5, 19, 0, 0, 0, 0);

/**
 * Given a date, returns the wordle number. This will correspond to the Wordle
 * number shared on socials. e.g "Wordle 210" etc
 */
export function getWordleNumber(date: Date) {
  const delta =
    new Date(date).setHours(0, 0, 0, 0) - epoch.setHours(0, 0, 0, 0);
  const oneDay = 1000 * 60 * 60 * 24;

  return Math.round(delta / oneDay);
}

/**
 * Gets the solution for the given day
 */
export function getSolution(date: Date) {
  return words[getWordleNumber(date) % words.length];
}
