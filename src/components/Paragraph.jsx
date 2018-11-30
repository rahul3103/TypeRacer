import React from 'react';
import './../App.css';

const style = {
  beforeCursor: {
    color: 'orange'
  },
  currentWord: {
    color: 'green'
  },

  beforePos: {
    color: 'green',
    textDecoration: 'underline  blue'
  },
  error: {
    color: 'red'
  },
  para: {
    padding: 20
  }
};

const Paragraph = ({
  currentWord,
  beforeCursor,
  afterCursor,
  position,
  errorLength
}) => {
  return (
    <div className={'Disable'} style={style.para}>
      <span style={style.beforeCursor}>{beforeCursor}</span>
      <span style={style.beforePos} className={'Caret'}>
        {currentWord.substr(0, position)}
      </span>
      <span style={style.error}>
        {currentWord.substr(position, errorLength)}
      </span>
      <span style={style.currentWord}>
        {currentWord.substr(position + errorLength)}
      </span>
      <span>{afterCursor}</span>
    </div>
  );
};

export default Paragraph;
