import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const { height, width } = Dimensions.get('window');
import NavigationService from '../../NavigationService';

export default class ListItem extends Component {
  _onPress = () => {
    NavigationService.navigate('OrderDetail', {
      order_id: this.props.data.order_id
    });
  };
  render() {
    return (
      <TouchableOpacity onPress={this._onPress} style={styles.mainBox}>
        <View style={styles.itemContainer}>
          <Image
            style={styles.image}
            source={{
              uri: this.props.data.imageUrl
            }}
          />
          <View style={styles.textContainer}>
            <Text style={styles.destination}>
              {this.props.data.destination}
            </Text>
            <Text style={styles.productName}>
              {this.props.data.productName}
            </Text>
            <View style={{ flexDirection: 'row', paddingRight: width * 0.02 }}>
              <Text>{this.props.data.due}</Text>
              <View style={{ position: 'absolute', right: 0 }}>
                <Text>{this.props.data.price.toLocaleString()}원</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  mainBox: {
    flex: 1,
    width: width,
    justifyContent: 'center',
    // alignItems: 'stretch',
    backgroundColor: '#fff',
    // paddingTop: width * 0.05,
    // paddingBottom: 5,
    paddingLeft: width * 0.05,
    paddingRight: width * 0.05,
    alignItems: 'stretch'
  },
  itemContainer: {
    alignSelf: 'stretch',
    alignItems: 'stretch',
    flexDirection: 'row',
    paddingLeft: width * 0.01,
    paddingRight: width * 0.01,
    paddingTop: width * 0.03,
    paddingBottom: width * 0.03,
    borderBottomWidth: 1,
    // borderTopWidth: 1,
    borderColor: '#a7a7a7'
  },
  image: {
    width: width * 0.15,
    height: width * 0.15,
    margin: width * 0.05,
    marginLeft: width * 0.03
  },
  textContainer: {
    width: width * 0.6,
    alignItems: 'stretch',
    marginTop: 15,
    marginBottom: 15,
    marginLeft: width * 0.02,
    marginRight: width * 0.02,
    justifyContent: 'center'
  },
  destination: {
    fontSize: 13
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    paddingTop: 4,
    paddingBottom: 4,
    maxWidth: width * 0.6,
    overflow: 'hidden'
  },
  due: {
    fontSize: 13
  },
  price: {
    fontSize: 13
  }
});
