import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import theme from '../../components/styles/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as messageActions from '../../modules/messages';

const axios = require('axios');

class TravelDetailScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      travelInfo: null
    };
  }
  componentDidMount() {
    let travel_id = this.props.navigation.getParam('travel_id', 'error');
    if (travel_id !== 'error') {
      axios
        .get(`https://server.fetcher.fun/travels/detail?travel_id=${travel_id}`)
        .then(result =>
          this.setState({
            travelInfo: result.data
          })
        );
    }
  }

  render() {
    const { travelInfo } = this.state;
    const { isLogin, navigation } = this.props;
    return travelInfo ? (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.traveler_container}>
          <View style={styles.traveler_sub_container}>
            <Image
              style={styles.traveler_image}
              source={{ uri: travelInfo.travelerImageUrl }}
            />
            <Text style={styles.traveler_name}>
              {travelInfo.travelerName} 님
            </Text>
          </View>
          <Icon.Button
            name="comment"
            size={24}
            backgroundColor="transparent"
            color="white"
            iconStyle={{ marginRight: 0 }}
            onPress={() => {
              if (isLogin) {
                this.props.messageActions
                  .createChannel(
                    [travelInfo.traveler_id.toString()],
                    travelInfo.travelerName
                  )
                  .then(result => navigation.navigate('DMDetail'));
              } else {
                Alert.alert(
                  'fetch',
                  '로그인이 필요한 기능입니다. \n로그인 하시겠습니까?',
                  [
                    {
                      text: '로그인',
                      onPress: () => {
                        navigation.navigate('AuthRoot');
                      }
                    },
                    {
                      text: '취소'
                    }
                  ]
                );
              }
            }}
          />
        </View>
        <View style={styles.travel_info_title_container}>
          <Text style={styles.title}>여행 정보</Text>
          <MaterialIcon
            color={theme.MAIN_TEXT_COLOR}
            size={28}
            name="flight-takeoff"
          />
        </View>
        <View style={styles.date_info_container}>
          <View style={styles.departure_date_container}>
            <Text style={styles.date_row}>{travelInfo.destination}</Text>
            <Text style={styles.date_row}>{travelInfo.departingDate} 출발</Text>
          </View>
          <View style={styles.arrival_date_container}>
            <Text style={styles.date_row}>대한민국</Text>
            <Text style={styles.date_row}>{travelInfo.arrivingDate} 도착</Text>
          </View>
        </View>
        <View style={styles.travel_info_title_container}>
          <Text style={styles.title}>여행 일정 </Text>
          <SimpleLineIcon color={theme.MAIN_TEXT_COLOR} size={20} name="note" />
        </View>
        <View style={styles.description_container}>
          <Text style={styles.description}>{travelInfo.description}</Text>
        </View>
      </ScrollView>
    ) : (
      <View style={styles.loading_container}>
        <ActivityIndicator size="small" color={theme.MAIN_THEME_COLOR} />
      </View>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  isLogin: auth.isLogin
});

const mapDispatchToProps = dispatch => ({
  messageActions: bindActionCreators(messageActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TravelDetailScreen);

const styles = EStyleSheet.create({
  container: { alignItems: 'center', padding: '20rem' },

  loading_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20rem'
  },
  traveler_container: {
    width: '95%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: theme.MAIN_THEME_COLOR,
    borderRadius: '3rem',
    padding: '8rem',
    marginBottom: '36rem',
    marginTop: '10rem'
  },
  traveler_sub_container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  traveler_image: {
    width: '24%',
    aspectRatio: 1,
    marginRight: '12rem'
  },
  traveler_name: {
    fontSize: '23rem',
    fontWeight: '600',
    color: 'white'
  },
  travel_info_title_container: {
    width: '95%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: '5rem',
    marginBottom: '7rem'
  },
  date_info_container: {
    width: '95%',
    backgroundColor: theme.BACKGROUND_COLOR,
    borderRadius: '3rem',
    marginBottom: '30rem'
  },
  departure_date_container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '22rem',
    paddingBottom: '16rem'
  },
  arrival_date_container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '22rem',
    paddingTop: '16rem'
  },
  title: {
    fontSize: '18rem',
    fontWeight: '600',
    color: theme.MAIN_TEXT_COLOR,
    marginRight: '5rem'
  },
  date_row: {
    fontSize: '15rem',
    fontWeight: '600',
    color: theme.MAIN_TEXT_COLOR
  },
  description_container: {
    width: '95%',
    backgroundColor: theme.BACKGROUND_COLOR,
    borderRadius: '3rem',
    padding: '16rem'
  },
  description: {
    fontSize: '15rem',
    color: theme.MAIN_TEXT_COLOR
  }
});
