import React, { Component } from 'react';
import {
  View,
  Text,
  Platform,
  StyleSheet,
  Alert,
  Dimensions
} from 'react-native';
import { Button, Avatar } from 'react-native-elements';
const { height, width } = Dimensions.get('window');
import ImagePicker from 'react-native-image-picker';
import asyncHelper from '../../helpers/asyncStorage';
import axios from 'axios';
import * as mypageActions from '../../modules/mypage';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
class ProfileManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profileUrl: undefined
    };
  }
  _handleChoosePhoto = () => {
    const options = {};
    ImagePicker.launchImageLibrary(options, response => {
      if (response.uri) {
        this.setState({
          profileUrl: response
        });
      }
    });
  };

  _handleSubmit = async propfileUrl => {
    if (!this.state.profileUrl) {
      Alert.alert('Fetch', '사진을 선택해 주세요.', [{ text: '확인' }]);
    } else {
      const data = new FormData();
      data.append('uploadedImage', {
        name: this.state.profileUrl.fileName,
        type: this.state.profileUrl.type,
        uri:
          Platform.OS === 'android'
            ? this.state.profileUrl.uri
            : this.state.profileUrl.uri.replace('file://', '')
      });
      let userToken = await asyncHelper._getData('userToken');
      axios
        .put('https://server.fetcher.fun/users/changeprofile', data, {
          headers: {
            'content-type': 'multipart/form-data',
            Authorization: `JWT ${userToken}`
          }
        })
        .then(result => {
          console.log(result);
          if (result.status === 201) {
            this.props.MypageActions.getUserInfo();
            Alert.alert('Fetch', '프로필 사진 수정이 완료되었습니다', [
              {
                text: '확인',
                onPress: () => {
                  this.props.toggleOverlay;
                }
              }
            ]);
          } else {
            Alert.alert(
              'Fetch',
              '프로필 사진 등록이 실패하였습니다. \n다시 시도해 주세요.',
              [{ text: '확인' }]
            );
          }
        });
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <Button
            title="취소"
            titleStyle={{ fontSize: 14, color: '#505050' }}
            onPress={this.props.toggleOverlay}
            type="clear"
          />
          <Button
            title="저장"
            titleStyle={{ fontSize: 14, color: '#505050' }}
            onPress={this._handleSubmit}
            type="clear"
          />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>프로필 사진 변경</Text>
        </View>
        <View style={styles.imageContainer}>
          {this.state.profileUrl ? (
            <Avatar
              rounded
              size={width * 0.3}
              source={{ uri: this.state.profileUrl.uri }}
            />
          ) : (
            <Avatar
              rounded
              size={width * 0.3}
              source={{ uri: this.props.profileUrl }}
            />
          )}
        </View>
        <View style={styles.albumButtonContainer}>
          <Button
            title="앨범에서 사진 선택"
            titleStyle={styles.albumText}
            type="outline"
            buttonStyle={styles.albumButton}
            onPress={this._handleChoosePhoto}
          />
        </View>
      </View>
    );
  }
}
//다양한 리덕스 모듈을 적용해야하는 상황에서 유리
const mapDispatchToProps = dispatch => ({
  MypageActions: bindActionCreators(mypageActions, dispatch)
});

export default connect(mapDispatchToProps)(ProfileManager);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonContainer: {
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    padding: width * 0.07,
    top: height * 0.03
  },
  titleContainer: {
    margin: width * 0.05,
    position: 'absolute',
    top: height * 0.2
  },
  title: { fontSize: 18, fontWeight: '700' },
  imageContainer: { position: 'absolute', top: height * 0.3 },
  albumButtonContainer: { position: 'absolute', top: height * 0.5 },
  albumButton: {
    borderColor: '#5bb487',
    borderRadius: 5,
    width: '100%'
  },
  albumText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#5bb487'
  }
});
