/*************************************************
 * SukraasLIS - Phlebotomist
 * CollectionScreen.js
 * Created by Abdul on 16/07/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import Constants from "../../util/Constants";
import { connect } from "react-redux";
import LoadingScreen from "../common/LoadingScreen";
import { getCashCollectionList } from "../../actions/CollectionscreenAction";
import CalenderList from "../common/Calender";
import moment from "moment";
import HTML from "react-native-render-html";
import RiyalPrice from "../common/RiyalPrice";

class CollectionScreen extends Component {
  static propTypes = {
    iscollectionScreenLoading: PropTypes.bool,
    isNetworkConnectivityAvailable: PropTypes.bool,
    currency: PropTypes.string,
    arrPaymentDetails: PropTypes.array,
    getCashCollectionList: PropTypes.func,
  };

  _renderItem = ({ item }) => {
    return (
      <View style={{ flexDirection: "row" }}>
        <View style={styles.dateAndTimeView}>
          <Text style={styles.bookingContentText}>{item.Booking_No}</Text>
        </View>
        <View style={[styles.dateAndTimeView, { flex: 2 }]}>
          <Text style={styles.bookingContentText}>{item.Full_Name}</Text>
        </View>
        <View style={[styles.dateAndTimeView, { flex: 1.1 }]}>
          <RiyalPrice textStyle={{fontWeight: 'regular'}} dynamicHeight={0.024} amount={item?.Amount} />
        </View>
        <View style={styles.dateAndTimeView}>
          <Text style={styles.bookingContentText}>{item.Payment_Desc}</Text>
        </View>
      </View>
    );
  };

  _screenLoading = () => {
    return <LoadingScreen />;
  };
  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#FBFBFB",
        }}
      >
        <CalenderList setDate={this._setDate} isFromCollection={true} />
        {this._renderScreens()}
      </View>
    );
  }

  _renderScreens = () => {
    if (this.props.iscollectionScreenLoading) {
      return this._screenLoading();
    } else {
      if (
        this.props.arrPaymentDetails.length > 0 &&
        this.props.arrPaymentDetails !== undefined &&
        this.props.arrPaymentDetails !== null &&
        this.props.arrPaymentDetails[0].Collection_Detail.length > 0 &&
        this.props.arrPaymentDetails[0].Collection_Detail !== null &&
        this.props.arrPaymentDetails[0].Collection_Detail !== undefined
      ) {
        return this._renderPaymentListView();
      } else {
        return (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#121212" }}>No Data Found!</Text>
          </View>
        );
      }
    }
  };
  componentDidMount() {
    let postData = {
      Collector_Code: this.props.collectorCode,
      Collect_Date: moment().utcOffset("+05:30").format("YYYY/MM/DD"),
    };
    this.props.getCashCollectionList(postData);
  }

  _setDate = (date) => {
    let postData = {
      Collector_Code: this.props.collectorCode,
      Collect_Date: date,
    };
    this.props.getCashCollectionList(postData);
  };

  _renderPaymentListView = () => {
    return (
      <View style={styles.mainContainer}>
        <KeyboardAwareScrollView>
          <View style={styles.flatListHeaderView}>
            <Text style={[styles.flatListBookingText, { flex: 1 }]}>
              BOOKING ID
            </Text>
            <Text style={[styles.flatListBookingText, { flex: 2 }]}>
              PATIENT NAME
            </Text>
            <Text style={styles.flatListBookingText}>AMOUNT</Text>
            <Text style={styles.flatListBookingText}>MODE</Text>
          </View>
          {this._renderFlatListItem()}
          <View style={[styles.totalAmountView, { alignItems: "center" }]}>
            <Text style={styles.totalAmountText}>Total:</Text>
            <RiyalPrice amount={this.props.arrPaymentDetails[0].Total_Amount} dynamicHeight={0.026} />
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  };

  _renderFlatListItem = () => {
    return (
      <FlatList
        style={styles.flatListBorder}
        data={this.props.arrPaymentDetails[0].Collection_Detail}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        renderItem={({ item }) => this._renderItem({ item })}
      />
    );
  };
}
const mapStateToProps = (state, props) => {
  const {
    collectionScreenState: { iscollectionScreenLoading, arrPaymentDetails },
    configState: { collectorCode, currency },
  } = state;

  return {
    collectorCode,
    iscollectionScreenLoading,
    arrPaymentDetails,
    currency,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getCashCollectionList,
    },
    dispatch
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(CollectionScreen);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // marginTop: 20,
    marginHorizontal: 10,
    // backgroundColor: 'green'
  },
  dateAndTimeView: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D8D8D8",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  totalAmountView: {
    alignSelf: "flex-end",
    flexDirection: "row",
    paddingVertical: 20,
    marginRight: 10,
  },
  totalAmountText: {
    textAlign: "left",
    paddingHorizontal: 20,
    color: "black",
    fontWeight: "bold",
    fontSize: Constants.FONT_SIZE.M,
    alignSelf: "center",
  },
  bookingContentText: {
    color: "black",
  },
  flatListBorder: {
    borderWidth: 0.5,
    borderRadius: 10,
  },
  flatListHeaderView: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 0,
    marginTop: 10,
  },
  flatListBookingText: {
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 10,
    paddingHorizontal: 5,
    flex: 1,
    fontSize: 13,
    color: "black",
  },
  subContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  calenderIcon: {
    width: 20,
    height: 20,
    alignSelf: "center",
    tintColor: "#FA5858",
  },
});
