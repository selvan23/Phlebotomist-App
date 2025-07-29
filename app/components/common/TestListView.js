import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import Constants from '../../util/Constants';
import Utility from '../../util/Utility';
import PropTypes from 'prop-types';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;

export default class TestListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isViewTestName: false,
    };
  }

  render() {
    return (
      <View>
        {this._renderTestListView()}
        {this.state.isViewTestName ? this._renderViewAll() : null}
      </View>
    );
  }

  _renderTestListView = () => {
    console.log(
      'this.props.bookingDetail.Service_Detail',
      this.props.bookingDetail.Service_Detail,
    );
    if (
      this.props.bookingDetail.Service_Detail !== null &&
      this.props.bookingDetail.Service_Detail !== undefined &&
      this.props.bookingDetail.Service_Detail.length !== null &&
      this.props.bookingDetail.Service_Detail.length > 0
    ) {
      return (
        <View style={styles.viewButtonMainView}>
          {this._renderfirstTestView()}
          {this._renderSecondTestView()}
          {this._renderViewBtn()}
        </View>
      );
    } else {
      return null;
    }
  };
  _renderfirstTestView = () => {
    console.log(
      'this.props.bookingDetail.Service_Detail',
      this.props.bookingDetail.Service_Detail.length,
    );
    return (
      <Text
        style={[
          styles.testNameText,
          // eslint-disable-next-line react-native/no-inline-styles
          {
            width:
              this.props.bookingDetail.Service_Detail[0].Service_Name.length >
              10
                ? deviceWidth / 4.8
                : null,
            // width:deviceWidth*3/5,
            textAlign: 'center',
          },
        ]}
        numberOfLines={1}>
        {this.props.bookingDetail.Service_Detail[0].Service_Name}
      </Text>
    );
  };

  _renderSecondTestView = () => {
    if (this.props.bookingDetail.Service_Detail.length >= 2) {
      return (
        <Text
          style={[
            styles.testNameText,
            {
              width:
                this.props.bookingDetail.Service_Detail[1].Service_Name.length >
                10
                  ? deviceWidth / 4.8
                  : null,
              left: 5,
            },
          ]}
          numberOfLines={1}>
          {this.props.bookingDetail.Service_Detail[1].Service_Name}
        </Text>
      );
    }
  };

  _renderViewBtn = () => {
    return (
      <TouchableOpacity
        style={styles.viewallBtn}
        onPress={() => {
          this.setState({isViewTestName: !this.state.isViewTestName});
        }}>
        <Text style={styles.viewallText}>
          {!this.state.isViewTestName
            ? `View all (${this.props.bookingDetail.Service_Detail.length})`
            : 'View less'}
        </Text>
      </TouchableOpacity>
    );
  };
  _renderViewAll() {
    return (
      <View style={[styles.testNameView]}>
        <ScrollView nestedScrollEnabled={true}>
          <FlatList
            data={this.props.bookingDetail.Service_Detail}
            renderItem={this._renderViewAllItem}
            keyExtractor={(item) => item.id}
          />
        </ScrollView>
      </View>
    );
  }

  _renderViewAllItem = ({item}) => {
    return (
      <View style={styles.viewAllItemView}>
        <Text style={styles.viewAllListItemText}>{item.Service_Name}</Text>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  viewAllItemView: {padding: 5, flex: 1},
  viewAllListItemText: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    backgroundColor: Constants.COLOR.BUTTON_BG,
    borderRadius: 5,
    color: Constants.COLOR.WHITE_COLOR,
  },
  testNameView: {
    marginStart: 100,
    marginHorizontal: 15,
    marginBottom: 10,
    backgroundColor: Constants.COLOR.SCREEN_BG,
    borderRadius: 10,
  },
  testNameText: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    backgroundColor: Constants.COLOR.BUTTON_BG,
    borderRadius: 5,
    color: Constants.COLOR.WHITE_COLOR,
  },
  viewButtonMainView: {
    marginTop: 15,
    marginBottom: 15,
    flexDirection: 'row',
    marginStart: deviceWidth / 3.48,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  viewallBtn: {
    flex: 1,
    paddingHorizontal: 5,
  },
  viewallText: {
    alignSelf: 'flex-end',
    fontSize: 12,
    color: 'blue',
  },
});
