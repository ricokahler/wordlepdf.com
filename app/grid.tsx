import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { GameState } from './parse-state';
import { theme } from './constants';

const styles = StyleSheet.create({
  rows: {},
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  rowMargin: {
    marginBottom: 8,
  },
  cell: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    textTransform: 'uppercase',
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: 24,
  },
  correct: {
    backgroundColor: theme.green,
    color: theme.white,
  },
  present: {
    backgroundColor: theme.yellow,
    color: theme.white,
  },
  absent: {
    backgroundColor: theme.gray,
    color: theme.white,
  },
  unset: {
    border: `2px solid ${theme.lightGray}`,
  },
  hasLetter: {
    border: `2px solid ${theme.black}`,
  },
  cellMargin: {
    marginRight: 8,
  },
});

type Props = Pick<GameState, 'rows'> & {
  style?: React.ComponentProps<typeof View>['style'];
};

export function Grid({ rows, style = [] }: Props) {
  return (
    <View
      style={[
        // no StyleSheet.compose in @react-pdf/renderer
        ...(Array.isArray(style) ? style : [style]),
        styles.rows,
      ]}
    >
      {rows.map((row, rowIndex) => (
        <View
          key={rowIndex}
          style={{
            ...styles.row,
            ...(rowIndex < rows.length - 1 && styles.rowMargin),
          }}
        >
          {row.cells.map((cell, cellIndex) => (
            <View
              key={cellIndex}
              style={{
                ...styles.cell,
                ...(cellIndex < row.cells.length - 1 && styles.cellMargin),
                ...styles[cell.type],
                ...(cell.letter !== ' ' &&
                  cell.type === 'unset' &&
                  styles.hasLetter),
              }}
            >
              <Text>{cell.letter}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
