'use strict';
import React, {Component} from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  FlatList,
  Linking,
  Modal,
  Platform,
} from 'react-native';
import PostFeedBack from './postFeedBack';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {SafeAreaView} from 'react-native-safe-area-context';
import Utility from '../../util/Utility';
import Constants from '../../util/Constants';
import PropTypes from 'prop-types';
import { nativationPop } from '../../rootNavigation';
import moment from 'moment';
const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export default class CancelBookingView extends Component {
  static propTypes = {
    arrBookingDetail: PropTypes.object,
    isFromCancel: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      showModal: true,
      cancelBtnClicked: this.props.route.params.isFromCancel,
      btnCloseImage: false,
    };
  }

  render() {
    return this._renderModal();
  }

  _loadBookinLists() {
    let postData = {
      Collector_Code: this.state.collectorCode,
      Filter_Type: this.state.filter_Type,
      Schedule_Date: this.props.isCalenderDateSelected
        ? this.props.pendingDate
        : moment().utcOffset("+05:30").format("YYYY/MM/DD"),
    };
  }

  _renderModal = () => {
    return (
      <SafeAreaView style={styles.mainView}>
        <Modal transparent={false} visible={true} animationType={'slide'}>
          <View style={styles.mainModalView}>
            <KeyboardAwareScrollView>
              <View style={{margin: 10}}>
                <TouchableOpacity
                  style={styles.btnCloseImage}
                  disabled={this.state.btnCloseImage}
                  onPress={() => {
                    this.setState({
                      btnCloseImage: true,
                    });
                    // Actions.pop();
                     this.props.navigation.goBack();
                    setTimeout(() => {
                      this.setState({
                        btnCloseImage: false,
                      });
                    }, 1000);
                  }}>
                  <Image
                    source={require('../../images/close_white.png')}
                    style={styles.closeImage}
                  />
                </TouchableOpacity>
                <PostFeedBack
                  cancelBtnClicked={this.state.cancelBtnClicked}
                  arrpostMessage={this.props.route.params.arrBookingDetail}
                  goBack={()=>{
                    this.props.route.params.cancelBookingStatusSuccess(true)
                    this.props.navigation.navigate('homeTabBar', {
                      screen: 'Schedules'
                    });
                  }}
                />
              </View>
            </KeyboardAwareScrollView>
          </View>
        </Modal>
      </SafeAreaView>
    );
  };
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  mainModalView: {
    flex: 1,
    backgroundColor: 'white',
  },
  closeImage: {
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    width: deviceHeight / 30,
    height: deviceHeight / 30,
    alignSelf: 'flex-end',
    marginRight: 5,
    tintColor: 'black',
  },
  modalHeaderText: {
    textAlign: 'left',
    marginTop: 20,
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 10,
    color: '#858484',
    marginHorizontal: 10,
  },
  btnCloseImage: {
    marginTop: 10,
    alignSelf: 'flex-end',
    backgroundColor: 'white',
  },
});
