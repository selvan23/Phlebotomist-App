/*************************************************
 * SukraasLIS
 * @exports
 * @class PdfReport.js
 * @extends Component
 * Created by Kishore on 13/07/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

"use strict";
import React, { Component } from "react";
import { Text, View, Dimensions, Platform, StyleSheet } from "react-native";
import Utility from "../../util/Utility";
import Constants from "../../util/Constants";
const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

import WebView from "react-native-webview";
import Pdf from "react-native-pdf";
import { TouchableOpacity } from "react-native";
import ButtonBack from "../common/ButtonBack";
import { nativationPop } from "../../rootNavigation";
import { IconOutline } from "@ant-design/icons-react-native";

export default class PdfReport extends Component {
  constructor(props) {
    super(props);
    this.WebView = null;
  }
  render() {
    console.log("pdf report ", this.props.route.params.pdf.includes(".pdf"));
    if (!this.props.route.params.pdf.includes(".pdf")) {
      return (
        <View style={styles.mainContainer}>
          <TouchableOpacity
            onPress={() => {
              nativationPop();
            }}
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              padding: 20,
            }}
          >
            <IconOutline name="close" size={24} />
          </TouchableOpacity>
          <WebView
            ref={(ref) => (this.WebView = ref)}
            source={{
              uri: this.props.route.params.pdf,
            }}
            onError={(error) => {
              console.log(error);
            }}
            style={styles.subContainer}
            scalesPageToFit
          />
          <View style={styles.buttonBackView}></View>
        </View>
      );
    } else {
      return (
        <View style={styles.mainContainer}>
          <TouchableOpacity
            onPress={() => {
              nativationPop();
            }}
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              padding: 20,
            }}
          >
            <IconOutline name="close" size={24} />
          </TouchableOpacity>
          <Pdf
            trustAllCerts={false}
            source={{
              uri: this.props.route.params.pdf,
            }}
            onLoadComplete={(numberOfPages, filePath) => {
              console.log(`number of pages: ${numberOfPages}`);
            }}
            onPageChanged={(page, numberOfPages) => {
              console.log(`current page: ${page}`);
            }}
            onError={(error) => {
              console.log(error);
            }}
            onPressLink={(uri) => {
              console.log(`Link presse: ${uri}`);
            }}
            style={styles.subContainer}
          />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Constants.COLOR.WHITE_COLOR
  },
  subContainer: {
    flex: 1,
    backgroundColor: Constants.COLOR.WHITE_COLOR
  },
  buttonBackView: { alignSelf: "flex-start", marginLeft: 10, marginBottom: 10 },
});
