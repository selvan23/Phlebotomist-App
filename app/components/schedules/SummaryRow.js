"use strict";
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import Constants from "../../util/Constants";
import HTML from "react-native-render-html";
import RiyalPrice from "../common/RiyalPrice";

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
      </View>
    );
  }
  _renderAmount = () => {
    console.log(
      "render amount : ",
      this.props.currency + " " + this.props.rowData.Service_Amount
    );
    return (
      <View style={styles.rowText}>
        <View style ={styles.rowTextAmt}>
          <RiyalPrice textStyle={{fontWeight: 'regular'}} amount={(this.props.rowData.Service_Amount)} dynamicHeight={0.029} />
        </View>
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
    backgroundColor: Constants.COLOR.LIGHT_GREY,
  },
  rowText: {
    fontSize: Constants.FONT_SIZE.SM,
    // paddingVertical: 3,
    // paddingTop: 6,
    paddingHorizontal: 16,
    // color: '#121212',
    color: Constants.COLOR.BLACK_COLOR,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR,
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
