import React from 'react';
import { TextInput, View, Text } from 'react-native';

const InputBox = ({
  onChangeText,
  placeholder,
  secureTextEntry,
  onEndEditing
}) => {
  const { inputStyle, containerStyle } = styles;

  return (
    <View style={containerStyle}>
      <TextInput
        placeholder={placeholder}
        autoCorrect={false}
        autoCapitalize="none"
        style={inputStyle}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
        onEndEditing={onEndEditing}
      />
    </View>
  );
};
export default InputBox;

const styles = {
  inputStyle: {
    color: '#000',
    paddingRight: 10,
    paddingLeft: 10,
    fontSize: 15,
    lineHeight: 20,
    width: '80%'
    // backgroundColor: 'black'
    // flex: 2
  },
  containerStyle: {
    height: 30,
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 5,
    marginBottom: 5
  }
};
