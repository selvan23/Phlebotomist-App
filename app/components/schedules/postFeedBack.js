'use strict';
import React, {Component} from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  Keyboard,
} from 'react-native';
import {
  DenyBookingPostMessage,
  cancelBookingPostMessage,
} from '../../actions/DenyCancelPostAction';

import Utility from '../../util/Utility';
import Constants from '../../util/Constants';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Loading from '../common/LoadingScreen';
import LoadingScreen from '../common/LoadingScreen';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import { nativationPop } from '../../rootNavigation';
const deviceWidth = Dimensions.get('window').width;

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;
class PostFeedBack extends Component {
  static PropTypes = {
    collectorCode: PropTypes.string,
    DenyBookingPostMessage: PropTypes.func,
    cancelBookingPostMessage: PropTypes.func,
    arrpostMessage: PropTypes.object,
  };
  constructor() {
    super();
    this.state = {
      textInput: '',
      btnNoDisable: false,
      btnYesDisable: false,
    };
  }

  render() {
    if (this.props.ispostMessageLoading.ispostMessageLoading) {
      return this._screenLoading();
    } else {
      return this._renderScreen();
    }
  }

  _screenLoading = () => {
    return <LoadingScreen />;
  };

  _renderPostMessage = () => {
    if (this.props.cancelBtnClicked) {
      if (this.state.textInput.trim() === '') {
        Utility.showAlert(
          Constants.ALERT.TITLE.ERROR,
          Constants.VALIDATION_MSG.ADD_POST_MESSAGE,
        );
      } else {
        let dictInfo = {
          Action_Type: 'X',
          Firm_No: this.props.arrpostMessage.Firm_No,
          Booking_Date: this.props.arrpostMessage.Booking_Date,
          Booking_No: this.props.arrpostMessage.Booking_No,
          Collector_Code: this.props.collectorCode.collectorCode,
          Reason: this.state.textInput,
        };
        this.props.cancelBookingPostMessage(dictInfo, (isSuccess, message) => {
          if (isSuccess) {
            this._successHandler(message);
          }
        });
      }
    } else {
      if (this.state.textInput.trim() === '') {
        Utility.showAlert(
          Constants.ALERT.TITLE.ERROR,
          Constants.VALIDATION_MSG.ADD_POST_MESSAGE,
        );
      } else {
        let dictInfo = {
          Action_Type: 'D',
          Firm_No: this.props.arrpostMessage.Firm_No,
          Booking_Date: this.props.arrpostMessage.Booking_Date,
          Booking_No: this.props.arrpostMessage.Booking_No,
          Collector_Code: this.props.collectorCode.collectorCode,
          Reason: this.state.textInput,
        };
        this.props.DenyBookingPostMessage(dictInfo, (isSuccess, message) => {
          if (isSuccess) {
            this._successHandler(message);
          }
        });
      }
    }
  };

  _successHandler = (message) => {
    Alert.alert(
      'Success',
      message,
      [{text: 'OK', onPress: () => this._closePreviousScreenAlso()}],
      {cancelable: false},
    );
  };

  _renderYesBtnView = () => {
    return (
      <TouchableOpacity
        disabled={this.state.btnYesDisable}
        onPress={() => {
          this.setState({
            btnYesDisable: true,
          });
          this._renderPostMessage();
          setTimeout(() => {
            this.setState({
              btnYesDisable: false,
            });
          }, 1000);
        }}>
        <Text style={styles.yesBtnView}>YES</Text>
      </TouchableOpacity>
    );
  };

  _renderNoBtnView = () => {
    return (
      <TouchableOpacity
        disabled={this.state.btnNoDisable}
        onPress={() => {
          this.setState({
            btnNoDisable: true,
          });
          // Actions.pop();
          nativationPop();
          setTimeout(() => {
            this.setState({
              btnNoDisable: false,
            });
          }, 1000);
        }}>
        <Text style={styles.noBtnView}>NO</Text>
      </TouchableOpacity>
    );
  };

  _closePreviousScreenAlso = () => {
    this.props.goBack()
  };

  _renderScreen = () => {
    return (
      <KeyboardAwareScrollView>
        <View style={styles.mainView}>
          <Text style={styles.modalHeaderText}>
            {this.props.cancelBtnClicked === true
              ? 'Are you sure want to cancel?'
              : 'Are you sure want to Deny the booking?'}
          </Text>
          <Text style={styles.headingText}>Please Enter the Reason </Text>
          <View style={styles.commentMainView}>
            <TextInput
              style={styles.commentTextView}
              multiline={true}
              onChangeText={(username) => this.setState({textInput: username})}
              placeholder="Post your reason..."
              placeholderTextColor="#696969"
              maxLength={500}
              textAlignVertical={'top'}
              value={this.state.textInput}
            />
          </View>
          {this._renderYesBtnView()}
          {this._renderNoBtnView()}
        </View>
      </KeyboardAwareScrollView>
    );
  };
}

const mapStateToProps = (state, props) => {
  const {
    denyCancelBookingPendingState: ispostMessageLoading,
    configState: collectorCode,
  } = state;

  return {
    ispostMessageLoading,
    collectorCode,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      DenyBookingPostMessage,
      cancelBookingPostMessage,
    },
    dispatch,
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(PostFeedBack);

const styles = StyleSheet.create({
  mainView: {
    // backgroundColor: '#F5F5F5',
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  modalHeaderText: {
    textAlign: 'left',
    fontSize: Constants.FONT_SIZE.XXL,
    marginBottom: 10,
    color: '#696969',
    marginHorizontal: 0,
    marginLeft: 5,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_SEMI_BOLD
  },
  headingText: {
    marginTop: 10,
    marginLeft: 5,
    color: 'black',
    fontSize: Constants.FONT_SIZE.L,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_SEMI_BOLD
  },
  commentMainView: {
    flexDirection: 'row',
    marginTop: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentTextView: {
    backgroundColor: Constants.COLOR.LIGHT_GREY,
    flex: 0.999,
    padding: 10,
    fontSize: Constants.FONT_SIZE.M,
    borderRadius: 10,
    height: deviceHeight / 4,
    color:"black",
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR
  },
  yesBtnView: {
    marginTop: 20,
    padding: deviceWidth / 35,
    textAlign: 'center',
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    color: 'white',
    // fontWeight: 'bold',
    backgroundColor: Constants.COLOR.PRIMARY_COLOR,
    borderColor: Constants.COLOR.PRIMARY_COLOR,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_SEMI_BOLD
  },
  noBtnView: {
    marginTop: 20,
    padding: deviceWidth / 35,
    textAlign: 'center',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 2,
    overflow: 'hidden',
    color: Constants.COLOR.PRIMARY_COLOR,
    fontWeight: 'bold',
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    borderColor: Constants.COLOR.PRIMARY_COLOR,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_SEMI_BOLD
  },
});
