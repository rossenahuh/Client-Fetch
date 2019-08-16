import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import EStyleSheet from 'react-native-extended-stylesheet';
import AsyncStorage from '@react-native-community/async-storage';
import CountrySelector from '../../components/common/CountrySelector';
import CustomDatePicker from '../../components/common/DatePicker';
import theme from '../../components/styles/theme';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as travelsActions from '../../modules/travels';
import axios from 'axios';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export class TravelRegisterScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      destination: null,
      description: null,
      arrivingDate: null,
      departingDate: null
    };
  }

  _onRegisterButtonPress = async () => {
    let { destination, description, arrivingDate, departingDate } = this.state;

    if (!destination || !description || !arrivingDate || !departingDate) {
      Alert.alert('Fetch', '빈 칸없이 모두 입력해주세요', [{ text: '확인' }]);
    } else {
      let userToken = await AsyncStorage.getItem('userToken');

      let data = {
        minimumArrivingDate: null,
        destination: destination,
        description: description,
        arrivingDate: arrivingDate,
        departingDate: departingDate
      };

      axios
        .post('https://server.fetcher.fun/travels/create', data, {
          headers: {
            Authorization: `JWT ${userToken}`
          }
        })
        .then(result => {
          if (result.data.success) {
            Alert.alert('Fetch', '여행일정이 등록되었습니다', [
              {
                text: '확인',
                onPress: () => {
                  this.props.TravelsActions.getTravelList();
                  this.props.TravelsActions.getMainTravelList(5);
                  this.props.navigation.navigate('Travel');
                }
              }
            ]);
          } else {
            Alert.alert('Fetch', '에러발생. 잠시 후 다시 시도해주세요', [
              {
                text: '확인',
                onPress: () => {
                  this.props.navigation.navigate('Travel');
                }
              }
            ]);
          }
        });
    }
  };

  _updateDepartingDate = date => {
    this.setState({ departingDate: date });
  };

  _updateArrivingDate = date => {
    this.setState({ arrivingDate: date });
  };

  _updateDestination = selectedCountry => {
    this.setState({ destination: selectedCountry });
  };

  _updateDescription = text => {
    this.setState({ description: text });
  };

  _updateMinimumArrivingDate = dateObj => {
    this.setState({ minimumArrivingDate: dateObj });
  };

  render() {
    const { departingDate, arrivingDate, minimumArrivingDate } = this.state;
    console.log(arrivingDate);
    return (
      <View style={styles.container}>
        <View>
          <View style={styles.date_container}>
            <View style={styles.date_sub_container}>
              {departingDate ? (
                <TextInput
                  style={styles.date_input}
                  placeholder={departingDate}
                  placeholderTextColor={theme.SUB_TEXT_COLOR}
                />
              ) : (
                <TextInput
                  style={styles.date_input}
                  placeholder="출국일 선택"
                />
              )}
              <CustomDatePicker
                updateDateFunc={this._updateDepartingDate}
                setMinimumDateFunc={this._updateMinimumArrivingDate}
                minimumDate={new Date()}
              />
            </View>
            <View style={styles.date_sub_container}>
              {arrivingDate ? (
                <TextInput
                  style={styles.date_input}
                  placeholder={arrivingDate}
                  placeholderTextColor={theme.SUB_TEXT_COLOR}
                />
              ) : (
                <TextInput
                  style={styles.date_input}
                  placeholder="도착일 선택"
                />
              )}
              {minimumArrivingDate ? (
                <CustomDatePicker
                  updateDateFunc={this._updateArrivingDate}
                  minimumDate={minimumArrivingDate}
                />
              ) : (
                <CustomDatePicker
                  updateDateFunc={this._updateArrivingDate}
                  minimumDate={new Date()}
                />
              )}
            </View>
          </View>
        </View>
        <View>
          <CountrySelector getCountryValue={this._updateDestination} />
        </View>
        <View style={styles.travel_info_title_container}>
          <Text style={styles.title}>여행 일정 </Text>
          <SimpleLineIcon color={theme.MAIN_TEXT_COLOR} size={20} name="note" />
        </View>

        <View style={styles.description_container}>
          <TextInput
            multiline={true}
            style={styles.description_input}
            onChangeText={this._updateDescription}
          />
        </View>
        <View style={styles.button_container}>
          <TouchableOpacity
            style={styles.register_button}
            onPress={this._onRegisterButtonPress}
          >
            <Text style={styles.button_text}>여행일정 등록</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  TravelsActions: bindActionCreators(travelsActions, dispatch)
});

export default connect(
  null,
  mapDispatchToProps
)(TravelRegisterScreen);

const styles = EStyleSheet.create({
  container: {
    marginTop: '20rem',
    padding: '22rem',
    alignItems: 'center'
  },

  date_container: {
    width: width * 0.85,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: '10rem'
  },
  date_sub_container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  date_input: {
    width: '50%',
    height: '28rem',
    borderBottomColor: theme.BORDER_COLOR,
    borderBottomWidth: '0.5rem',
    marginRight: '8rem',
    paddingLeft: '3rem'
  },
  travel_info_title_container: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: '5rem',
    marginTop: '26rem',
    marginBottom: '10rem'
  },
  title: {
    fontSize: '16rem',
    fontWeight: '600',
    color: theme.MAIN_TEXT_COLOR,
    marginRight: '5rem'
  },
  description_container: {
    marginBottom: '32rem',
    maxHeight: '150rem'
  },
  description_input: {
    width: width * 0.8,
    height: '150rem',
    color: theme.SUB_TEXT_COLOR,
    borderColor: theme.BORDER_COLOR,
    borderWidth: '0.5rem',
    borderRadius: '3rem',
    padding: '10rem'
  },
  button_container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  register_button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.35,
    height: height * 0.045,
    backgroundColor: theme.MAIN_THEME_COLOR,
    borderRadius: 50,
    marginRight: '20rem'
  },
  button_text: {
    fontSize: '15rem',
    fontWeight: '600',
    color: 'white'
  }
});
