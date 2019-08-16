import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
const { height, width } = Dimensions.get('window');

export default class SignUpDetailScreen extends Component {
  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.heading}>개인정보 처리방침 및 이용 약관</Text>
          <Text style={styles.body}>
            (fetch)는 개인정보 보호법 제30조에 따라 정보주체의 개인정보를
            보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기
            위하여 다음과 같이 개인정보 처리지침을 수립,공개합니다.
          </Text>
          <Text style={styles.subTitle}>1.개인정보의 처리 목적</Text>
          <Text style={styles.body}>
            (‘fetcher.fun’이하 ‘fetch’) 은(는) 다음의 목적을 위하여 개인정보를
            처리하고 있으며, 다음의 목적 이외의 용도로는 이용하지 않습니다.
          </Text>
          <Text style={styles.detail}>
            - 고객 가입의사 확인, 고객에 대한 서비스 제공에 따른 본인 식별.인증,
            회원자격 유지.관리, 물품 또는 서비스 공급에 따른 금액 결제, 물품
            또는 서비스의 공급.배송 등
          </Text>
          <Text style={styles.subTitle}>2. 개인정보의 처리 및 보유 기간</Text>
          <Text style={styles.body}>
            ① (‘fetcher.fun’이하 ‘fetch’) 은(는) 정보주체로부터 개인정보를
            수집할 때 동의 받은 개인정보 보유․이용기간 또는 법령에 따른 개인정보
            보유․이용기간 내에서 개인정보를 처리․보유합니다.{'\n'} ② 구체적인
            개인정보 처리 및 보유 기간은 다음과 같습니다.
          </Text>
          <Text style={styles.detail}>
            - 고객 가입 및 관리 : 서비스 이용계약 또는 회원가입 해지시까지, 다만
            채권․채무관계 잔존시에는 해당 채권․채무관계 정산시까지 {'\n'}-
            전자상거래에서의 계약․청약철회, 대금결제, 재화 등 공급기록 : 5년 
          </Text>
          <Text style={styles.subTitle}>
            3. 개인정보의 제3자 제공에 관한 사항
          </Text>
          <Text style={styles.body}>
            ① ('fetcher.fun'이하 'fetch')은(는) 정보주체의 동의, 법률의 특별한
            규정 등 개인정보 보호법 제17조 및 제18조에 해당하는 경우에만
            개인정보를 제3자에게 제공합니다.{'\n'} ② ('fetcher.fun')은(는)
            사용자가 서비스 이용과정 등에서 따로 동의하는 경우나 법령에 규정된
            경우를 제외하고는 사용자 개인정보를 위에서 말씀 드린 목적 범위를
            초과하여 이용하거나 제3자에게 제공 또는 공유하지 않습니다.
          </Text>
          <Text style={styles.subTitle}>
            4. 정보주체와 법정대리인의 권리·의무 및 그 행사방법 이용자는
            개인정보주체로써 다음과 같은 권리를 행사할 수 있습니다.
          </Text>
          <Text style={styles.body}>
            ① 정보주체는 fetch(‘fetcher.fun’이하 ‘fetch) 에 대해 언제든지 다음
            각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.
          </Text>
          <Text style={styles.detail}>
            1. 개인정보 열람요구 2. 오류 등이 있을 경우 정정 요구 3. 삭제요구 4.
            처리정지 요구
          </Text>
          <Text style={styles.subTitle}>5. 처리하는 개인정보의 항목 작성 </Text>
          <Text style={styles.body}>
            ① ('fetcher.fun'이하 'fetch')은(는) 다음의 개인정보 항목을 처리하고
            있습니다.
          </Text>
          <Text style={styles.detail}>
            - (개인정보 처리업무) 필수항목 : 이메일, 비밀번호, 로그인ID, 이름 
          </Text>
          <Text style={styles.subTitle}>
            6. 개인정보의 파기('fetch')은(는) 원칙적으로 개인정보 처리목적이
            달성된 경우에는 지체없이 해당 개인정보를 파기합니다. 파기의 절차,
            기한 및 방법은 다음과 같습니다. 
          </Text>
          <Text style={styles.body}>
            - 파기절차이용자가 입력한 정보는 목적 달성 후 별도의 DB에
            옮겨져(종이의 경우 별도의 서류) 내부 방침 및 기타 관련 법령에 따라
            일정기간 저장된 후 혹은 즉시 파기됩니다. 이 때, DB로 옮겨진
            개인정보는 법률에 의한 경우가 아니고서는 다른 목적으로 이용되지
            않습니다.{'\n'} - 파기기한이용자의 개인정보는 개인정보의 보유기간이
            경과된 경우에는 보유기간의 종료일로부터 5일 이내에, 개인정보의 처리
            목적 달성, 해당 서비스의 폐지, 사업의 종료 등 그 개인정보가
            불필요하게 되었을 때에는 개인정보의 처리가 불필요한 것으로 인정되는
            날로부터 5일 이내에 그 개인정보를 파기합니다.
          </Text>
          <Text style={styles.subTitle}>
            7. 개인정보 자동 수집 장치의 설치•운영 및 거부에 관한 사항
          </Text>
          <Text style={styles.body}>
            fetch 은 정보주체의 이용정보를 저장하고 수시로 불러오는 ‘쿠키’를
            사용하지 않습니다.
          </Text>
          <Text style={styles.subTitle}>8. 개인정보 보호책임자 </Text>
          <Text style={styles.body}>
            ① fetch(‘fetcher.fun’이하 ‘fetch) 은(는) 개인정보 처리에 관한 업무를
            총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및
            피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고
            있습니다.
          </Text>
          <Text style={styles.detail}>
            - 개인정보 보호책임자{'\n'} (zerodegree.kr@gmail.com)
          </Text>
          <Text style={styles.body}>
            ② 정보주체께서는 fetch(‘fetcher.fun’이하 ‘fetch) 의 서비스(또는
            사업)을 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리,
            피해구제 등에 관한 사항을 개인정보 보호책임자로 문의하실 수
            있습니다. fetch(‘fetcher.fun’이하 ‘fetch) 은(는) 정보주체의 문의에
            대해 지체 없이 답변 및 처리해드릴 것입니다.
          </Text>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: width,
    paddingLeft: width * 0.1,
    paddingRight: width * 0.1,
    paddingTop: 40,
    paddingBottom: 30,
    flex: 1,
    // alignItems: 'center',
    backgroundColor: '#fff',
    alignItems: 'stretch'
  },
  heading: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 30,
    textAlign: 'center'
  },
  subTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'left'
  },
  body: {
    lineHeight: 18
  },
  detail: {
    paddingLeft: 10,
    lineHeight: 18
  }
});
