import React, { Component } from 'react';
import { View, Button, Text } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import theme from '../styles/theme';

export class CustomDatePicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isDateTimePickerVisible: false
    };
  }
  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = date => {
    let { updateDateFunc, setMinimumDateFunc } = this.props;

    let selectedDate = date.toLocaleDateString();
    selectedDate = selectedDate.substring(0, selectedDate.length - 1);

    updateDateFunc(selectedDate);

    if (setMinimumDateFunc) {
      setMinimumDateFunc(date);
    }
    this.hideDateTimePicker();
  };

  render() {
    const { minimumDate } = this.props;
    const { isDateTimePickerVisible } = this.state;
    return (
      <View>
        <TouchableOpacity onPress={this.showDateTimePicker}>
          <Icon name="calendar" size={20} color={theme.MAIN_THEME_COLOR} />
        </TouchableOpacity>
        <DateTimePicker
          isVisible={isDateTimePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDateTimePicker}
          minimumDate={minimumDate}
        />
      </View>
    );
  }
}

export default CustomDatePicker;
