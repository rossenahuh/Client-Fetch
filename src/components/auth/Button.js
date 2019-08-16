import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

export default (Button = ({ onPress, children }) => {
  const { buttonStyle, textStyle } = styles;

  return (
    <TouchableOpacity onPress={onPress} style={buttonStyle}>
      <Text style={textStyle}>{children}</Text>
    </TouchableOpacity>
  );
});

const styles = {
  textStyle: {
    alignSelf: 'center',
    color: '#212121',
    fontSize: 14,
    fontWeight: '400',
    paddingTop: 10,
    paddingBottom: 10
  },
  buttonStyle: {
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#5bb487',
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10
  }
};
