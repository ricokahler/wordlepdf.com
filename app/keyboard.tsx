import { View, Text, Link, StyleSheet } from '@react-pdf/renderer';
import { GameState } from './parse-state';
import { theme } from './constants';

const styles = StyleSheet.create({
  keyboard: {},
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  rowMargin: {
    marginBottom: 8,
  },
  cell: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    borderRadius: 4,
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Roboto',
    textDecoration: 'none',
    backgroundColor: theme.lightGray,
    color: theme.black,
  },
  cellMargin: {
    marginRight: 8,
  },
  enter: {},
  backspace: {},
  correct: {
    backgroundColor: theme.green,
    color: theme.white,
  },
  absent: {
    backgroundColor: theme.gray,
    color: theme.white,
  },
  present: {
    backgroundColor: theme.yellow,
    color: theme.white,
  },
  unset: {},
  link: {
    textDecoration: 'none',
  },
  disabled: {
    backgroundColor: theme.lighterGray,
    color: theme.lighterBlack,
  },
});

type Props = {
  style?: React.ComponentProps<typeof View>['style'];
} & Pick<
  GameState,
  | 'keyboard'
  | 'addLetter'
  | 'addLetterDisabled'
  | 'submitWord'
  | 'submitWordDisabled'
  | 'removeLetter'
  | 'removeLetterDisabled'
>;

type LinkWrapperProps = {
  letter: string;
  children: React.ReactNode;
};

type DeleteWrapperProps = {
  children: React.ReactNode;
};

type SubmitWrapperProps = {
  children: React.ReactNode;
};

export function Keyboard({
  style = [],
  keyboard,
  addLetter,
  addLetterDisabled,
  removeLetter,
  removeLetterDisabled,
  submitWord,
  submitWordDisabled,
}: Props) {
  const [firstRow, secondRow, thirdRow] = keyboard;

  function LetterWrapper({ letter, children }: LinkWrapperProps) {
    if (addLetterDisabled) return <>{children}</>;
    return (
      <Link style={styles.link} src={addLetter(letter)}>
        {children}
      </Link>
    );
  }

  function DeleteWrapper({ children }: DeleteWrapperProps) {
    if (removeLetterDisabled) return <>{children}</>;
    return (
      <Link style={styles.link} src={removeLetter()}>
        {children}
      </Link>
    );
  }

  function SubmitWordWrapper({ children }: SubmitWrapperProps) {
    if (submitWordDisabled) return <>{children}</>;
    return (
      <Link style={styles.link} src={submitWord()}>
        {children}
      </Link>
    );
  }

  return (
    <View
      style={[
        // no StyleSheet.compose in @react-pdf/renderer
        ...(Array.isArray(style) ? style : [style]),
        styles.keyboard,
      ]}
    >
      <View style={{ ...styles.row, ...styles.rowMargin }}>
        {firstRow.cells.map((cell, index) => (
          <LetterWrapper letter={cell.letter} key={index}>
            <View
              style={{
                ...styles.cell,
                ...(index < firstRow.cells.length - 1 && styles.cellMargin),
                ...styles[cell.type],
              }}
            >
              <Text>{cell.letter}</Text>
            </View>
          </LetterWrapper>
        ))}
      </View>

      <View style={{ ...styles.row, ...styles.rowMargin }}>
        {secondRow.cells.map((cell, index) => (
          <LetterWrapper letter={cell.letter} key={index}>
            <View
              style={{
                ...styles.cell,
                ...(index < secondRow.cells.length - 1 && styles.cellMargin),
                ...styles[cell.type],
              }}
            >
              <Text>{cell.letter}</Text>
            </View>
          </LetterWrapper>
        ))}
      </View>

      <View style={styles.row}>
        <SubmitWordWrapper>
          <View
            style={{
              ...styles.cell,
              ...styles.cellMargin,
              ...(submitWordDisabled && styles.disabled),
            }}
          >
            <Text>Enter</Text>
          </View>
        </SubmitWordWrapper>

        {thirdRow.cells.map((cell, index) => (
          <LetterWrapper letter={cell.letter} key={index}>
            <View
              style={{
                ...styles.cell,
                ...styles.cellMargin,
                ...styles[cell.type],
              }}
            >
              <Text>{cell.letter}</Text>
            </View>
          </LetterWrapper>
        ))}

        <DeleteWrapper>
          <View
            style={{
              ...styles.cell,
              ...(removeLetterDisabled && styles.disabled),
            }}
          >
            <Text>{'Del'}</Text>
          </View>
        </DeleteWrapper>
      </View>
    </View>
  );
}
