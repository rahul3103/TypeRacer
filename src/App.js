import React, { Component } from 'react';
import { Paper, Button, Grid } from '@material-ui/core';

import Paragraph from './components/Paragraph';
import InputField from './components/InputField';

const timeInMinutes = 5;
const initialState = {
  term: '',
  currentWord: '',
  beforeCursor: '',
  afterCursor: '',
  position: 0,
  errorLength: 0,
  runningTime: timeInMinutes * 60,
  timerOn: false,
  typingFinished: false,
  error: false
};
class App extends Component {
  state = {
    text: '',
    ...initialState
  };

  componentDidMount() {
    fetch('https://www.randomtext.me/api/')
      .then(resp => resp.json())
      .then(data =>
        this.setState(
          { text: data.text_out.replace(/<(.|\n)*?>/g, '') },
          () => {
            const [before, after] = this.splitSentence(this.state.text, ' ');
            this.setState({ currentWord: before, afterCursor: after });
          }
        )
      )
      .catch(() => this.setState({ error: true }));
  }

  splitSentence = (sentence, term) => {
    const position = sentence.indexOf(term);
    if (position < 0) return [sentence, ''];
    const before = sentence.substr(0, position);
    const after = sentence.substr(position + 1);
    return [before, after];
  };

  handleInput = event => {
    let {
      currentWord,
      afterCursor,
      position,
      errorLength,
      timerOn
    } = this.state;
    const term = event.target.value;
    const lastChar = term.slice(-1);
    if (!timerOn) this.handleTime();
    if (currentWord.startsWith(term)) {
      position = term.length;
      errorLength = 0;
    } else {
      errorLength = term.length - position;
    }
    if (afterCursor === '' && lastChar === currentWord.slice(-1)) {
      this.updateValues();
      this.handleTime();
      this.setState({ typingFinished: true });
    }
    if (errorLength > 5) return;
    if (lastChar === ' ' && term.trim() === currentWord) this.updateValues();
    else this.setState({ term, position, errorLength });
  };

  updateValues = () => {
    let { afterCursor, beforeCursor, currentWord } = this.state;
    const [before, after] = this.splitSentence(afterCursor, ' ');
    this.setState({
      afterCursor: after,
      beforeCursor: beforeCursor + ' ' + currentWord,
      currentWord: before,
      term: '',
      position: 0,
      errorLength: 0
    });
  };

  handleTime = () => {
    let { timerOn, runningTime } = this.state;
    if (timerOn) {
      clearInterval(this.timer);
    } else {
      this.timer = setInterval(() => {
        if (runningTime === 0) {
          clearInterval(this.timer);
          this.setState({ typingFinished: true });
        } else this.setState({ runningTime: --runningTime });
      }, 1000);
    }
    this.setState({ timerOn: !timerOn });
  };

  handleReset = () => {
    clearInterval(this.timer);
    const { text } = this.state;
    const [before, after] = this.splitSentence(text, ' ');
    const data = Object.assign(initialState, {
      currentWord: before,
      afterCursor: after
    });
    this.setState({ ...data });
  };

  handlePause = () => {
    const { typingFinished } = this.state;
    this.handleTime();
    this.setState({ typingFinished: !typingFinished });
  };

  render() {
    const {
      currentWord,
      term,
      beforeCursor,
      afterCursor,
      errorLength,
      position,
      runningTime,
      typingFinished,
      timerOn,
      error
    } = this.state;
    if (error) return <p>Somethings Wrong</p>;
    const remainingTime = (timeInMinutes * 60 - runningTime) / 60;
    let wpm = 0;
    const typedWordsLength = beforeCursor.split(' ').length - 1;
    const minutes = parseInt(runningTime / 60, 10);
    const seconds = parseInt(runningTime % 60, 10);
    if (typedWordsLength === 0) wpm = 0;
    else wpm = parseInt(typedWordsLength / remainingTime);
    return (
      <Grid container style={{ marginTop: 30, textAlign: 'center' }}>
        <Grid item xs={12} md={12} lg={8} style={{ margin: '0 auto' }}>
          <h1>TYPE RACER</h1>
          <Paper>
            <Paragraph
              currentWord={currentWord + ' '}
              beforeCursor={beforeCursor + ' '}
              afterCursor={afterCursor}
              errorLength={errorLength}
              position={position}
            />
            <div>
              {typingFinished && <p>You finished the race</p>}
              <p>
                {minutes}:{seconds} minutes
              </p>
              <p>{wpm} wpm</p>
            </div>
            <div>
              <InputField
                error={errorLength > 0}
                disabled={typingFinished}
                term={term}
                handleInput={this.handleInput}
              />
              {errorLength > 0 && <p style={{ color: 'red' }}>TYPO</p>}
            </div>
            {(timerOn || typingFinished) && (
              <Button
                style={{
                  backgroundColor: '#e10050',
                  color: '#fff',
                  margin: '20px 0px'
                }}
                onClick={this.handleReset}
              >
                Reset
              </Button>
            )}
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default App;
