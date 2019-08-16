import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/AntDesign';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as travelsActions from '../../modules/travels';
import theme from '../../components/styles/theme';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export class MainTravelList extends Component {
  componentWillMount() {
    this.props.travelsActions.getMainTravelList(5);
  }

  render() {
    return this.props.pending ? (
      <View style={styles.container}>
        <ActivityIndicator size="small" color={theme.MAIN_THEME_COLOR} />
      </View>
    ) : this.props.error ? (
      <View>
        <Text>Error!!</Text>
      </View>
    ) : (
      <View style={styles.container}>
        <ScrollView horizontal={true}>
          {this.props.travels.map(travel => (
            <TouchableOpacity
              style={styles.travel}
              key={travel.travel_id}
              onPress={() => {
                this.props.navigation.navigate('TravelDetail', {
                  travel_id: travel.travel_id
                });
              }}
            >
              <Image
                style={styles.traveler_image}
                source={{
                  uri: `${travel.travelerImageUrl}`
                }}
              />
              <View style={styles.text_container}>
                <Text stlye={styles.text}>{travel.travelerName}</Text>
                <Text stlye={styles.text}>{travel.destination}</Text>
                <Text stlye={styles.text}>{travel.arrivingDate}</Text>
              </View>
            </TouchableOpacity>
          ))}
          <Icon.Button
            name="rightcircle"
            backgroundColor="#fff"
            color="gray"
            onPress={() => {
              this.props.navigation.navigate('Travel');
            }}
          />
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = ({ travels }) => ({
  travels: travels.travelListMain,
  error: travels.errorMain,
  pending: travels.pendingMain
});

const mapDispatchToProps = dispatch => ({
  travelsActions: bindActionCreators(travelsActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainTravelList);

const styles = EStyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  travel: {
    width: width * 0.35,
    aspectRatio: 0.85,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: '0.5rem',
    borderColor: theme.BORDER_COLOR,
    borderRadius: '3rem',
    marginRight: '8rem',
    padding: '5rem'
  },
  text_container: {
    padding: '5rem',
    display: 'flex',
    alignItems: 'center'
  },
  traveler_image: {
    width: width * 0.15,
    aspectRatio: 1,
    marginBottom: '3rem'
  },
  text: {
    color: theme.MAIN_TEXT_COLOR,
    marginBottom: '3rem'
  }
});
