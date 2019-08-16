import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import theme from '../../components/styles/theme';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as travelActions from '../../modules/travels';
import CountrySelector from '../common/CountrySelector';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export class TravelList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCountry: ''
    };
  }

  _getCountryValue = value => {
    this.setState({
      selectedCountry: value
    });
  };

  _keyExtractor = (item, index) => item.travel_id.toString();

  componentWillMount() {
    this.props.travelActions.getTravelList();
  }

  render() {
    const { selectedCountry } = this.state;
    return this.props.pending ? (
      <View style={styles.container}>
        <ActivityIndicator size="small" color={theme.MAIN_THEME_COLOR} />
      </View>
    ) : this.props.error ? (
      <View style={styles.container}>
        <Text>Error!!</Text>
      </View>
    ) : (
      <View style={styles.container}>
        <CountrySelector getCountryValue={this._getCountryValue} />
        <FlatList
          columnWrapperStyle={styles.travellist}
          keyExtractor={this._keyExtractor}
          data={
            selectedCountry === '' || selectedCountry === '전체보기'
              ? this.props.travels
              : this.props.travels.filter(travel => {
                  return travel.destination === selectedCountry;
                })
          }
          numColumns={2}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.travel}
              key={item.travel_id}
              onPress={() => {
                this.props.navigation.navigate('TravelDetail', {
                  travel_id: item.travel_id
                });
              }}
            >
              <Image
                style={styles.productImage}
                source={{
                  uri: `${item.travelerImageUrl}`
                }}
              />
              <View style={styles.text_container}>
                <Text style={styles.text}>{item.travelerName}</Text>
                <Text style={styles.text}>{item.destination}</Text>
                <Text style={styles.due}>{item.arrivingDate} 도착예정</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ travels }) => ({
  travels: travels.travelList,
  pending: travels.pending,
  error: travels.error
});

const mapDispatchToProps = dispatch => ({
  travelActions: bindActionCreators(travelActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TravelList);

const styles = EStyleSheet.create({
  container: {
    width: width * 0.95,
    height: height * 0.75,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.04,
    marginBottom: '20rem'
  },
  dropdown: {
    width: width / 3,
    height: height / 10
  },
  travellist: {
    width: width * 0.95,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  travel: {
    width: '43%',
    display: 'flex',
    alignItems: 'center',
    margin: '5.5rem',
    borderColor: theme.BORDER_COLOR,
    borderWidth: '0.5rem',
    borderRadius: '3rem',
    padding: '14rem'
  },
  productImage: {
    width: width * 0.25,
    aspectRatio: 1,
    marginBottom: '10rem'
  },
  text: {
    color: theme.MAIN_TEXT_COLOR,
    marginBottom: '4rem'
  },
  due: {
    fontSize: '11rem',
    color: theme.SUB_TEXT_COLOR
  }
});
