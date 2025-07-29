'use strict';
import React, {Component} from 'react';
import {
  Text,
  View,
  Dimensions,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {Rating, AirbnbRating} from 'react-native-ratings';
import PropTypes from 'prop-types';
import Constants from '../../util/Constants';
import LoadingScreen from '../common/LoadingScreen';

export default class RatingsView extends Component {
  static propTypes = {
    isRatingValue: PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.state = {
      titleText: '',
      isRatingValue: this.props.isRatingValue,
    };
  }

  componentDidMount() {
    this.setState({
      titleText: 'How would you like to rate the Patient?',
    });
  }

  render() {
    if (this.props.isRatingPhlebotomistLoading) {
      return <LoadingScreen />;
    } else {
      return this._renderScreen();
    }
  }

  _renderScreen() {
    return (
      <View style={styles.mainView}>
        <View style={styles.innerView}>
          <Text style={styles.titleText}>{this.state.titleText}</Text>
          <AirbnbRating
            style={styles.ratingStyle}
            count={5}
            size={20}
            showRating={false}
            selectedColor={'#126DEF'}
            isDisabled={this.props.isRatingValue > 0}
            defaultRating={this.props.isRatingValue}
            onFinishRating={(Number) => {
              this.props.onPressRating(Number);
            }}
          />
        </View>
      </View>
    );
  }
 
  _renderProfileImage = () => {
    return <View style={styles.profileImage} />;
  };
}

const styles = StyleSheet.create({
  mainView: {marginTop: 15},
  innerView: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 20,
    paddingHorizontal: 5,
  },
  titleText: {
    textAlign: 'center',
    color: 'black',
    fontSize: Constants.FONT_SIZE.M,
    marginBottom: 10,
    marginTop: 10,
  },
  ratingStyle: {},
  profileImage: {
    bottom: 80,
    position: 'absolute',
    width: 60,
    height: 60,
    alignSelf: 'center',
    borderRadius: 60 / 2,
    overflow: 'hidden',
    backgroundColor: '#D7DBDB',
  },
  flatListText: {
    marginHorizontal: 20,
    padding: 10,
    //  backgroundColor: "black",
    borderColor: '#2C5EEE',
    borderWidth: 1.0,
    color: '#2C5EEE',
    borderRadius: 10,
  },
  flatListMainView: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'center',
    // backgroundColor: "gray"
  },
});
// const mapStateToProps = (state, props) => {
//   const {
//     bookingDetailState: { isRatingPhlebotomistLoading },
//   } = state;

//   return {
//     isRatingPhlebotomistLoading,
//   };
// };

// const mapDispatchToProps = dispatch => {
//   return bindActionCreators(
//     {
//       starRatingBookingCommentsAction,
//       invokeUpdateRatings,
//     },
//     dispatch,
//   );
// };

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps,
// )(RatingsView);
