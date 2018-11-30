import React from 'react';
import { TextField } from '@material-ui/core';

const InputField = ({ term, handleInput, disabled, error, currentWord }) => {
  return (
    <TextField
      style={{ width: 350 }}
      value={term}
      onChange={handleInput}
      margin="normal"
      variant="outlined"
      disabled={disabled}
      error={error}
      autoFocus
      placeholder={'Start typing to see your speed'}
    />
  );
};

export default InputField;
