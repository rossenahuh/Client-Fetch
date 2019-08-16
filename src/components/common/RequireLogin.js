import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-elements';
import NavigationService from '../../NavigationService';

export default class RequireLogin extends Component {
  render() {
    return (
      <View style={styles.bridge}>
        <Text style={styles.noticeText}>
          로그인이 필요한 기능입니다.
          {'\n'}로그인 하시겠습니까?
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            icon={<Icon name="user-circle-o" color="#5bb487" size={16} />}
            title="로그인 하러가기"
            titleStyle={styles.loginText}
            type="outline"
            buttonStyle={styles.loginButton}
            onPress={() => {
              NavigationService.navigate('AuthRoot');
            }}
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  bridge: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  noticeText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center'
  },
  buttonContainer: {
    width: '75%',
    paddingTop: 30,
    alignItems: 'stretch'
  },
  loginButton: {
    borderColor: '#5bb487',
    borderRadius: 5,
    width: '100%'
  },
  loginText: {
    fontSize: 14,
    fontWeight: '400',
    paddingLeft: 25,
    color: '#424242'
  }
});
