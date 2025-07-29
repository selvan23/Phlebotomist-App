import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  Modal,
  TextInput,
} from 'react-native';
import PostFeedBack from './postFeedBack';
import ButtonBack from '../common/ButtonBack';
import PostReviews from './PostReview';
import Constants from '../../util/Constants';
import Utility from '../../util/Utility';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import { nativationPop } from '../../rootNavigation';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;

export default class DenyCancelBookingPopUp extends Component {
  render() {
    return (
      <Modal transparent={true} animationType={'slide'}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            width: deviceWidth - 40,
            height: deviceHeight - 100,
            marginTop: 70,
            marginBottom: 50,
            marginHorizontal: 20,
          }}>
          <KeyboardAwareScrollView style={{}}>
            <TouchableOpacity
              style={{alignSelf: 'flex-end'}}
              // onPress={Actions.pop}
              onPress={nativationPop}
            >
              <Image
                source={require('../../images/closeImageSmall.png')}
                style={{
                  marginTop: 0,
                  width: 30,
                  height: 30,
                  alignSelf: 'flex-end',
                  marginRight: 0,
                }}
              />
            </TouchableOpacity>
            <Text
              style={{
                textAlign: 'center',
                marginTop: 20,
                fontSize: 26,
                fontWeight: '300',
                marginBottom: 10,
              }}>
              Are You sure want to cancel?
            </Text>
            <PostFeedBack />
          </KeyboardAwareScrollView>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    // backgroundColor: '#F5F5F5',
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  headingText: {
    color: 'black',
    fontSize: Constants.FONT_SIZE.M,
    fontWeight: 'bold',
  },
  commentMainView: {
    flexDirection: 'row',
    marginTop: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentTextView: {
    backgroundColor: '#D4D2D2',
    flex: 0.999,
    padding: 20,
    fontSize: 20,
    borderRadius: 10,
    height: deviceHeight / 4,
  },
  submitView: {
    fontSize: Constants.FONT_SIZE.SM,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    textAlign: 'center',
    overflow: 'hidden',
    alignSelf: 'center',
    marginLeft: 10,
  },
});
