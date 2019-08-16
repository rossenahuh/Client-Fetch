import React, { Component } from 'react';
import { SafeAreaView, Platform, View } from 'react-native';
import { WebView } from 'react-native-webview';

let userAgent =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/ 604.1.21 (KHTML, like Gecko) Version/ 12.0 Mobile/17A6278a Safari/602.1.26';
if (Platform.OS !== 'ios') {
  userAgent =
    'Mozilla/5.0 (Linux; Android 8.0.0; TA-1053 Build/OPR1.170623.026) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3368.0 Mobile Safari/537.36';
}
export default class MyInlineWeb extends Component {
  handleWebViewNavigationStateChange = async newNavState => {
    const { url } = newNavState;
    console.log(url);
    if (url.includes('server.fetcher.fun')) {
      return await this.props.onGetData(newNavState.jsEvaluationValue);
    }
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          overflow: 'hidden'
        }}
      >
        <WebView
          ref={ref => (this.webview = ref)}
          originWhitelist={['*']}
          source={this.props.source}
          userAgent={userAgent}
          style={{ marginTop: 20 }}
          onNavigationStateChange={this.handleWebViewNavigationStateChange}
          injectJavaScript={this.JSscript}
          injectedJavaScript={`(function(){if(document.querySelector("pre")){
              return document.querySelector("pre").innerHTML} return true})();`}
          // onNavigationStateChange={navEvent => {
          //   if (this.props.source.html.isUser) {
          //     this.props.toggleModal();
          //   }
          //   this.props.onGetData(this.props.source);
          // }}
        />
      </View>
    );
  }
}
