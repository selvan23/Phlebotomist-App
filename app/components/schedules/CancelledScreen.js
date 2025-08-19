/*************************************************
 * SukraasLIS - Phlebotomist
 * CancelledScreen.js
 * Created by Abdul on 16/07/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/
"use strict";

import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StyleSheet,
  FlatList,
} from "react-native";
import { useIsFocused } from '@react-navigation/native';
import LoadingScreen from "../common/LoadingScreen";
import Constants from "../../util/Constants";
import BookRow from "./BookRow";
import CalenderList from "../common/Calender";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  getPendingList,
  setPendingDate,
} from "../../actions/PendingScreenAction";
import moment from "moment";
import { navigate } from "../../rootNavigation";
import store from "../../store";

class CancelledScreen extends Component {
  static propTypes = {
    bookingLists: PropTypes.array,
    getPendingList: PropTypes.func,
    collectorCode: PropTypes.string,
    canceledDate: PropTypes.string,
  };
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      date:
        this.props.isCalenderDateSelected === true
          ? this.props.pendingDate
          : moment().utcOffset("+05:30").format("YYYY/MM/DD"),
      collectorCode: this.props.collectorCode,
      filter_Type: "R",
    };
  }

  componentDidMount() {
    if (store.getState().deviceState.isNetworkConnectivityAvailable) {
      // this.willFocusSubscription = this.props.navigation.addListener(
      //   "focus",
      //   () => {
      //     this._getAsyncAndAPICall();
      //   }
      // );
      
    } else {
      this.internetAlert(Constants.VALIDATION_MSG.NO_INTERNET);
    }
    // this.props.getPendingList('0802', '2020/07/23', 'R');
    // this._setDate(JSON.stringify(this.state.date));
  }

  // componentDidUpdate(prevProps, prevState) {
  //   console.log("cancelled component update...", prevProps.pendingDate, this.props.pendingDate);
  //   if (prevProps.pendingDate !== this.props.pendingDate) {
  //     let postData = {
  //       Collector_Code: this.state.collectorCode,
  //       Schedule_Date: this.props.pendingDate,
  //       Filter_Type: this.state.filter_Type,
  //     };
  //     console.log('cancelled component update pending payload', postData);
  //     setTimeout(() => {
  //       this.props.getPendingList(postData, (isSuccess) => {});  
  //     }, 200)
  //   }
  // }

  componentWillUnmount() {
    if (store.getState().deviceState.isNetworkConnectivityAvailable) {
      // this.willFocusSubscription();
    }
  }

  _getAsyncAndAPICall() {
    let postData = {
      Collector_Code: this.state.collectorCode,
      Filter_Type: this.state.filter_Type,
      Schedule_Date: this.props.isCalenderDateSelected
        ? this.props.pendingDate
        : moment().utcOffset("+05:30").format("YYYY/MM/DD"),
    };
    this.props.getPendingList(postData, (isSuccess) => {});
  }

  _renderScreen = () => {
    console.log("rendering cancelled screen");
    if (this.props.isPendingLoading) {
      return (
        <LoadingScreen
          isLoading={this.props.isPendingLoading}
          isRefreshing={false}
          message={"Tap to Reload"}
          onReloadPress={() => {
            let postData = {
              Collector_Code: this.state.collectorCode,
              // Schedule_Date: this.state.date,
              Schedule_Date: this.props.pendingDate,
              Filter_Type: this.state.filter_Type,
            };
            this.props.getPendingList(postData, (isSuccess) => {});
          }}
        />
      );
    } else {
      if (
        this.props.cancelledBookingList !== undefined &&
        this.props.cancelledBookingList.Booking_Detail !==
          undefined &&
        this.props.cancelledBookingList.Booking_Detail !==
          null &&
        this.props.cancelledBookingList.Booking_Detail.length >
          0
      ) {
        return this._renderBookingView();
      } else {
        return (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Text style={{ color: "black", fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR }}>No Data Found!</Text>
          </View>
        );
      }
    }
  };
  _setDate = async (newDate) => {
    // this.setState({ date: newDate });
    let postData = {
      Collector_Code: this.state.collectorCode,
      Schedule_Date: newDate,
      Filter_Type: this.state.filter_Type,
    };
    await this.props.getPendingList(postData, (isSuccess) => {});
    this.props.setPendingDate(newDate);
  };

  _screenLoading = () => {
    return <LoadingScreen />;
  };

  _renderBookingView = () => {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <View>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={
              this.props.cancelledBookingList.Booking_Detail
            }
            renderItem={this._renderBookingRow}
            keyExtractor={this._keyExtractor}
            onRefresh={() => this.onRefresh()}
            refreshing={this.props.isPendingLoading}
          />
        </View>
      </SafeAreaView>
    );
  };
  onRefresh() {
    let postData = {
      Collector_Code: this.state.collectorCode,
      // Schedule_Date: this.state.date,
      Schedule_Date: this.props.pendingDate,
      Filter_Type: this.state.filter_Type,
    };
    this.props.getPendingList(postData, (isSuccess) => {});
  }
  _renderBookingRow = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          // Actions.cancelBookingDetail({
          //   rowData: {
          //     Firm_No: item.Firm_No,
          //     Booking_No: item.Booking_No,
          //     Collector_Code: this.state.collectorCode,
          //     Booking_Date: item.Booking_Date,
          //     Booking_Type: item.Booking_Type,
          //   },
          // });
          navigate("cancelBookingDetail", {
            rowData: {
              Firm_No: item.Firm_No,
              Booking_No: item.Booking_No,
              Collector_Code: this.state.collectorCode,
              Booking_Date: item.Booking_Date,
              Booking_Type: item.Booking_Type,
            },
          });
        }}
      >
        <BookRow rowData={item} isFrom={"cancelled"} />
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Constants.COLOR.WHITE_COLOR,
        }}
      >
        <CalenderList setDate={this._setDate} />
        {this._renderScreen()}
      </View>
    );
  }
}

const CancelledScreenComponent = (props) => {
  const isFocused = useIsFocused();
  return <CancelledScreen {...props} isFocused={isFocused} />
};

const mapStateToProps = (state, props) => {
  const {
    pendingState: {
      bookingLists,
      cancelledBookingList,
      isPendingLoading,
      pendingDate,
      isCalenderDateSelected,
    },
    configState: { collectorCode },
  } = state;

  console.log("cancelled state: ", state.pendingState)

  return {
    bookingLists,
    cancelledBookingList,
    isPendingLoading,
    collectorCode,
    pendingDate,
    isCalenderDateSelected,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getPendingList,
      setPendingDate,
    },
    dispatch
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(CancelledScreen);

// export default CancelledScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Constants.COLOR.BACKGROUND_COLOR_SCREEN,
  },
});
