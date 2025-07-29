/*************************************************
 * SukraasLIS
 * @exports
 * @class PostReviews.js
 * @extends Component
 * Created by Sankar on 12/05/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import React, {Component} from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import Utility from '../../util/Utility';
import Constants from '../../util/Constants';
const deviceWidth = Dimensions.get('window').width;
import {bindActionCreators} from 'redux';
import {getSubmitReview} from '../../actions/SampleCollectionSummaryAction';
import {connect} from 'react-redux';
import Loading from '../common/Loading.js';

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;

class PostReviews extends Component {
  state = {};

  render() {
    return this._renderScreen();
  }
  _renderScreen() {
    return (
      <View style={styles.mainView}>
        <Text style={styles.headingText}>Post your Review</Text>
        <View style={[styles.commentMainView]}>
          <TextInput
            style={styles.commentTextView}
            editable={this.props.Editable}
            multiline={true}
            onChangeText={(value) => this.props.onPostChangeText(value)}
            value={this.props.postReviewValue}
          />
          <TouchableOpacity
            disabled={this.props.btnDisabled}
            onPress={() => {
              this.props.onPostClick();
            }}>
            <Text style={[
              styles.submitView,
              !this.props.btnDisabled ? {
                backgroundColor: Constants.COLOR.BUTTON_BG,
              }: {}
            ]}>Post</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: '#F5F5F5',
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  headingText: {
    color: 'black',
    fontSize: Constants.FONT_SIZE.M,
  },
  commentMainView: {
    flexDirection: 'row',
    marginTop: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentTextView: {
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    color: 'black',
    flex: 0.999,
    padding: 10,
    borderRadius: 10,
    height: deviceHeight / 8,
    textAlignVertical: 'top',
  },
  submitView: {
    fontSize: Constants.FONT_SIZE.SM,
    backgroundColor: '#DDDBDB',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    textAlign: 'center',
    overflow: 'hidden',
    alignSelf: 'center',
    marginLeft: 10,
  },
});

export default PostReviews;
