import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { Icon } from 'react-native-elements';
const { height, width } = Dimensions.get('window');

export default class TravelList extends Component {
  render() {
    return (
      <View style={styles.mainBox}>
        <View style={styles.mainTitle}>
          <Icon
            name="airplane-takeoff"
            size={16}
            style={{ color: '#5bb487', paddingLeft: width * 0.035 }}
          />
          <Text style={styles.titleText}>{this.props.data.destination}</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.DEPSchedule}>
            <Text style={styles.scheduleText}>
              {this.props.data.destination}
            </Text>
            <View style={styles.rightTextContainer}>
              <Text style={styles.scheduleText}>
                {this.props.data.departingDate}
              </Text>
              <Text style={styles.scheduleText}>출발</Text>
            </View>
          </View>
          <View style={styles.ARRSchedule}>
            <Text style={styles.scheduleText}>대한민국</Text>
            <View style={styles.rightTextContainer}>
              <Text style={styles.scheduleText}>
                {this.props.data.arrivingDate}
              </Text>
              <Text style={styles.scheduleText}>도착</Text>
            </View>
          </View>
        </View>
      </View>
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
    paddingTop: 25,
    paddingBottom: 5,
    paddingLeft: 30,
    paddingRight: 30
  },
  titleText: {
    paddingLeft: width * 0.02,
    fontSize: 15,
    fontWeight: '600',
    color: '#5bb487'
  },
  mainTitle: {
    flexDirection: 'row',
    marginBottom: 6
  },
  content: {
    paddingTop: width * 0.038,
    paddingBottom: width * 0.038,
    // borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#a7a7a7',
    justifyContent: 'center'
  },
  rightTextContainer: {
    flexDirection: 'row',
    // alignSelf: 'flex-end'
    // alignItems: 'flex-end'
    // justifyContent: 'flex-end'
    position: 'absolute',
    right: 0
  },
  scheduleText: {
    fontSize: 12,
    paddingRight: width * 0.035,
    paddingLeft: width * 0.035,
    alignSelf: 'center',
    textAlignVertical: 'center'
  },
  DEPSchedule: {
    flexDirection: 'row',
    marginBottom: 7
    // alignItems: 'stretch'
  },
  ARRSchedule: {
    flexDirection: 'row'
    // alignItems: 'stretch'
  }
});
