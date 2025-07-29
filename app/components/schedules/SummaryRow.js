"use strict";
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import Constants from "../../util/Constants";
import HTML from "react-native-render-html";

class SummaryRow extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.rowMainView}>
        <View style={styles.rowView}>
          <Text style={[styles.rowText, { flex: 1 }]}>
            {this.props.rowData.Service_Name?.trim() !== ""
              ? this.props.rowData.Service_Name
              : "Loading..."}
          </Text>
          {this._renderAmount()}
        </View>
        {/* {this._renderNoHouseWarning()} */}
      </View>
    );
  }
  _renderNoHouseWarning = () => {
    if (
      this.props.isFromSummary !== undefined &&
      this.props.isFromSummary === true
    ) {
      if (
        this.props.rowData.hasOwnProperty("No_House_Visit") &&
        this.props.rowData.No_House_Visit === "Y"
      ) {
        return (
          <Text style={styles.rowTextAlertMessage}>
            {this.props.rowData.No_House_Visit_Message}
          </Text>
        );
      } else {
        return null;
      }
    } else {
      return null;
    }
  };
  _renderAmount = () => {
    console.log(
      "render amount : ",
      this.props.currency + " " + this.props.rowData.Service_Amount
    );
    return (
      <View style={styles.rowText}>
        <HTML
          baseStyle={styles.rowTextAmt}
          source={{
            html: this.props.currency + " " + this.props.rowData.Service_Amount,
          }}
        />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  rowMainView: {
    flex: 1,
  },
  rowView: {
    alignSelf: "center",
    alignContent: "center",
    textAlign: "center",
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F5F5F5",
  },
  rowText: {
    fontSize: Constants.FONT_SIZE.SM,
    // paddingVertical: 3,
    // paddingTop: 6,
    paddingHorizontal: 16,
    // color: '#121212',
    color: "black",
  },
  rowTextAmt: {
    fontSize: Constants.FONT_SIZE.SM,
    paddingVertical: 12,
    paddingHorizontal: 16,
    // color: '#767676',
    color: "black",
  },
});

export default SummaryRow;
