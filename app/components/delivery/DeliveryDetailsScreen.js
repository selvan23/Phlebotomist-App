/*************************************************
 * SukraasLIS - Phlebotomist
 * DeliveryDetailsScreen.js
 * Created by Abdul on 16/07/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

import React, { Component } from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import Utility from '../../util/Utility';
import CustomAlert from '../common/CustomAlert';
import Constants from '../../util/Constants';
import ButtonBack from '../common/ButtonBack';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  getDeliveryDetails,
  updateDeliveryDetails,
} from '../../actions/DeliveryDetailActions';
import UserDetail from '../common/UserDetails';
import LoadingScreen from '../common/LoadingScreen';
import CheckBox from '@react-native-community/checkbox';
const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;

const deviceWidth = Dimensions.get('window').width;
import moment from 'moment';
import { IconOutline } from '@ant-design/icons-react-native';


class DeliveryDetailsScreen extends Component {
  static propTypes = {
    getDeliveryDetails: PropTypes.func,
    updateDeliveryDetails: PropTypes.func,
    isDeliveryDetailScreenLoading: PropTypes.bool,
    deliveryData: PropTypes.object,
    collectorCode: PropTypes.string,
    deliveryDetail: PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = {
      barCodeData: [],
      isSpecimanCheckBox: false,
    };
  }
  componentDidMount() {
    const deliveryDetail = this.props.route.params.deliveryDetail;
    let postValue = {
      Booking_Type: deliveryDetail.Booking_Type,
      Firm_No: deliveryDetail.Firm_No,
      Collector_Code: this.props.collectorCode,
      Booking_Date: deliveryDetail.Booking_Date,
      Booking_No: deliveryDetail.Booking_No,
    };
    this.props.getDeliveryDetails(postValue, (isSuccess) => {
      if (isSuccess) {
        let test = this.props.deliveryData.Barcode_Detail;
        const newFile = test.map((test) => {
          return { ...test, isCheckBoxStatus: false, isShowTestList: false };
        });
        this.setState({
          barCodeData: newFile,
        });
      }
    });
  }

  render() {
    return (
      <>
        {this._renderScreens()}
        <CustomAlert
          visible={!!this.props.customAlert}
          title={this.props.customAlert?.title}
          message={this.props.customAlert?.message}
          onClose={() => this.props.dispatch({ type: Constants.ACTIONS.HIDE_CUSTOM_ALERT })}
        />
      </>
    );
  }

  _renderScreens = () => {
    if (this.props.isDeliveryDetailScreenLoading) {
      return this._screenLoading();
    } else {
      return this._renderBodyView();
    }
  };

  _screenLoading = () => {
    return <LoadingScreen />;
  };

  _renderBodyView = () => {
    return (
      <View style={styles.mainContainer}>
        <KeyboardAwareScrollView>
          <View style={{ marginHorizontal: 15, marginTop: 15, marginBottom: 60 }}>
            {this._renderNameAddressView()}
            {this._renderDeliveryDetailsView()}
            {this._renderDeliveryDetailsListView()}
            {this._renderSubmitButtonView()}
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  };

  _renderNameAddressView = () => {
    if (this.props.deliveryData.Firm_No !== undefined) {
      return (
        <View>
          <UserDetail
            arrUserDetails={this.props.deliveryData}
            isShowPDF={false}
            isShowCashStatus={false}
          />
        </View>
      );
    }
  };

  _renderDeliveryDetailsView = () => {
    return (
      <View>
        <View style={styles.deliveryDetailsIdView}>
          <View style={styles.deliveryDetailsIdLeftView}>
            <Text style={[styles.deliveryIdText, { marginTop: 5 }]}>Details</Text>
          </View>
          <View style={styles.deliveryDetailsIdRightView}>
            <Text style={styles.deliveryViewLink}></Text>
          </View>
        </View>
        <View style={styles.deliveryMainView}>
          <View style={styles.deliverySubViewOne}>
            <View style={styles.rowDirectionView}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  paddingTop: 10,
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../../images/booking_id_img.png')}
                  style={[styles.imageStyle, { marginTop: 3 }]}
                />
                <Text style={[styles.deliverTextStyle, { marginLeft: 5 }]}>
                  {this.props.deliveryData.Booking_No}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  paddingRight: 15,
                  paddingTop: 10,
                }}>
                <Image
                  source={require('../../images/sample_id_img.png')}
                  style={[styles.imageStyle, { marginTop: 3 }]}
                />
                <Text style={[styles.deliverTextStyle, { marginLeft: 5 }]}>
                  {this.props.deliveryData.SID_No}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  paddingRight: 15,
                  paddingTop: 10,
                }}>
                <Text style={[styles.deliverTextStyle, { fontWeight: 'bold' }]}>
                  {moment(this.props.deliveryData.Booking_Date, 'YYYY/MM/DD').format('DD/MM/YYYY')}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  _renderDeliveryDetailsListView = () => {
    const isFromPending = this.props.route.params.isFromPending;
    return (
      <View>
        <View
          style={
            isFromPending
              ? styles.pendingListmainContainer
              : styles.listmainContainer
          }>
          <TouchableOpacity
            style={[styles.checkBoxView, { flex: 1.3 }]}
            disabled={!isFromPending}
            onPress={() => {
              this._onSpecimanCheckBoxChange();
            }}>
            {!isFromPending ? (
              <View></View>
            ) : (
                <CheckBox
                  style={styles.checkboxStyle}
                  tintColors={{ true: Constants.COLOR.THEME_COLOR, false: '#797979' }}
                  value={this.state.isSpecimanCheckBox}
                  onValueChange={() => {
                    if (Platform.OS === 'android') {
                      this._onSpecimanCheckBoxChange();
                    }
                  }}
                />
              )}
            <Text
              style={
                isFromPending
                  ? styles.specimanTextPending
                  : styles.specimanText
              }>
              Specimen
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              flex: 1,
              paddingTop: 10,
              color: 'black',
              fontWeight: '600',
              paddingRight: 25,
              fontFamily:Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_SEMI_BOLD

            }}>
            Tube Type
          </Text>
          <Text
            style={{
              flex: 1,
              paddingTop: 10,
              color: 'black',
              fontWeight: '600',
              paddingRight: 20,
              fontFamily:Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_SEMI_BOLD
            }}>
            Bar Code
          </Text>
        </View>
        <View>
          <FlatList
            extraData={this.state.barCodeData}
            data={this.state.barCodeData}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => item.Barcode_Value}
          />
        </View>
      </View>
    );
  };

  _onSpecimanCheckBoxChange = () => {
    this.setState(
      {
        isSpecimanCheckBox: !this.state.isSpecimanCheckBox,
      },
      () => {
        if (this.state.isSpecimanCheckBox) {
          const updateData = this.state.barCodeData.map((barCodeData) => {
            return { ...barCodeData, isCheckBoxStatus: true };
          });
          this.setState({ barCodeData: updateData });
        } else {
          const updateData = this.state.barCodeData.map((barCodeData) => {
            return { ...barCodeData, isCheckBoxStatus: false };
          });
          this.setState({ barCodeData: updateData });
        }
      },
    );
  };

  _onPressUploadDownload = (index) => {
    let updateBarCode = this.state.barCodeData;
    updateBarCode[index].isShowTestList = !updateBarCode[index].isShowTestList;
    this.setState({
      barCodeData: updateBarCode,
    });
  };

  renderItem = ({ item, index }) => {
    return (
      <View>
        <View
          style={
            this.props.route.params.isFromPending
              ? styles.pendingListmainContainer
              : styles.listmainContainer
          }>
          {this._renderCheckBoxView(item, index)}

          <View style={{ flex: 0.5, paddingTop: 5 }}>
            <View
              style={[
                styles.containerStyle,
                { backgroundColor: item.Container_Color },
              ]}></View>
          </View>

          <View style={styles.textListView}>
            <Text style={styles.deliverTextStyle} numberOfLines={2}>
              {''}
              {item.Container_Desc}
              {''}
            </Text>
          </View>

          <View style={styles.textListView}>
            <Text style={styles.deliverTextStyle}>
              {' '}
              {item.Barcode_Value}{' '}
            </Text>
          </View>

          <TouchableOpacity
            style={{ flex: 0.5, flexDirection: 'row' }}
            onPress={() => {
              this._onPressUploadDownload(index);
            }}>
            {item.isShowTestList === false ? (
              <IconOutline name={'down-circle'} size={22} />
            ) : (
                <IconOutline name={'up-circle'} size={22} />
            )}
          </TouchableOpacity>
        </View>
        {this._showTestListView(item)}
      </View>
    );
  };

  _renderCheckBoxView = (item, index) => {
    const isFromPending = this.props.route.params.isFromPending;
    if (item.IsAlready_Delivered) {
      return (
        <TouchableOpacity
          disabled={true}
          style={styles.checkBoxView}
          onPress={() => {
            this._onCheckBoxChange(index);
          }}>
          {!isFromPending ? (
            <View />
          ) : (
              <CheckBox
                disabled={true}
                value={true}
                tintColors={{ true: Constants.COLOR.THEME_COLOR, false: '#797979' }}
                style={styles.checkboxStyle}
                onValueChange={() => {
                  if (Platform.OS === 'android') {
                    this._onCheckBoxChange(index);
                  }
                }}></CheckBox>
            )}

          <Text
            style={[
              styles.deliverTextStyle,
              { flex: 1.5, paddingLeft: Platform.OS === 'android' ? 0 : 20 },
            ]}
            numberOfLines={2}>

            {item.Specimen_Desc}{' '}
          </Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          disabled={!isFromPending}
          style={styles.checkBoxView}
          onPress={() => {
            this._onCheckBoxChange(index);
          }}>
          {!isFromPending ? (
            <View />
          ) : (
              <CheckBox
                value={item.isCheckBoxStatus}
                tintColors={{ true: Constants.COLOR.THEME_COLOR, false: '#797979' }}
                style={styles.checkboxStyle}
                onValueChange={() => {
                  if (Platform.OS === 'android') {
                    this._onCheckBoxChange(index);
                  }
                }}></CheckBox>
            )}

          <Text
            style={[
              styles.deliverTextStyle,
              { flex: 1.5, paddingLeft: Platform.OS === 'ios' ? 20 : null },
            ]}
            numberOfLines={1}>
            {' '}
            {item.Specimen_Desc}{' '}
          </Text>
        </TouchableOpacity>
      );
    }
  };

  _showTestListView = (item) => {
    if (item.isShowTestList) {
      return (
        <View>
          <FlatList
            data={item.Test_List}
            renderItem={({ item }) => <Item title={item.Service_Name} />}
            keyExtractor={(item, index) => item.Service_Code}
          />
        </View>
      );
    } else {
      <View></View>;
    }
  };

  _onCheckBoxChange = (index) => {
    let isAllCheckBoxVerified = false;
    let updateBarCode = this.state.barCodeData;
    updateBarCode[index].isCheckBoxStatus = !updateBarCode[index]
      .isCheckBoxStatus;
    for (var i = 0; i < updateBarCode.length; i++) {
      if (updateBarCode[i].isCheckBoxStatus) {
        isAllCheckBoxVerified = true;
      } else {
        isAllCheckBoxVerified = false;
        break;
      }
    }
    this.setState({
      barCodeData: updateBarCode,
      isSpecimanCheckBox: isAllCheckBoxVerified,
    });
  };

  _renderSubmitButtonView = () => {
    if (this.props.route.params.isFromPending) {
      return (
        <View style={{
              marginTop: 20,
              marginBottom: 5,
              alignSelf: 'flex-end',
          
            }}>
          <TouchableOpacity
            style={{
              marginTop: 20,
              marginBottom: 5,
              alignSelf: 'flex-end',

            }}
            onPress={() => {
              this._onSubmitDetails();
            }}>
            <Text style={styles.button}>Submit</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return <View />;
    }
  };

  _onSubmitDetails = () => {
    let barRegData = [];
    const newData = this.state.barCodeData.map((barCodeData) => {
      if (barCodeData.isCheckBoxStatus && !barCodeData.IsAlready_Delivered) {
        return {
          ...barRegData,
          Barcode: barCodeData.Barcode_Value,
          Specimen_Code: barCodeData.Specimen_Code,
          Container_Code: barCodeData.Container_Code,
          Suffix: barCodeData.Suffix,
        };
      } else {
        return null;
      }
    });
    let filtered = newData.filter(function (el) {
      return el != null;
    });

    if (filtered.length > 0) {
      this._sampleDeliveryUpdate(filtered);
    } else {
      this.props.dispatch({
        type: Constants.ACTIONS.SHOW_CUSTOM_ALERT,
        payload: {
          title: Constants.ALERT.TITLE.ERROR,
          message: Constants.VALIDATION_MSG.NO_DELIVERY_ITEM,
        },
      });
    }
  };

  _sampleDeliveryUpdate = (Barcode_Reg_Data) => {
    let disupdateDelivery = {
      Firm_No: this.props.deliveryData.Firm_No,
      Collector_Code: this.props.collectorCode,
      SID_Date: this.props.deliveryData.SID_Date,
      SID_No: this.props.deliveryData.SID_No,
      Barcode_Reg_Data: Barcode_Reg_Data,
    };

    this.props.updateDeliveryDetails(disupdateDelivery, (isSuccess) => {
      if (isSuccess) {
        console.log('Delivery Update SuccessFully');
      }
    });
  };
}

function Item({ title }) {
  return (
    <View
      style={{
        borderRadius: 5,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
      }}>
      <View style={styles.deliverySubList}>
        <Text style={{ fontSize: 12, color: Constants.COLOR.FONT_COLOR,fontFamily:Constants.FONT_FAMILY.FONT_FAMILY_ANEK_LATIN_REGULAR }} numberOfLines={2}>
          {title}
        </Text>
      </View>
    </View>
  );
}

const mapStateToProps = (state, props) => {
  const {
    deliveryDetailScreenState: { isDeliveryDetailScreenLoading, deliveryData },
    configState: { collectorCode },
    deviceState: { customAlert },
  } = state;

  return {
    isDeliveryDetailScreenLoading,
    deliveryData,
    collectorCode,
    customAlert,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    ...bindActionCreators(
      {
        getDeliveryDetails,
        updateDeliveryDetails,
      },
      dispatch
    ),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DeliveryDetailsScreen);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Constants.COLOR.BACKGROUND_COLOR_SCREEN,
  },
  deliveryIdView: {
    flexDirection: 'row',
  },
  deliveryIdLeftView: {
    alignSelf: 'center',
    flex: 3,
  },
  deliveryDetailsIdView: {
    flexDirection: 'row',
    paddingTop: 10,
  },
  deliveryDetailsIdLeftView: {
    alignSelf: 'center',
    flex: 3,
  },

  deliveryDetailsIdRightView: {
    alignSelf: 'center',
    // flex: 1,
  },
  deliveryIdText: {
    fontWeight: 'bold',
    color: Constants.COLOR.FONT_COLOR_DEFAULT,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR,
    fontSize: Constants.FONT_SIZE.M,
  },
  deliveryViewLink: {
    marginTop: 5,
    color: Constants.COLOR.FONT_LINK_COLOR,
    alignSelf: 'flex-end',
    fontSize: Constants.FONT_SIZE.SM,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR,
  },

  //delivery Details
  deliveryMainView: {
    flexDirection: 'row',
    //flex: 1,
  },
  deliverySubViewOne: {
    flexDirection: 'row',
    alignSelf: 'center',
    flex: 1,
  },
  rowDirectionView: {
    flexDirection: 'row',
    //paddingRight:5
  },
  deliverTextStyle: {
    alignSelf: 'flex-start',
    fontSize: Constants.FONT_SIZE.SM,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR,
    color: '#4b4b4bff',
  },
  imageStyle: {
    width: 14,
    height: 14,
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  downImageStyle: {
    width: 20,
    height: 20,
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  deliveryListMain: {
    flexDirection: 'row',
    marginLeft: 10,
    paddingTop: 10,
    flex: 1,
  },
  //delivery details list
  listmainContainer: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pendingListmainContainer: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -7,
  },
  checkboxStyle: {
    height: 5,
    width: 5,
    flex: Platform.OS === 'android' ? 0.5 : null,
    alignSelf: 'flex-start',
    paddingTop: 20,
    marginLeft: Platform.OS === 'ios' ? 2 : 0,
  },

  containerStyle: {
    height: 17,
    width: 17,
  },
  textListView: {
    flex: 1,
    paddingRight: 20,
    paddingTop: 5,
  },
  headerView: {
    color: '#898989',
    fontWeight: 'bold',
  },
  headerTextStyle: {
    alignSelf: 'flex-start',
    fontSize: Constants.FONT_SIZE.SM,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR,
    padding: 5,
    color: '#898989',
    fontWeight: 'bold',
    // flex:1
  },
  button: {
    borderWidth: 1,
    textAlign: 'center',
    fontSize: Constants.FONT_SIZE.SM,
    fontFamily:Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_SEMI_BOLD,
    color: '#FFFFFF',
    fontWeight: 'normal',
    backgroundColor:Constants.COLOR.THEME_COLOR,
    borderColor: Constants.COLOR.THEME_COLOR,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 10,
    paddingBottom: 10,
    width: deviceHeight * 0.15,
    borderRadius: 5,
    borderBottomWidth: 0,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  listsubContainer: {
    marginVertical: 10,
    marginHorizontal: 5,
    flexDirection: 'row',
  },
  deliverySubList: {
    borderWidth: 1,
    textAlign: 'center',
    fontSize: Constants.FONT_SIZE.SM,
    fontFamily:Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR,
    color: '#FFFFFF',
    fontWeight: 'normal',
    backgroundColor: '#d4d4d4',
    borderColor: '#d4d4d4',
    paddingHorizontal: 10,
    paddingTop: 3,
    paddingBottom: 3,
    width: deviceWidth / 1.5,
    borderBottomWidth: 0,
    alignSelf: 'flex-end',
    overflow: 'hidden',
  },
  checkBoxView: {
    flexDirection: 'row',
    paddingTop: 10,
    flex: 2,
    marginLeft: Platform.OS === 'ios' ? 5 : null,
  },
  specimanText: {
    color: 'black',
    fontWeight: '600',
    fontFamily:Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_SEMI_BOLD,
    paddingLeft: 10
  },
  specimanTextPending: {
    color: 'black',
    fontWeight: '600',
    fontFamily:Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_SEMI_BOLD,
    paddingLeft: 10
    // paddingLeft: Platform.OS === 'ios' ? 20 : 15,
  },
});
