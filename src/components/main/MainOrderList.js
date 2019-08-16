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
import * as ordersActions from '../../modules/orders';
import theme from '../../components/styles/theme';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export class MainOrderList extends Component {
  componentWillMount() {
    this.props.OrdersActions.getMainOrderList(5);
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
          {this.props.orders.map(order => (
            <TouchableOpacity
              style={styles.order}
              key={order.order_id}
              onPress={() => {
                this.props.navigation.navigate('OrderDetail', {
                  order_id: order.order_id
                });
              }}
            >
              <Image
                style={styles.product_image}
                source={{
                  uri: `${order.imageUrl}`
                }}
              />
              <View style={styles.text_container}>
                <Text style={styles.text}>{order.productName}</Text>
                <Text style={styles.text}>{order.destination}</Text>
                <Text style={styles.price}>₩ {order.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
          <Icon.Button
            name="rightcircle"
            backgroundColor="#fff"
            color="gray"
            onPress={() => {
              this.props.navigation.navigate('Order');
            }}
          />
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = ({ orders }) => ({
  orders: orders.orderListMain,
  error: orders.errorMain,
  pending: orders.pendingMain
});

const mapDispatchToProps = dispatch => ({
  OrdersActions: bindActionCreators(ordersActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainOrderList);

const styles = EStyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  order: {
    marginRight: '8rem'
  },
  text_container: {
    padding: '5rem'
  },
  product_image: {
    width: width * 0.4,
    aspectRatio: 6 / 5,
    marginBottom: '3rem'
  },
  text: {
    color: theme.MAIN_TEXT_COLOR,
    marginBottom: '1.5rem'
  },
  price: {
    color: theme.MAIN_TEXT_COLOR,
    fontWeight: '600'
  }
});
