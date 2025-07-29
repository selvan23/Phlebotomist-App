/*************************************************
 * SukraasLIS - Phlebotomist
 * PendingScreen.js
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
  Alert,
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
import store from "../../store";
import { navigate, navigationRef } from "../../rootNavigation";
// const currentScene = 'pendingScreen';
const currentScene = "pendingTab";

class PendingScreen extends Component {
  static propTypes = {
    bookingLists: PropTypes.array,
    getPendingList: PropTypes.func,
    setPendingDate: PropTypes.func,
    collectorCode: PropTypes.string,
    pendingDate: PropTypes.string,
    isCalenderDateSelected: PropTypes.bool,
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
      filter_Type: "P",
    };
    this.focusRetrieved = false;
    console.log("pending constructor: ", this.props.pendingBookingList);
  }

  internetAlert(Message) {
    Alert.alert(
      Constants.ALERT.TITLE.FAILED,
      Message,
      [
        {
          text: Constants.ALERT.BTN.OK,
          onPress: () => {
            // Actions.pop();
          },
        },
      ],
      { cancelable: false }
    );
  }

  // componentDidMount() {
  //   console.log('pending did mount', this.props.pendingBookingList);
  //   if (store.getState().deviceState.isNetworkConnectivityAvailable) {
  //     // this.willFocusSubscription = this.props.navigation.addListener(
  //     //   "focus",
  //     //   () => {
  //     //     this._getAsyncAndAPICall();
  //     //   }
  //     // );
  //     this._getAsyncAndAPICall();
  //   } else {
  //     this.internetAlert(Constants.VALIDATION_MSG.NO_INTERNET);
  //   }
  // }

  componentWillUnmount() {
    if (store.getState().deviceState.isNetworkConnectivityAvailable) {
      // this.willFocusSubscription();
    }
  }

  componentDidUpdate(prevProps) {
    console.log('pending screen component updating ', prevProps);
    // if (this.props.isFocused && !this.focusRetrieved) {
    //   this._getAsyncAndAPICall();
    //   this.focusRetrieved = true;
    // }
    if (prevProps.pendingDate !== this.props.pendingDate) {
      let postData = {
        Collector_Code: this.state.collectorCode,
        Schedule_Date: this.props.pendingDate,
        Filter_Type: this.state.filter_Type,
      };
      console.log('pending component update pending payload', postData);
      setTimeout(() => {
        this.props.getPendingList(postData, (isSuccess) => {});  
      }, 200)
    }
  }

  _getAsyncAndAPICall = () => {
    let postData = {
      Collector_Code: this.state.collectorCode,
      Filter_Type: this.state.filter_Type,
      Schedule_Date: this.props.isCalenderDateSelected
        ? this.props.pendingDate
        : moment().utcOffset("+05:30").format("YYYY/MM/DD"),
    };
    console.log("Aynscccccc  APi $$$$$$$$$$$$$$$$$$$$$$", postData);
    this.props.getPendingList(postData, (isSuccess) => {});
  };

  _renderScreen = () => {
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
      console.log("filter type screen", this.state.filter_Type, this.props);
      console.log("booking list screen: ", this.props.pendingBookingList, this.props.pendingBookingList);
      if (
        this.props.pendingBookingList !== undefined &&
        this.props.pendingBookingList.Booking_Detail !==
          undefined &&
        this.props.pendingBookingList.Booking_Detail !==
          null &&
        this.props.pendingBookingList.Booking_Detail.length >
          0
      ) {
        return this._renderBookingView();
      } else {
        return (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Text style={{ color: "black" }}>No Data Found!</Text>
          </View>
        );
      }
    }
  };

  _renderBookingView = () => {
    console.log("render booking view: : ", this.props.pendingBookingList.Booking_Detail);
    return (
      <SafeAreaView style={styles.mainContainer}>
        <View>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={
              this.props.pendingBookingList.Booking_Detail
            }
            renderItem={this._renderBookingRow}
            // keyExtractor={this._keyExtractor}
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
    console.log("booking row", item);
    return (
      <TouchableOpacity
        onPress={() => {
          // if (Actions.currentScene === currentScene) {
          if (navigationRef.getCurrentRoute().name === currentScene) {
            // Actions.pendingDetailScreen({
            //   rowData: {
            //     Firm_No: item.Firm_No,
            //     Booking_No: item.Booking_No,
            //     Collector_Code: this.state.collectorCode,
            //     Booking_Date: item.Booking_Date,
            //     Booking_Type: item.Booking_Type,
            //   },
            // });
            navigate("pendingDetailScreen", {
              rowData: {
                Firm_No: item.Firm_No,
                Booking_No: item.Booking_No,
                Collector_Code: this.state.collectorCode,
                Booking_Date: item.Booking_Date,
                Booking_Type: item.Booking_Type,
              },
            });
          }
        }}
      >
        <BookRow rowData={item} />
      </TouchableOpacity>
    );
  };

  _setDate = async (newDate) => {
    let postData = {
      Collector_Code: this.state.collectorCode,
      Schedule_Date: newDate,
      Filter_Type: this.state.filter_Type,
    };
    await this.props.getPendingList(postData, (isSuccess) => {
      console.log("pending set date: ", postData, isSuccess);
    });
    // this.setState({ date: newDate });
    this.props.setPendingDate(newDate);
    // setTimeout(() => {
    // }, 100);
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#FBFBFB",
        }}
      >
        { console.log("pending props changed", this.props.pendingBookingList) }
        <CalenderList setDate={this._setDate} isfromPending={"PENDING"} />
        {this._renderScreen()}
      </View>
    );
  }
}

function PendingScreenComponent(props) {
  const isFocused = useIsFocused();
  console.log("pending props changed component", props);
  return <PendingScreen {...props} isFocused={isFocused} />;
}

const mapStateToProps = (state, props) => {
  const {
    pendingState: {
      bookingLists,
      pendingBookingList,
      isPendingLoading,
      pendingDate,
      completedDate,
      isCalenderDateSelected,
    },
    configState: { collectorCode },
  } = state;

  console.log("pendingstate: ", state.pendingState);

  return {
    bookingLists,
    pendingBookingList,
    isPendingLoading,
    isCalenderDateSelected,
    collectorCode,
    pendingDate,
    completedDate,
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
export default connect(mapStateToProps, mapDispatchToProps)(PendingScreen);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Constants.COLOR.BACKGROUND_COLOR_SCREEN,
  },
});
