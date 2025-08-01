/*************************************************
 * SukraasLIS - Phlebotomist
 * PendingDeliveryScreen.js
 * Created by Abdul on 16/07/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/
'use strict';
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Linking,
  ScrollView,
  Platform,
  RefreshControl,
} from 'react-native';
import Constants from '../../util/Constants';
import Utility from '../../util/Utility';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import LoadingScreen from '../common/LoadingScreen';
import {getPendingDeliveryList} from '../../actions/DeliveryScreenAction';
import PropTypes from 'prop-types';
import DeliveryRow from './DeliveryRow';
import store from '../../store';
import { navigate } from '../../rootNavigation';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;

const extractKey = ({id}) => id;

class PendingDeliveryScreen extends Component {
  static propTypes = {
    isPendingDeliveryScreenLoading: PropTypes.bool,
    pendingListData: PropTypes.object,
    getPendingDeliveryList: PropTypes.func,
    collectorCode: PropTypes.string,
  };

  constructor() {
    super();
    this.state = {isPullToRefresh: false};
  }

  internetAlert(Message) {
    Alert.alert(
      Constants.ALERT.TITLE.FAILED,
      Message,
      [
        {
          text: Constants.ALERT.BTN.OK,
          onPress: () => {},
        },
      ],
      {cancelable: false},
    );
  }

  componentDidMount() {
    if (store.getState().deviceState.isNetworkConnectivityAvailable) {
      this.willFocusSubscription = this.props.navigation.addListener(
        'willFocus',
        () => {
          this._getAsyncAndAPICall();
        },
      );
    } else {
      this.internetAlert(Constants.VALIDATION_MSG.NO_INTERNET);
    }
    this._getAsyncAndAPICall();
  }

  componentWillUnmount() {
    if (store.getState().deviceState.isNetworkConnectivityAvailable) {
      this.willFocusSubscription();
    }
  }

  componentDidUpdate() {
    console.log('pending delivery screen::');
  }

  _getAsyncAndAPICall = () => {
    let postData = {
      Filter_Type: 'P',
      Collector_Code: this.props.collectorCode,
    };
    this.props.getPendingDeliveryList(postData, (isSuccess) => {
      if (isSuccess) {
      }
    });
  };

  render() {
    console.log('pending delivery list ::: ', this.props.pendingListData);
    if (this.props.isPendingDeliveryScreenLoading) {
      return <LoadingScreen />;
    } else {
      if (
        this.props.pendingListData !== undefined &&
        this.props.pendingListData !== null &&
        this.props.pendingListData.length > 0
      ) {
        return (
          <FlatList
            data={this.props.pendingListData}
            renderItem={this.renderItem}
            keyExtractor={extractKey}
            onRefresh={() => this._onRefresh()}
            refreshing={this.state.isPullToRefresh}
          />
        );
      } else {
        return (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <RefreshControl refreshing={this.state.isPullToRefresh} onRefresh={this._onRefresh}>
                <Text style={{ color: 'black' }} >No Data Found!</Text>
              </RefreshControl>
          </View>
        );
      }
    }
  }

  _navigateTipsRowListScreen = () => {
    // Actions.deliveryDetails();
    navigate('deliveryDetails');
  };

  _onRefresh = () => {
    if (store.getState().deviceState.isNetworkConnectivityAvailable) {
      this.setState(
        {
          isPullToRefresh: true,
        },
        () => {
          if (this.state.isPullToRefresh) {
            let postData = {
              Filter_Type: 'P',
              Collector_Code: this.props.collectorCode,
            };
            this.props.getPendingDeliveryList(postData, (isSuccess) => {
              if (isSuccess) {
                this.setState({isPullToRefresh: false});
              }
            });
          }
        },
      );
    } else {
      this.internetAlert(Constants.VALIDATION_MSG.NO_INTERNET);
    }
  };

  renderItem = ({item}) => {
    return (
      <View>
        <DeliveryRow item={item} isFromPending={true} />
      </View>
    );
  };
}
const mapStateToProps = (state, props) => {
  const {
    pendingDeliveryScreenState: {
      isPendingDeliveryScreenLoading,
      pendingListData,
    },
    configState: {collectorCode},
  } = state;

  return {
    isPendingDeliveryScreenLoading,
    pendingListData,
    collectorCode,
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getPendingDeliveryList,
    },
    dispatch,
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PendingDeliveryScreen);

const styles = StyleSheet.create({
  mainContainer: {
    marginVertical: 8,
    marginHorizontal: 10,
    flexDirection: 'row',
    height: deviceHeight / 5.5,
  },

  subViewContainerOne: {
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: '#f9aa2a',
    paddingHorizontal: 2,
  },

  subViewContainerTwo: {
    flex: 3,
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: '#fbfbfb',
    paddingHorizontal: 5,
  },

  nameTextStyle: {
    alignSelf: 'flex-start',
    fontSize: Constants.FONT_SIZE.SM,
    padding: 5,
    color: '#898989',
    fontWeight: 'bold',
  },

  dateTextStyle: {
    alignSelf: 'flex-start',
    fontSize: Constants.FONT_SIZE.S,
    padding: 5,
    color: '#898989',
    fontWeight: 'bold',
  },
  pendingMainView: {
    flexDirection: 'row',
    marginLeft: 10,
    flex: 1,
  },
  pendingSubViewOne: {
    flexDirection: 'row',
    alignSelf: 'center',
    flex: 1.5,
  },
  pendingSubViewTwo: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
  },
  pendingdeliverTextStyle: {
    alignSelf: 'flex-start',
    fontSize: Constants.FONT_SIZE.SM,
    padding: 5,
    color: '#898989',
  },
  phoneTextStyle: {
    padding: 5,
    color: 'white',
    fontSize: Constants.FONT_SIZE.XS,
  },
  imageStyle: {
    width: 14,
    height: 14,
    alignSelf: 'center',
  },

  tagBackground: {
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginHorizontal: 10,
    marginBottom: 5,
    flexDirection: 'row',
  },

  rowDirectionView: {
    flexDirection: 'row',
  },

  circleBackground: {
    width: 25,
    height: 25,
    borderRadius: 25 / 2,
    backgroundColor: Constants.COLOR.DELIVERY_SHADOW_BG,
  },
  timeBackground: {
    backgroundColor: Constants.COLOR.DELIVERY_SHADOW_BG,
    borderBottomStartRadius: 25,
    justifyContent: 'flex-end',
  },
  callImage: {
    width: 12,
    height: 12,
    alignSelf: 'center',
    marginTop: 5,
  },
});
