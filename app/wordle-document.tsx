import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Link,
} from '@react-pdf/renderer';
import { GameState } from './parse-state';
import { Grid } from './grid';
import { Keyboard } from './keyboard';
import { roboto } from './roboto';
import { theme, baseUrl } from './constants';

Font.register({
  family: 'Roboto',
  src: roboto,
});

const styles = StyleSheet.create({
  page: {
    border: '1x solid red',
    height: '100%',
    padding: 16,
  },
  title: {
    alignSelf: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  message: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    fontSize: 12,
    color: theme.white,
    backgroundColor: theme.black,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    textTransform: 'uppercase',
  },
  grid: {
    marginBottom: 8,
    flex: 1,
  },
  keyboard: {
    marginBottom: 8,
  },
  footer: {
    fontSize: 12,
    // marginBottom: 8,
    alignItems: 'center',
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  link: {
    textDecoration: 'none',
    color: theme.black,
  },
  tweetLink: {
    textDecoration: 'none',
    color: theme.white,
  },
  spacer: {
    marginHorizontal: 8,
  },
});

export function WordleDocument({
  rows,
  keyboard,
  addLetter,
  addLetterDisabled,
  removeLetter,
  removeLetterDisabled,
  submitWord,
  submitWordDisabled,
  message,
  tweetIntent,
  state,
}: GameState) {
  return (
    <Document title="Wordle PDF" author="Rico Kahler">
      <Page size="A5" style={styles.page}>
        <Text style={styles.title}>Wordle PDF</Text>

        {Boolean(message) && (
          <View style={styles.message}>
            <Text>{message}</Text>
            {state === 'done' && (
              <>
                <Text style={styles.spacer}>|</Text>

                <Link style={styles.tweetLink} src={tweetIntent}>
                  <Text>Tweet it</Text>
                </Link>
              </>
            )}
          </View>
        )}
        <Grid style={styles.grid} rows={rows} />
        <Keyboard
          style={styles.keyboard}
          keyboard={keyboard}
          addLetter={addLetter}
          addLetterDisabled={addLetterDisabled}
          removeLetter={removeLetter}
          removeLetterDisabled={removeLetterDisabled}
          submitWord={submitWord}
          submitWordDisabled={submitWordDisabled}
        />
        <View style={styles.footer}>
          <Link style={styles.link} src={baseUrl}>
            <Text>Reset</Text>
          </Link>
          <Text style={styles.spacer}>|</Text>
          <Link
            style={styles.link}
            src="https://github.com/ricokahler/wordlepdf.com"
          >
            <Text>GitHub</Text>
          </Link>
        </View>
      </Page>
    </Document>
  );
}
