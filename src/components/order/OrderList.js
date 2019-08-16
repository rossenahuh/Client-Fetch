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
import * as ordersActions from '../../modules/orders';
import CountrySelector from '../common/CountrySelector';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export class OrderList extends Component {
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

  _keyExtractor = (item, index) => item.order_id.toString();

  componentWillMount() {
    this.props.OrdersActions.getOrderList();
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
          keyExtractor={this._keyExtractor}
          data={
            selectedCountry === '' || selectedCountry === '전체보기'
              ? this.props.orders
              : this.props.orders.filter(order => {
                  return order.destination === selectedCountry;
                })
          }
          numColumns={2}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.order}
              key={item.order_id}
              onPress={() => {
                this.props.navigation.navigate('OrderDetail', {
                  order_id: item.order_id
                });
              }}
            >
              <Image
                style={styles.productImage}
                source={{
                  uri: `${item.imageUrl}`
                }}
              />
              <View style={styles.text_container}>
                <Text style={styles.text}>{item.productName}</Text>
                <Text style={styles.text}>{item.destination}</Text>
                <Text style={styles.price}>₩ {item.price}</Text>
                <Text style={styles.due}>거래일은 {item.due}일 이후 예정</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ orders }) => ({
  orders: orders.orderList,
  pending: orders.pending,
  error: orders.error
});

//다양한 리덕스 모듈을 적용해야하는 상황에서 유리
const mapDispatchToProps = dispatch => ({
  OrdersActions: bindActionCreators(ordersActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderList);

const styles = EStyleSheet.create({
  container: {
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
  order: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '4rem'
  },
  productImage: {
    width: width * 0.45,
    aspectRatio: 1
  },
  text_container: {
    padding: '10rem'
  },
  text: {
    color: theme.MAIN_TEXT_COLOR,
    marginBottom: '2rem'
  },
  price: {
    color: theme.MAIN_TEXT_COLOR,
    fontWeight: '600',
    marginBottom: '3rem'
  },
  due: {
    fontSize: '10rem',
    color: theme.SUB_TEXT_COLOR
  }
});
