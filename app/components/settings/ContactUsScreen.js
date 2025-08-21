/*************************************************
 * SukraasLIS
 * @exports
 * @class ContactUsScreen.js
 * @extends Component
 * Created by Monisha on 17/07/2020
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
  Platform,
} from 'react-native';
import Constants, {COLOR} from '../../util/Constants';
import Utility from '../../util/Utility';
import ButtonBack from '../common/ButtonBack';
import LoadingScreen from '../common/LoadingScreen';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getContactDetails} from '../../actions/ContactAction';
import { IconOutline } from '@ant-design/icons-react-native';
import LinearGradient from 'react-native-linear-gradient';

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class ContactUsScreen extends Component {
  static propTypes = {
    isContactScreenLoading: PropTypes.bool,
    arrContactInfo: PropTypes.array,
    getContactDetails: PropTypes.func,
  };

  constructor() {
    super();
    this.state = {
      btnBackDisabled: false,
    };
  }

  dialCall() {
    console.log('=====dialCall');
    let phoneNumber = '';
    let number = this.props.arrContactInfo[0].Mobile_No;
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }
    Linking.openURL(phoneNumber);
  }

  componentDidMount() {
    this.props.getContactDetails();
  }

  _showDescription = () => {
    if (this.props.arrContactInfo.length > 0) {
      return (
        <Text style={styles.message}>
          {this.props.arrContactInfo[0].Short_Description}
        </Text>
      );
    } else {
      return (
        <Text style={styles.message}>
          Our customer service center will be available from 6am to 6pm
        </Text>
      );
    }
  };

  _renderContentView() {
    return (
      <View style={styles.contentContainer}>
        <View style={styles.phoneImageStyleView}>
          <View style={{padding: 20, borderRadius: 60, backgroundColor: Constants.COLOR.LIGHT_GREY, alignItems: 'center', justifyContent: 'center'}}>
          <IconOutline color={Constants.COLOR.PRIMARY_COLOR} size={60} name='customer-service' />
          </View>
        </View>
        {this._showDescription()}

        <TouchableOpacity
          style={styles.callUsButton}
          onPress={() => {
            this.dialCall();
          }}>
            <LinearGradient
            colors={["#1E3989", "#9B71AA", "#87C699"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Text style={styles.gradientButtonText}>Call us</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }
  render() {
    if (this.props.isContactScreenLoading) {
      return <LoadingScreen />;
    } else {
      return (
        <View style={styles.container}>
          {this._renderContentView()}
        </View>
      );
    }
  }
}

const mapStateToProps = (state, props) => {
  const {
    contactScreenState: {isContactScreenLoading, arrContactInfo},
  } = state;

  return {
    isContactScreenLoading,
    arrContactInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getContactDetails,
    },
    dispatch,
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactUsScreen);
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tableViewContainer: {
    flex: 1,
    padding: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    paddingHorizontal: 25,
    textAlign: 'center',
    fontSize: Constants.FONT_SIZE.L,
    color: Constants.COLOR.FONT_HINT,
    paddingVertical: 15,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_SEMI_BOLD
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Constants.COLOR.BACKGROUND_COLOR_SCREEN,
  },
  phoneImageStyleView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  phoneImageStyle: {
    width: 80,
    height: 80,
  },
  callUsButton: {
    width: 200,
    marginTop: 20
  },
  backButton: {
    zIndex: 1,
    position: 'absolute',
    bottom: 20,
    left: 15,
  },
  gradientButton: {
    borderRadius: 10,
    justifyContent: 'center',
    width: '100%',
    height: 45,
    alignItems:'center',
    paddingHorizontal: 15
  },
  gradientButtonText: {
    color: Constants.COLOR.WHITE_COLOR,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_SEMI_BOLD
  },
});
