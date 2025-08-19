// use 'strict';
import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Modal,
  SafeAreaView,
} from "react-native";
import moment from "moment";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { CalendarList } from "react-native-calendars";
import Utility from "../../util/Utility";
import { getcalenderDate } from "../../actions/CalenderAction";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import PropTypes from "prop-types";
import Constants from "../../util/Constants";
import LoadingScreen from "../common/LoadingScreen";
const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

class CalenderList extends Component {
  static propTypes = {
    isCalenderLoading: PropTypes.bool,
    isNetworkConnectivityAvailable: PropTypes.bool,
    isfromCompleted: PropTypes.bool,
    isfromPending: PropTypes.bool,
    calenderDate: PropTypes.object,

    getcalenderDate: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      date:
        this.props.isFromCollection === true
          ? moment().format("MMM D, YYYY")
          : this.props.isCalenderDateSelected === true
          ? moment(this.props.pendingDate, "YYYY/MM/DD").format("MMM D, YYYY")
          : moment().format("MMM D, YYYY"),
      showCalender: false,
      markedDates: {},
    };
  }
  componentWillMount() {
    const dateformat = moment(this.state.date, "MMM D, YYYY").format(
      "YYYY-MM-DD"
    );
    let markedDates = {};
    markedDates[dateformat] = { selected: true, marked: true };
    this.setState({
      markedDates: markedDates,
    });
    this.showDatetoTextBox(JSON.stringify(dateformat));
  }

  showDatetoTextBox(dateString) {
    const dateStr = JSON.parse(dateString);
    let markedDates = {};
    markedDates[dateStr] = { selected: true };
    const formattedDate = moment(dateStr, "YYYY-MM-DD").format("MMM D, YYYY");
    const dateformat = moment(dateStr, "YYYY-MM-DD").format("YYYY/MM/DD");
    if (this.props.isNetworkConnectivityAvailable) {
      this.props.setDate(dateformat);
      this.setState({
        date: formattedDate,
        markedDates: markedDates,
        showCalender: false,
      });
    }
  }

  _renderModalCalender = () => {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          flex_direction: "row",
          alignItems: "center",
          backgroundColor: "rgba(52, 52, 52, 0.8)",
        }}
      >
        <TouchableOpacity
          style={{ alignSelf: "flex-end", marginTop: 20, marginBottom: 10 }}
          onPress={() => {
            this.setState({ showCalender: false });
          }}
        >
          <Image
            source={require("../../images/close_white.png")}
            style={{
              width: deviceWidth / 20,
              height: deviceWidth / 20,
              alignSelf: "flex-end",
              marginRight: 20,
            }}
          />
        </TouchableOpacity>

        <View
          style={{
            marginTop: 10,
            marginBottom: 50,
            marginHorizontal: 10,
            alignItems: "center",
            backgroundColor: Constants.COLOR.WHITE_COLOR,
          }}
        >
          <View style={styles.BorderTextView}>
            <View style={{ flex: 3, flexDirection: "row" }}>
              <Text style={styles.TextStyle}>
                {this.props.isFromCollection
                  ? this.state.date
                  : this.props.isCalenderDateSelected
                  ? moment(this.props.pendingDate, "YYYY/MM/DD").format(
                      "MMM D, YYYY"
                    )
                  : this.state.date}
              </Text>
            </View>

            <TouchableOpacity
              disabled
              style={{
                alignItems: "center",
                justifyContent: "center",
                padding: 10,
                paddingHorizontal: 20,
                borderRadius: 60,
              }}
            >
              <Image
                source={require("../../images/calenderBlack.png")}
                style={styles.calenderIcon}
              />
            </TouchableOpacity>
          </View>
          <KeyboardAwareScrollView>
            {this._renderCalendarView()}
          </KeyboardAwareScrollView>
        </View>
      </SafeAreaView>
    );
  };

  _renderMarkedDates = () => {
    if (this.props.isFromCollection) {
      return this.state.markedDates;
    } else if (this.props.isCalenderDateSelected) {
      let markedDates1 = {};
      const pendingDate = moment(this.props.pendingDate, "YYYY/MM/DD").format(
        "YYYY-MM-DD"
      );
      // const pendingDate = this.props.pendingDate;
      markedDates1[pendingDate] = { selected: true, marked: true };
      return markedDates1;
    } else {
      return this.state.markedDates;
    }
  };

  _renderCalendarView = () => {
    if (this.props.isCalenderLoading) {
      return <LoadingScreen />;
    } else {
      return (
        <CalendarList
          current={moment(this.state.date, "MMM D,YYYY").format("YYYY-MM-DD")}
          minDate={moment(
            this.props.calenderDate.Scheduled_Start_Date,
            "YYYY/MM/DD"
          ).format("YYYY-MM-DD")}
          maxDate={
            this.props.isFromCollection === true
              ? moment().format("YYYY-MM-DD")
              : moment(
                  this.props.calenderDate.Scheduled_End_Date,
                  "YYYY/MM/DD"
                ).format("YYYY-MM-DD")
          }
          style={styles.calenderList}
          pastScrollRange={1}
          futureScrollRange={1}
          horizontal={true}
          pagingEnabled={true}
          disableArrowLeft={true}
          calendarWidth={deviceWidth - 40}
          disableArrowRight={true}
          monthFormat={"MMM d,yyyy"}
          onDayPress={({ dateString }) => {
            this.showDatetoTextBox(JSON.stringify(dateString));
          }}
          markedDates={this._renderMarkedDates()}
          markingType={"custom"}
          firstDay={1}
          theme={{
            textSectionTitleColor: "black",
            selectedDayBackgroundColor: Constants.COLOR.PRIMARY_COLOR,
            selectedDayTextColor: "white",
            todayTextColor: "black",
            dayTextColor: "black",
            textDisabledColor: "darkgray",
            monthTextColor: "white",
            // textDayFontWeight: '200',
            // textMonthFontWeight: 'bold',
            // textDayHeaderFontWeight: '200',
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 15,

            "stylesheet.calendar.header": {
              header: {
                marginTop: 0,
                height: 80,
                marginLeft: -15,
                marginRight: -15,
                borderRadius: 10,

                alignItems: "center",
                backgroundColor: "#424141",
              },

              monthText: {
                marginTop: 15,
                color: "white",
                fontWeight: "700",
                fontSize: 16,
              },
              dayHeader: {
                marginTop: -42,
                marginBottom: 7,
                width: 30,
                textAlign: "center",
                fontSize: 14,
                color: "white",
              },
            },
          }}
        />
      );
    }
  };

  _renderModal = () => {
    if (false) {
      return (
        <View style={{ position: "absolute", left: 0, top: 0 }}>
          <LoadingScreen />
        </View>
      );
    } else {
      return (
        <Modal
          animationType={"slide"}
          transparent={true}
          style={{ flex: 1, margin: 20 }}
          visible={this.state.showCalender}
          onRequestClose={() => {}}
        >
          {this._renderModalCalender()}
        </Modal>
      );
    }
  };

  _renderCalender = () => {
    return (
      <View
        style={{
          margin: 10,
          marginTop: 15,
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: Constants.COLOR.LIGHT_BACKGROUND_COLOR,
          borderRadius: 60,
          borderWidth: 1,
          borderColor: Constants.COLOR.LIGHT_BACKGROUND_COLOR,
        }}
      >
        <Text
          style={{
            marginLeft: 5,
            paddingLeft: 5,
            alignSelf: "center",
            overflow: "hidden",
            color: "black",
            fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR,
          }}
        >
          {this.props.isFromCollection
            ? this.state.date
            : this.props.isCalenderDateSelected
            ? moment(this.props.pendingDate, "YYYY/MM/DD").format("MMM D, YYYY")
            : this.state.date}
        </Text>
        <TouchableOpacity
          onPress={() => {
            this.setState({
              showCalender: true,
            });
            this.props.getcalenderDate();
          }}
          style={{
            backgroundColor: '#EFF2F5',
            padding: 12,
            alignSelf: "flex-start",
            paddingHorizontal: 20,
            borderRadius: 60,
          }}
        >
          <Image
            source={require("../../images/calenderBlack.png")}
            style={styles.calenderIcon}
          />
        </TouchableOpacity>
        {this.state.showCalender === true ? this._renderModal() : null}
      </View>
    );
  };
  _screenLoading = () => {
    return <LoadingScreen />;
  };

  render() {
    return this._renderCalender();
  }
}

const styles = StyleSheet.create({
  avatar: {
    padding: 15,
    width: 30,
    height: 30,

    alignSelf: "center",
    backgroundColor: "red",
  },
  BorderTextView: {
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 10,
    borderRadius: 30,
    backgroundColor: Constants.COLOR.LIGHT_BACKGROUND_COLOR,
    flexDirection: "row",
  },
  calenderList: {
    borderWidth: 0.5,
    borderRadius: 10,
    borderColor: "lightgray",
    marginHorizontal: 10,
    marginBottom: 90,
  },
  TextStyle: {
    textAlign: "center",
    alignSelf: "center",
    color: Constants.COLOR.BLACK_COLOR,
    padding: 10,
    marginLeft: 10,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR
  },
  calenderIcon: {
    padding: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    tintColor: Constants.COLOR.PRIMARY_COLOR,
  },
});

const mapStateToProps = (state, props) => {
  const {
    calenderState: { calenderDate, isCalenderLoading },
    deviceState: { isNetworkConnectivityAvailable },
    pendingState: { pendingDate, isCalenderDateSelected },
  } = state;
  return {
    isCalenderLoading,
    calenderDate,
    isNetworkConnectivityAvailable,
    pendingDate,

    isCalenderDateSelected,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getcalenderDate,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(CalenderList);
