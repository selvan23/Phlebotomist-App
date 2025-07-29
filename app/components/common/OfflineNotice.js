/*************************************************
 * SukraasLIS
 * OfflineNotice.js
 * Created by Sankar on 8/07/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';

import React, { PureComponent } from 'react';
import { View, Text, NetInfo, Dimensions, StyleSheet } from 'react-native';
const { width } = Dimensions.get('window');

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

function MiniOfflineSign() {
  console.log('mini offlin sifgn')
  return (
    <View style={styles.offlineContainer}>
      <Text style={styles.offlineText}>No Internet Connection</Text>
    </View>
  );
}
function MiniLocationSign({ message }) {
  console.log('minin locat sign', message);
  return (
    <View style={styles.offlineContainer}>
      <Text style={styles.offlineText}>
        {message}
      </Text>
    </View>
  );
}
class OfflineNotice extends PureComponent {
  render() {
    console.log("Location Alertt %***************  ", this.props.locationAlert)
    console.log('offline ', this.props.isNetworkConnectivityAvailable, this.props.isLocationEnable, this.props.isLoggedIn)
    if (
      this.props.isNetworkConnectivityAvailable !== undefined &&
      !this.props.isNetworkConnectivityAvailable
    ) {
      console.log('no network');
      return (

        <MiniOfflineSign />
      );
    } else if (
      this.props.isLocationEnable !== undefined &&
      !this.props.isLocationEnable && this.props.isLoggedIn
    ) {
      console.log('no location enabled')
      return (
        <MiniLocationSign message={this.props.locationAlert} />
      )
    } else {
      console.log('nothing at all');
      return <></>;
    }
  }
}
const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: '#b52424',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width,
    position: 'absolute',
    top: 50,
  },
  offlineText: {
    color: '#fff',
  },
});

const mapStateToProps = (state, ownProps) => {
  const {
    deviceState: {
      isNetworkConnectivityAvailable,
      isLocationEnable,
      isLoggedIn,
      locationAlert
    },
  } = state;

  return {
    isNetworkConnectivityAvailable,
    isLocationEnable,
    isLoggedIn,
    locationAlert
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(OfflineNotice);
