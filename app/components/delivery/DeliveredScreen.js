/*************************************************
 * SukraasLIS - Phlebotomist
 * PendingDeliveryScreen.js
 * Created by Abdul on 16/07/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/
'use strict';
import React, { Component } from 'react';
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
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import HTML from 'react-native-render-html';
import LoadingScreen from '../common/LoadingScreen';
import { getDeliveryList } from '../../actions/DeliveryScreenAction';
import PropTypes from 'prop-types';
import DeliveryRow from './DeliveryRow'
import store from '../../store'


const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;

const extractKey = ({ id }) => id;

class DeliveredScreen extends Component {
  static propTypes = {
    isPendingDeliveryScreenLoading: PropTypes.bool,
    deliveryListData: PropTypes.object,
    getDeliveryList: PropTypes.func,
    collectorCode: PropTypes.string,
  };

  constructor() {
    super();
    this.state = { isPullToRefresh: false }
  }

  internetAlert(Message) {
    Alert.alert(
      Constants.ALERT.TITLE.FAILED,
      Message,
      [
        {
          text: Constants.ALERT.BTN.OK,
          onPress: () => { },
        },
      ],
      { cancelable: false },
    );
  }
  componentDidMount() {
    if (store.getState().deviceState.isNetworkConnectivityAvailable) {
      this.focusListener = this.props.navigation.addListener('focus', () => {
        this._getAsyncAndAPICall();
      });
    } else {
      this.internetAlert(Constants.VALIDATION_MSG.NO_INTERNET);
    }
  }

  componentWillUnmount() {
    if (store.getState().deviceState.isNetworkConnectivityAvailable) {
      this.focusListener();
    }
  }

  _getAsyncAndAPICall = () => {
    let postData = {
      Filter_Type: 'C',
      Collector_Code: this.props.collectorCode,
    };
    this.props.getDeliveryList(postData, (isSuccess) => { });
  }

  render() {
    if (this.props.isPendingDeliveryScreenLoading) {
      return <LoadingScreen />;
    } else {
      if (
        this.props.deliveryListData !== undefined &&
        this.props.deliveryListData !== null &&
        this.props.deliveryListData.length > 0
      ) {
        return (
          <FlatList
            data={this.props.deliveryListData}
            renderItem={this.renderItem}
            keyExtractor={extractKey}
            onRefresh={() => this._onRefresh()}
            refreshing={this.state.isPullToRefresh}
          />
        );
      } else {
        return (
          <View style={{  backgroundColor: Constants.COLOR.WHITE_COLOR }}
            >
              <FlatList data={[]} keyExtractor={(item, index) => index.toString()} ListEmptyComponent={()=>(
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height:deviceHeight*.8}}>
              <Text style={{ color: 'black', fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR }}>No Data Found!</Text>
            </View>
              )} 
               onRefresh={() => this._onRefresh()}
               refreshing={this.state.isPullToRefresh}
              />
          </View>
        );
      }
    }
  }

  _onRefresh = () => {
    if (store.getState().deviceState.isNetworkConnectivityAvailable) {
      this.setState({
        isPullToRefresh: true
      }, () => {
        if (this.state.isPullToRefresh) {
          let postData = {
            Filter_Type: 'C',
            Collector_Code: this.props.collectorCode,
          };
          this.props.getDeliveryList(postData, isSuccess => {
            if (isSuccess) {
              this.setState({ isPullToRefresh: false })
            }
          });
        }
      })
    } else {
      this.internetAlert(Constants.VALIDATION_MSG.NO_INTERNET);
    }
  }
  renderItem = ({ item }) => {
    return (
      <View>
        <DeliveryRow
          item={item}
          isFromPending={false}
        />
      </View>

    );
  };


}
const mapStateToProps = (state, props) => {
  const {
    pendingDeliveryScreenState: {
      isPendingDeliveryScreenLoading,
      deliveryListData,
    },
    configState: { collectorCode },
  } = state;

  return {
    isPendingDeliveryScreenLoading,
    deliveryListData,
    collectorCode,
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getDeliveryList,
    },
    dispatch,
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(DeliveredScreen);

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
