import React, { Component } from 'react';
import { View, Text, Image, Dimensions, ScrollView, Alert } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/FontAwesome';
import MainOrderList from '../../components/main/MainOrderList';
import MainTravelList from '../../components/main/MainTravelList';
import theme from '../../components/styles/theme';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
EStyleSheet.build({ $rem: width / 380 });

class MainScreen extends Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: 'fetch',
      headerRight: (
        <Icon.Button
          name="comment"
          backgroundColor="#fff"
          color="#5bb487"
          style={{ paddingRight: 10 }}
          onPress={() => {
            navigation.navigate('DMs');
          }}
        />
      )
    };
  };

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          style={styles.main_photo}
          source={{
            uri:
              'https://www.hindustantimes.com/rf/image_size_960x540/HT/p2/2017/01/02/Pictures/_049acf58-d0d5-11e6-a11a-def9b3756538.jpg'
          }}
        />
        <View style={styles.order_scroll_view}>
          <Text style={styles.title}>NEW 요청</Text>
          <MainOrderList navigation={this.props.navigation} />
        </View>
        <View style={styles.travel_scroll_view}>
          <Text style={styles.title}>NEW 여행 일정</Text>
          <MainTravelList navigation={this.props.navigation} />
        </View>
      </ScrollView>
    );
  }
}

export default MainScreen;

const styles = EStyleSheet.create({
  container: {
    paddingBottom: '10rem'
  },
  main_photo: {
    width: width,
    aspectRatio: 5 / 3,
    marginBottom: '5rem'
  },
  order_scroll_view: {
    height: height * 0.3,
    margin: '8rem',
    marginBottom: '20rem'
  },
  travel_scroll_view: {
    height: height * 0.25,
    margin: '8rem'
  },
  title: {
    color: theme.MAIN_TEXT_COLOR,
    fontSize: '16rem',
    fontWeight: '600',
    marginBottom: '7rem'
  }
});
