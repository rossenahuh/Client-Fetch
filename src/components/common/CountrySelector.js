import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Dropdown } from 'react-native-material-dropdown';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const countries = {
  전체보기: [{ value: '전체보기' }],
  아시아: [
    {
      value: '한국'
    },
    {
      value: '일본'
    },
    {
      value: '중국'
    },
    {
      value: '베트남'
    },
    {
      value: '태국'
    },
    {
      value: '러시아'
    }
  ],
  유럽: [
    {
      value: '영국'
    },
    {
      value: '프랑스'
    },
    {
      value: '독일'
    },
    {
      value: '스페인'
    },
    {
      value: '스위스'
    },
    {
      value: '체코'
    }
  ],
  북미: [
    {
      value: '미국'
    },
    {
      value: '캐나다'
    }
  ],
  남미: [
    {
      value: '브라질'
    }
  ],
  호주: [
    {
      value: '호주'
    }
  ]
};

const continents = [
  {
    value: '전체보기'
  },
  {
    value: '아시아'
  },
  {
    value: '유럽'
  },
  {
    value: '북미'
  },
  {
    value: '남미'
  },
  {
    value: '호주'
  }
];

class CountrySelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedContinent: ''
    };
  }

  render() {
    const { selectedContinent } = this.state;

    return (
      <View style={styles.pickerContainer}>
        <Dropdown
          containerStyle={styles.dropdown}
          label="대륙선택"
          onChangeText={value =>
            this.setState({
              selectedContinent: value
            })
          }
          data={continents}
        />
        {selectedContinent === '' ? (
          <Dropdown label="국가선택" containerStyle={styles.dropdown} />
        ) : (
          <Dropdown
            containerStyle={styles.dropdown}
            label="국가선택"
            onChangeText={this.props.getCountryValue}
            data={countries[selectedContinent]}
          />
        )}
      </View>
    );
  }
}

export default CountrySelector;

const styles = EStyleSheet.create({
  pickerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: width * 0.8,
    marginBottom: '28rem'
  },
  dropdown: {
    width: width / 3,
    height: height * 0.1
  }
});
