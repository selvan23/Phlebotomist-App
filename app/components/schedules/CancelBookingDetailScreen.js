import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  TextInput,
} from 'react-native';
import Utility from '../../util/Utility';
import Constants from '../../util/Constants';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import ButtonBack from '../common/ButtonBack';
import UserDetails from '../common/UserDetails';
import TestListView from '../common/TestListView';
import {getCancelBookingDetail} from '../../actions/CancelBookingDetailAction';
import LoadingScreen from '../common/LoadingScreen';
import { nativationPop, navigationRef } from '../../rootNavigation';

const deviceWidth = Dimensions.get('window').width;

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;

function isEmpty(arg) {
  for (var item in arg) {
    return false;
  }
  return true;
}
let currentScene = 'cancelBookingDetail';

class cancelBookingDetail extends Component {
  static propTypes = {
    isCancelDetailLoading: PropTypes.bool,
    cancelBookingDetail: PropTypes.object,
    getCancelBookingDetail: PropTypes.func,
  };

  constructor(props) {
    super(props);
    const rowData = this.props.route.params.rowData;
    this.state = {
      textInput: '',
      firmNo: rowData.Firm_No,
      bookingNo: rowData.Booking_No,
      collectorCode: rowData.Collector_Code,
      bookingDate: rowData.Booking_Date,
      bookingType: rowData.Booking_Type,
    };
  }
  componentDidMount() {
    let dictInfo = {
      Firm_No: this.state.firmNo,
      Booking_No: this.state.bookingNo,
      Collector_Code: this.state.collectorCode,
      Booking_Date: this.state.bookingDate,
      Booking_Type: this.state.bookingType,
    };
    this.props.getCancelBookingDetail(dictInfo, (isSuccess) => {
      if (isSuccess === true) console.log('getCancelBookingDetail');
    });
  }
  render() {
    if (this.props.isCancelDetailLoading) {
      return this._screenLoading();
    } else {
      if (
        this.props.cancelBookingDetail !== undefined &&
        !isEmpty(this.props.cancelBookingDetail)
      ) {
        return this._renderBodyView();
      } else {
        return this._renderNoDataView();
      }
    }
  }
  _renderNoDataView = () => {
    return (
      <View style={styles.noDataMainView}>
        <View style={styles.noDataSubView}>
          <Text style={{padding: 20}}>No Data Found!</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            // if (Actions.currentScene === currentScene) {
            if (navigationRef.getCurrentRoute().name === currentScene) {
              // Actions.pop();
              nativationPop();
            }
          }}
          style={styles.backBtn}>
          <ButtonBack />
        </TouchableOpacity>
      </View>
    );
  };
  _screenLoading = () => {
    return (
      <View style={styles.loadingScreenView}>
        <LoadingScreen />
      </View>
    );
  };

  _renderBodyView = () => {
    return (
      <View style={styles.mainView}>
        <KeyboardAwareScrollView>
          {this._renderUserDetails()}
          {this._renderServiceTest()}
          {this._renderBookingCancel()}
          {this._postFeedBack()}
          {/* {this._renderBackButton()} */}
        </KeyboardAwareScrollView>
      </View>
    );
  };
  _renderUserDetails = () => {
    return (
      <View style={styles.userDetailView}>
        <UserDetails
          arrUserDetails={this.props.cancelBookingDetail}
          isShowPDF={false}
          isShowCashStatus={false}
        />
      </View>
    );
  };
  _renderServiceTest = () => {
    return (
      <View style={styles.serviceTestView}>
        <TestListView bookingDetail={this.props.cancelBookingDetail} />
      </View>
    );
  };

  _renderBookingCancel = () => {
    if (
      this.props.cancelBookingDetail.Booking_Status_Desc !== undefined &&
      this.props.cancelBookingDetail.Booking_Status_Desc !== null &&
      this.props.cancelBookingDetail.Booking_Status_Desc !== ''
    ) {
      return (
        <View style={styles.bookingCancelView}>
          <Text style={styles.cancelBookingText}>
            {this.props.cancelBookingDetail.Booking_Status_Desc}
          </Text>
        </View>
      );
    } else {
      return null;
    }
  };

  _postFeedBack = () => {
    return (
      <View style={styles.postReviewView}>
        <Text style={styles.headingPostText}>Reason for cancellation</Text>
        <View style={styles.commentMainView}>
          <Text style={styles.commentTextView}>
            {this.props.cancelBookingDetail.Cancel_Reason}
          </Text>
        </View>
      </View>
    );
  };
  _renderBackButton = () => {
    return (
      <TouchableOpacity
        style={styles.backButtonView}
        onPress={() => {
          // if (Actions.currentScene === currentScene) {
          if (navigationRef.getCurrentRoute().name === currentScene) {
            // Actions.pop();
            nativationPop();
          }
        }}>
        <ButtonBack />
      </TouchableOpacity>
    );
  };
}
const mapStateToProps = (state, props) => {
  //props can be called as ownProps
  const {
    cancelBookingDetailState: {cancelBookingDetail, isCancelDetailLoading},
  } = state;
  return {
    cancelBookingDetail,
    isCancelDetailLoading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getCancelBookingDetail,
    },
    dispatch,
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(cancelBookingDetail);

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: 'white',
  },
  serviceTestView: {
    marginHorizontal: 5,
    marginTop: 0,
  },
  headingPostText: {
    marginLeft: 10,
    color: 'black',
    fontSize: Constants.FONT_SIZE.M,
    fontWeight: 'bold',
  },
  commentMainView: {
    flexDirection: 'row',
    // marginTop: 10,
    borderRadius: 10,
  },
  commentTextView: {
    padding: 10,
    marginHorizontal: 0,
    fontSize: Constants.FONT_SIZE.M,
    color: Constants.COLOR.FONT_COLOR,
  },
  backButtonView: {
    alignSelf: 'flex-start',
    marginStart: 10,
    marginTop: 20,
    marginBottom: 30,
  },
  noDataMainView: {
    flex: 1,
    backgroundColor: 'white',
  },
  noDataSubView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: 10,
    marginLeft: 10,
  },
  bookingCancelView: {
    backgroundColor: '#F35D6C',
    alignSelf: 'center',
    padding: 10,
    borderRadius: 10,
  },
  cancelBookingText: {
    color: 'white',
    paddingHorizontal: 10,
  },
  userDetailView: {
    margin: 10,
    marginBottom: 0,
  },
  loadingScreenView: {
    flex: 1,
    backgroundColor: 'white',
  },
  postReviewView: {
    marginHorizontal: 10,
    marginTop: 10,
  },
});
