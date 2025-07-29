/*************************************************
 * SukraasLIS - Phlebotomist
 * DeliveryTabs.js
 * Created by Sankar on 16/07/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/
'use strict';

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Dimensions,
} from 'react-native';
import Constants from '../../util/Constants';
import Utility from '../../util/Utility';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  getPendingDeliveryList,
  getDeliveryList,
} from '../../actions/DeliveryScreenAction';
import moment from 'moment';
import { navigate } from '../../rootNavigation';

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;

class DeliveryTabs extends Component {
  static propTypes = {
    collectorCode: PropTypes.string,
    pendingCount: PropTypes.number,
    completedCount: PropTypes.number,
    getPendingDeliveryList: PropTypes.func,
    getDeliveryList: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      collectorCode: this.props.collectorCode,
    };
  }

  render() {
    const { state } = this.props;
    const activeTabIndex = state.index;

    return (
      <View style={styles.mainContainer}>
        <TouchableOpacity
          style={styles.subContainer}
          onPress={() => {
            let postData = {
              Collector_Code: this.state.collectorCode,
              Filter_Type: 'P',
            };
            // Actions.pendingDeliveryTab();
            navigate('pendingDeliveryTab');

            this.props.getPendingDeliveryList(postData, (callBack) => {
              if (callBack) {
                console.log("Pending Service Success")
              } 
            });
          }}>
          <View style={styles.bodyContainer}>
            <Text
              style={{
                color: '#6D7178',
                alignSelf: 'center',
                fontSize: Constants.FONT_SIZE.SM,
                fontWeight: 'bold',
              }}>
              PENDING DELIVERY
            </Text>
          </View>
          {this._displayPendingIndicator(activeTabIndex)}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.subContainer}
          onPress={() => {
            let postData = {
              Collector_Code: this.state.collectorCode,
              Filter_Type: 'C',
            };
            // Actions.deliveredScreenTab();
            navigate('deliveredScreenTab');
            this.props.getDeliveryList(postData, (callBack) => {
              if (callBack) {
                console.log("Delivery Service Success")
              }
            });
          }}>
          <View style={styles.bodyContainer}>
            <Text
              style={{
                color: '#6D7178',
                alignSelf: 'center',
                fontSize: Constants.FONT_SIZE.SM,
                fontWeight: 'bold',
              }}>
              DELIVERED
            </Text>
          </View>
          {this._displayDeliveredIndicator(activeTabIndex)}
        </TouchableOpacity>
      </View>
    );
  }

  _displayPendingIndicator = (index) => {
    return index === 0 ? (
      <View style={[styles.indicator, { backgroundColor: '#6D7178' }]} />
    ) : (
        <View style={{ marginTop: 15 }}></View>
      );
  };
  _displayDeliveredIndicator = (index) => {
    return index === 1 ? (
      <View style={[styles.indicator, { backgroundColor: '#6D7178' }]} />
    ) : (
        <View style={{ marginTop: 15 }}></View>
      );
  };
}

const mapStateToProps = (state, props) => {
  const {
    pendingDeliveryScreenState: {
      isPendingDeliveryScreenLoading,
      arrPendingDeliveryInfo,
    },
    configState: { collectorCode },
  } = state;

  return {
    isPendingDeliveryScreenLoading,
    arrPendingDeliveryInfo,
    collectorCode,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getPendingDeliveryList,
      getDeliveryList,
    },
    dispatch,
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(DeliveryTabs);

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyContainer: {
    flexDirection: 'column',
    // paddingTop: 30,
  },
  subContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: '#F3F3F3',
    paddingTop: 15,
  },
  imageBackground: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignSelf: 'center',
  },
  avatar: {
    width: deviceHeight / 25,
    height: deviceHeight / 25,
  },
  label: {
    alignSelf: 'center',
    padding: 8,
    fontSize: Constants.FONT_SIZE.L,
  },
  indicator: {
    width: '100%',
    height: 2,
    marginTop: 15,
    marginHorizontal: 3,
  },
});
