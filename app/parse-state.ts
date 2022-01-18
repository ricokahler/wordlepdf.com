import { getSolution, getWordleNumber } from './get-solution';
import { words, notWords } from './words';
import { baseUrl } from './constants';

const allWords = new Set(words);
const numberOfTries = 6;
const wordLength = 5;

type Cell = {
  type: 'unset' | 'absent' | 'present' | 'correct';
  letter: string;
};

type Row = { cells: Cell[] };

export type GameState = {
  rows: Row[];
  keyboard: Row[];
  state: 'done' | 'in-progress';
  message: string | null;
  submitWord: () => string;
  submitWordDisabled: boolean;
  addLetter: (letter: string) => string;
  addLetterDisabled: boolean;
  removeLetter: () => string;
  removeLetterDisabled: boolean;
  tweetIntent: string;
};

const qwertyKeyboardRows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'].map(
  (line): Row => ({
    cells: line.split('').map((letter): Cell => ({ type: 'unset', letter })),
  }),
);

const winMessages = [
  'Genius',
  'Magnificent',
  'Impressive',
  'Splendid',
  'Great',
  'Phew',
];

const scores = {
  unset: 0,
  absent: 1,
  present: 2,
  correct: 3,
} as const;

const squares = {
  unset: '⬜',
  absent: '⬜',
  present: '🟨',
  correct: '🟩',
} as const;

export function parseState(searchParams: URLSearchParams): GameState {
  const serializedState = searchParams.get('state') || '';
  const lastTimePlayed =
    searchParams.get('lastTimePlayed') ||
    new Date(new Date().setHours(0, 0, 0, 0)).toISOString();

  const solution = getSolution(new Date(lastTimePlayed));
  const wordleNumber = getWordleNumber(new Date(lastTimePlayed));
  const lettersInSolution = new Set(solution.split(''));

  const lines = serializedState.split(',').map((line) =>
    line
      .toLowerCase()
      .replace(/[^a-z]gi/, '')
      .substring(0, wordLength)
      .padEnd(wordLength, ' ')
      .split(''),
  );

  const prevLines = lines.slice(0, lines.length - 1);
  const activeLine = lines[lines.length - 1];

  const rowsFromPrevLines = prevLines.map(
    (word): Row => ({
      cells: word.map(
        (letter, index): Cell => ({
          letter,
          type:
            letter === ' '
              ? 'unset'
              : solution[index] === letter
              ? 'correct'
              : lettersInSolution.has(letter)
              ? 'present'
              : 'absent',
        }),
      ),
    }),
  );

  const activeLineRow = {
    cells: activeLine.map((letter): Cell => ({ type: 'unset', letter })),
  };

  const lettersInPrevLines = rowsFromPrevLines
    .flatMap((row) => row.cells)
    .reduce<Map<string, Cell['type']>>((acc, next) => {
      const prevType = acc.get(next.letter);
      const prevScore = (prevType && scores[prevType]) || 0;
      const nextScore = scores[next.type];

      if (nextScore > prevScore) {
        acc.set(next.letter, next.type);
      }

      return acc;
    }, new Map());

  const solved =
    rowsFromPrevLines[rowsFromPrevLines.length - 1]?.cells.every(
      (cell, index) => solution.charAt(index) === cell.letter,
    ) || false;
  const lost = lines.length > numberOfTries;

  const fillerRows = Array.from({
    length: numberOfTries - (rowsFromPrevLines.length + 1),
  }).map(
    (): Row => ({
      cells: Array.from({ length: wordLength }).map(() => ({
        type: 'unset',
        letter: ' ',
      })),
    }),
  );

  const activeLength = activeLineRow.cells.filter(
    (cell) => cell.letter !== ' ',
  ).length;

  const currentWord = activeLineRow.cells
    .map((cell) => cell.letter.trim())
    .join('');

  const notInWordList =
    currentWord.length >= wordLength &&
    !notWords.has(currentWord) &&
    !allWords.has(currentWord);

  const addLetterDisabled = activeLength >= wordLength;
  const submitWordDisabled = !addLetterDisabled || notInWordList;
  const removeLetterDisabled = activeLength <= 0;

  const squaresJoined = rowsFromPrevLines
    .map((row) => row.cells.map((cell) => squares[cell.type]).join(''))
    .join('\n');

  const tweetIntent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `Wordle ${wordleNumber} ${Math.min(
      lines.length - 1,
      numberOfTries,
    )}/${numberOfTries}\n\n${squaresJoined}`,
  )}`;

  return {
    keyboard: qwertyKeyboardRows.map(
      (row): Row => ({
        cells: row.cells.map((cell) => ({
          type: lettersInPrevLines.get(cell.letter) || 'unset',
          letter: cell.letter,
        })),
      }),
    ),
    rows: [...rowsFromPrevLines, activeLineRow, ...fillerRows].slice(
      0,
      numberOfTries,
    ),
    state: solved || lost ? 'done' : 'in-progress',
    message: (() => {
      if (solved) return winMessages[rowsFromPrevLines.length - 1];
      if (lost) return solution;
      if (notInWordList) return 'Not in word list';
      return '';
    })(),

    addLetterDisabled,
    addLetter: (letter) => {
      if (addLetterDisabled) return '';

      const params = new URLSearchParams();
      params.set('state', `${serializedState}${letter}`);
      params.set('lastTimePlayed', lastTimePlayed);

      return `${baseUrl}?${params}`;
    },

    submitWordDisabled,
    submitWord: () => {
      if (submitWordDisabled) return '';

      const params = new URLSearchParams();
      params.set('state', `${serializedState},`);
      params.set('lastTimePlayed', lastTimePlayed);

      return `${baseUrl}?${params}`;
    },

    removeLetterDisabled,
    removeLetter: () => {
      if (removeLetterDisabled) return '';

      const params = new URLSearchParams();
      params.set(
        'state',
        serializedState.substring(0, serializedState.length - 1),
      );
      params.set('lastTimePlayed', lastTimePlayed);

      return `${baseUrl}?${params}`;
    },

    tweetIntent,
  };
}
