import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Avatar } from 'react-native-elements';

export default class MyListItem extends React.Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress} style={styles.buttonStyle}>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.imageContainer}>
            <Avatar
              rounded
              size={40}
              source={{ uri: this.props.sender.imageUrl }}
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.nameStyle}>{this.props.notice.title}</Text>
            <Text style={styles.messageStyle}>{this.props.notice.message}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  buttonStyle: {
    height: 60,
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'flex-start',
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    borderRadius: 5,
    borderBottomWidth: 1,
    borderColor: '#5bb487',
    marginLeft: '5%',
    marginRight: '5%'
  },
  textContainer: {
    paddingLeft: 7,
    paddingTop: 14,
    paddingBottom: 10,
    paddingRight: 8,
    overflow: 'hidden'
  },
  nameStyle: {
    color: '#212121',
    fontSize: 13,
    fontWeight: '600',
    alignSelf: 'flex-start',
    justifyContent: 'flex-start'
  },
  messageStyle: {
    alignSelf: 'stretch',
    height: 40,
    width: 233,
    textAlignVertical: 'center',
    color: '#212121',
    fontSize: 12,
    fontWeight: '400',
    overflow: 'hidden',
    paddingTop: 5,
    paddingRight: 8
  },
  imageContainer: {
    padding: 15,
    paddingTop: 10,
    paddingBottom: 10
  }
});
