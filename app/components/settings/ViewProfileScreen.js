/*************************************************
 * SukraasLIS
 * @exports
 * @class ViewProfileScreen.js
 * @extends Component
 * Created by Monisha on 17/07/2020
 * Copyright Ā© 2020 SukraasLIS. All rights reserved.
 *************************************************/
"use strict";
import React, { Component } from "react";

import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  Platform,
  Keyboard,
  View,
  Modal,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import LoadingScreen from "../common/LoadingScreen";
import Constants from "../../util/Constants";
import Utility from "../../util/Utility";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import DatePicker from 'react-native-datepicker';
import DatePicker from "react-native-datepicker";
import ButtonBack from "../common/ButtonBack";
import {
  getProfileDetails,
  updateProfileDetails,
} from "../../actions/ProfileAction";
import { setProfileImage } from "../../actions/ConfigAction";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import DeviceInfo from "react-native-device-info";
import Permissions from "react-native-permissions";
import HTML from "react-native-render-html";
import moment from "moment";
import { nativationPop, navigate } from "../../rootNavigation";

const deviceWidth = Dimensions.get("window").width;

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get("window").height;

let ProfileName = "";
const options = {
  title: "Select Avatar",
  storageOptions: {
    skipBackup: true,
    path: "images",
    mediaType: "photo",
  },
};
class ViewProfileScreen extends Component {
  static propTypes = {
    isProfileLoading: PropTypes.bool,
    getProfileDetails: PropTypes.func,
    updateProfileDetails: PropTypes.func,
    profileDetails: PropTypes.string,
    isEditable: PropTypes.bool,
    visible: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      userName: "",
      referralCode: "",
      password: "",
      dob: "",
      isEditable: false,
      userImageUrl: "",
      phoneNumber: "",
      fileData: "",
      fileType: "",
      fileUri: "",
      fileName: "",
      isRemoveProfilePicture: "false",
      aboutCollector: "",
      imageLoading: false,
      isDatePickerOpen: false,
    };
  }
  async componentWillMount() {
    const value1 = await AsyncStorage.getItem(Constants.ASYNC.ASYNC_USER_NAME);
    if (value1) {
      this.setState({
        userName: value1,
      });
    }
    this.props.getProfileDetails(this.state.userName);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.profileDetails !== this.props.profileDetails) {
      let url = "";
      if (this.props.profileDetails.Collector_Profile_Image_Url !== "") {
        url = `${
          this.props.profileDetails.Collector_Profile_Image_Url
        }?t=${new Date().getTime()}`;
      } else {
        url = this.props.profileDetails.Collector_Profile_Image_Url;
      }
      console.log("url", url);
      this.setState({
        name: this.props.profileDetails.Collector_Name,
        dob: moment(this.props.profileDetails.DOB, "YYYY/MM/DD").format(
          "DD/MM/YYYY"
        ),
        email: this.props.profileDetails.Email_Id,
        phoneNumber: this.props.profileDetails.Mobile_No,
        userImageUrl: url,
        aboutCollector: this.props.profileDetails.About_Collector,
      });
      ProfileName = this.props.profileDetails.Collector_Name;
      AsyncStorage.setItem(
        Constants.ASYNC.ASYNC_USER_IMAGE_URL,
        this.props.profileDetails.Collector_Profile_Image_Url
      );
    }
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        {this._renderScreens()}
      </View>
    );
  }

  _renderScreens = () => {
    if (this.props.isProfileLoading) {
      return this._screenLoading();
    } else {
      return this._renderBodyView();
    }
  };

  _screenLoading = () => {
    return <LoadingScreen />;
  };

  handlePassword = (text) => {
    Alert.alert(
      "Password Change",
      "Do You Want To Change Password",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            this._navigateVerificationScreen;
          },
        },
      ],
      {
        cancelable: false,
      }
    );
  };

  _closeAlert = () => {
    Alert.alert(
      "Info",
      "Do You Want To Discard Changes?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            // Actions.pop();
            nativationPop();
          },
        },
      ],
      {
        cancelable: false,
      }
    );
  };

  _navigateVerificationScreen = () => {
    // Actions.VerificationScreen({
    //   isResetPassword: true,
    // });
    navigate("VerificationScreen", {
      isResetPassword: true,
    });
  };

  _validateInputs = () => {
    if (this.state.name.trim().length < 1) {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.NO_NAME
      );
    } else if (
      this.state.dob === undefined ||
      this.state.dob === null ||
      this.state.dob.trim().length < 1
    ) {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.NO_DOB
      );
    } else if (
      this.state.email.trim().length < 1 ||
      this._validateEmail(this.state.email) === false
    ) {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.INVALID_EMAIL
      );
    } else {
      this._updateButtonClick();
    }
  };

  _validateEmail = (text) => {
    if (text.trim().length > 0) {
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (reg.test(text) === false) {
        console.log("Email is Not Correct");
        return false;
      } else {
        console.log("Email is Correct");
        return true;
      }
    } else {
      return true;
    }
  };

  _updateButtonClick = () => {
    let pictureExtension = "";
    if (this.state.fileType !== "") {
      pictureExtension = this.state.fileType.split("/")[1];
    } else {
      pictureExtension = "";
    }
    const Dob_Format = moment(this.state.dob, "DD/MM/YYYY").format(
      "YYYY/MM/DD"
    );
    let postData = {
      Collector_Profile_Picture: this.state.fileUri,
      Picture_Extension: pictureExtension,
      Collector_Name: this.state.name,
      UserName: this.state.userName,
      Mobile_No: this.state.phoneNumber,
      Dob: Dob_Format,
      Email_Id: this.state.email,
      IsRemove_Profile_Picture: this.state.isRemoveProfilePicture,
      profileImageName: this.state.fileName,
    };

    let body = new FormData();
    body.append("Collector_Name", this.state.name);
    body.append("UserName", this.state.userName);
    body.append("Dob", Dob_Format);
    body.append("Mobile_No", this.state.phoneNumber);
    body.append("Email_Id", this.state.email);
    if (this.state.isRemoveProfilePicture === "true") {
      body.append("Collector_Profile_Picture", "");
    } else {
      if (
        postData.Collector_Profile_Picture !== undefined &&
        postData.Collector_Profile_Picture.length > 0
      ) {
        body.append("Collector_Profile_Picture", {
          uri:
            Platform.OS == "ios"
              ? postData.Collector_Profile_Picture?.replace("file://", "/")
              : postData.Collector_Profile_Picture,
          name: "Collector_Profile_Picture",
          filename: postData.profileImageName,
          type: "image/" + postData.Picture_Extension,
        });
      } else {
        body.append("Collector_Profile_Picture", "");
      }
    }

    body.append("Picture_Extension", postData.Picture_Extension);
    body.append("IsRemove_Profile_Picture", this.state.isRemoveProfilePicture);

    console.log("Body Data  ", body);

    this.props.updateProfileDetails(body, (isSuccess, urlProfile) => {
      if (isSuccess) {
        this.setState({
          isEditable: false,
        });

        AsyncStorage.setItem(Constants.ASYNC.ASYNC_USER_IMAGE_URL, urlProfile);
        this.props.setProfileImage(urlProfile);
      }
    });
  };

  _navigateDashboardScreen = () => {
    // Actions.homeTabBar();
    navigate("homeTabBar");
  };
  _chooseImageAlert = () => {
    Alert.alert(
      "Upload Profile Picture",
      "Upload your profile picture Using?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Gallery",
          onPress: () => {
            this._openGallery();
          },
        },
        {
          text: "Camera",
          onPress: () => {
            this._clickPicture();
          },
        },
      ],
      {
        cancelable: false,
      }
    );
  };

  _clickPicture = () => {
    if (Platform.OS === "ios") {
      this._launchCamera();
    } else {
      const systemVersion = DeviceInfo.getSystemVersion();
      if (parseFloat(systemVersion) >= 6) {
        Permissions.check("android.permission.CAMERA").then((response) => {
          console.log(response);
          if (response === "granted") {
            this._launchCamera();
          } else {
            Permissions.request("android.permission.CAMERA").then(
              (permission) => {
                if (permission === "granted") {
                  this._launchCamera();
                } else {
                  Alert.alert("Please Allow access to Take Picture");
                }
              }
            );
          }
        });
      } else {
        // Actions.QRScanner();
      }
    }
  };
  _launchCamera = () => {
    launchCamera(options, (response) => {
      console.log("Launch Camera");
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
        Alert.alert(response.customButton);
      } else {
        const fileData = {
          fileUri: response.assets[0].uri,
          type: response.assets[0].type,
          fileName: response.assets[0].fileName,
        };
        if (this.props.profileUploadSize !== "") {
          if (this.props.profileUploadSize >= response.assets[0].fileSize) {
            this.setState(
              {
                fileData,
                fileUri: response.assets[0].uri,
                userImageUrl: response.assets[0].uri,
                fileType: response.assets[0].type,
                fileName: response.assets[0].fileName,
                isRemoveProfilePicture: "false",
              },
              () => {
                console.log("Profile updated");
              }
            );
          } else {
            Utility.showAlert(
              Constants.ALERT.TITLE.ERROR,
              "File size should be less than " + this._convertByteToMB()
            );
          }
        } else {
          this.setState(
            {
              fileData,
              userImageUrl: response.assets[0].uri,
              fileType: response.assets[0].type,
              fileUri: response.assets[0].uri,
              fileName: response.assets[0].fileName,
              isRemoveProfilePicture: "false",
            },
            () => {
              console.log("Profile updated");
            }
          );
        }
      }
    });
  };

  _openGallery = () => {
    if (Platform.OS === "ios") {
      this._chooseGallery();
    } else {
      const systemVersion = DeviceInfo.getSystemVersion();
      if (parseFloat(systemVersion) >= 6) {
        Permissions.check("android.permission.CAMERA").then((response) => {
          console.log(response);
          if (response === "granted") {
            this._chooseGallery();
          } else {
            Permissions.request("android.permission.CAMERA").then(
              (permission) => {
                if (permission === "granted") {
                  this._chooseGallery();
                } else {
                  Alert.alert("Please Allow access to open Gallery");
                }
              }
            );
          }
        });
      } else {
        // Actions.QRScanner();
      }
    }
  };

  _chooseGallery = () => {
    launchImageLibrary(options, (response) => {
      console.log("response", response);
      console.log("respo filedata", {
        fileData: response.assets[0],
        userImageUrl: response.assets[0].uri,
        fileType: response.assets[0].type,
        fileUri: response.assets[0].uri,
        fileName: response.assets[0].fileName,
        isRemoveProfilePicture: "false",
      });
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        const fileData = {
          fileUri: response.assets[0].uri,
          type: response.assets[0].type,
          fileName: response.assets[0].fileName,
        };
        if (this.props.profileUploadSize !== "") {
          if (this.props.profileUploadSize >= response.assets[0].fileSize) {
            let path = response.assets[0].uri;
            if (Platform.OS === "ios") {
              path = "~" + path.substring(path.indexOf("/Documents"));
            }
            if (!response.assets[0].fileName) {
              response.assets[0].fileName = path.split("/").pop();
            }
            this.setState(
              {
                fileData,
                userImageUrl: response.assets[0].uri,
                fileType: response.assets[0].type,
                fileUri: response.assets[0].uri,
                fileName: response.assets[0].fileName,
                isRemoveProfilePicture: "false",
              },
              () => {
                console.log("Profile updated");
              }
            );
          } else {
            Utility.showAlert(
              Constants.ALERT.TITLE.ERROR,
              "File size should be less than " + this._convertByteToMB()
            );
          }
        } else {
          this.setState(
            {
              fileData,
              userImageUrl: response.uri,
              fileType: response.type,
              fileUri: response.uri,
              fileName: response.fileName,
              isRemoveProfilePicture: "false",
            },
            () => {
              console.log("Profile updated");
            }
          );
        }
      }
    });
  };

  _convertByteToMB = () => {
    var bytes = this.props.profileUploadSize;
    var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) {
      return "0 Byte";
    }
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
  };

  _showProfileView = () => {
    console.log("this.state.userImageUrl", this.state.userImageUrl);
    if (this.state.userImageUrl !== "") {
      return (
        <View style={{ flexDirection: "row" }}>
          <Image
            onLoadStart={() => {
              this.setState({ imageLoading: true });
            }}
            style={[styles.headerRightImage]}
            source={{
              uri: this.state.userImageUrl,
            }}
            onLoadEnd={() => {
              this.setState({ imageLoading: false });
            }}
          />
          <ActivityIndicator
            color="red"
            style={styles.activityIndicator}
            animating={this.state.imageLoading}
          />
          {this.state.isEditable ? (
            <TouchableOpacity onPress={() => this._onPressRemoveProfile()}>
              <Image
                style={{ width: 20, height: 20 }}
                source={require("../../images/black_cross.png")}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      );
    } else {
      return (
        <Image
          style={styles.headerRightImage}
          source={require("../../images/profileImg.png")}
        />
      );
    }
  };

  _onPressRemoveProfile = () => {
    this.setState({
      isRemoveProfilePicture: "true",
      userImageUrl: "",
      fileName: "",
      fileUri: "",
      fileType: "",
    });
  };

  _renderBodyView = () => {
    const { name, dob, email, phoneNumber, isEditable } = this.state;
    return (
      <View style={styles.mainContainer}>
        <View style={styles.profileHeader}>
          <Text style={styles.profileText}> My Profile </Text>
          <TouchableOpacity
            style={styles.headerCloseImageView}
            onPress={() => {
              // isEditable ? this._closeAlert() : Actions.pop();
              isEditable ? this._closeAlert() : nativationPop();
            }}
          >
            <Image
              style={styles.headerCloseImage}
              resizeMode="contain"
              source={require("../../images/black_cross.png")}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />
        <KeyboardAwareScrollView style={styles.ScrollContainer}>
          <TouchableOpacity style={styles.editTextView}>
            <Text
              style={styles.editText}
              onPress={() => {
                let url = "";
                if (
                  this.props.profileDetails.Collector_Profile_Image_Url !==
                    "" &&
                  this.props.profileDetails.Collector_Profile_Image_Url !== null
                ) {
                  url = `${
                    this.props.profileDetails.Collector_Profile_Image_Url
                  }?t=${new Date().getTime()}`;
                } else {
                  url = this.props.profileDetails.Collector_Profile_Image_Url;
                }
                this.setState(
                  {
                    isEditable: !isEditable,
                    name: this.props.profileDetails.Collector_Name,
                    email: this.props.profileDetails.Email_Id,
                    userImageUrl: url,
                    phoneNumber: this.props.profileDetails.Mobile_No,
                  }
                  // () => {
                  //   this.FirstName.focus();
                  // },
                );
              }}
            >
              {this.state.isEditable === true ? (
                <Text> Cancel </Text>
              ) : (
                <Text> Edit Profile </Text>
              )}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              this.state.isEditable ? this._chooseImageAlert() : {}
            }
            style={styles.innerContainer}
          >
            <Text style={styles.headerText}>{ProfileName}</Text>
            {this._showProfileView()}
          </TouchableOpacity>
          <View style={styles.secondInnerContainer}>
            <View style={styles.innerbody}>
              <Text style={styles.bodyheaderText}> Full Name </Text>
              <TextInput
                ref={(input) => (this.FirstName = input)}
                autoCapitalize={"none"}
                value={name}
                returnKeyType={"next"}
                style={[
                  styles.bodyText,
                  { borderBottomWidth: isEditable === true ? 0.5 : 0 },
                ]}
                editable={isEditable}
                underlineColorAndroid="transparent"
                onSubmitEditing={() => this.email.focus()}
                onChangeText={(name) =>
                  this.setState({
                    name,
                  })
                }
              />
            </View>
            <View style={styles.innerbody}>
              <Text style={styles.bodyheaderText}> Password </Text>
              <TextInput
                value={"*******"}
                style={[styles.bodyText]}
                editable={false}
                onChange={this.handlePassword}
              />
            </View>
            <View style={styles.innerbody}>
              <Text style={styles.bodyheaderText}> Email </Text>
              <TextInput
                ref={(input) => (this.email = input)}
                style={[
                  styles.bodyText,
                  { borderBottomWidth: isEditable === true ? 0.5 : 0 },
                ]}
                value={email}
                editable={isEditable}
                autoCapitalize={"none"}
                underlineColorAndroid="transparent"
                returnKeyType={"done"}
                onChangeText={(email) =>
                  this.setState({
                    email,
                  })
                }
              />
            </View>
            <View style={styles.innerbody}>
              <Text style={styles.bodyheaderText}> D.O.B </Text>
              {/* <Text style={styles.bodyText}>19/05/1999</Text> */}
              {Boolean(this.state.isDatePickerOpen) && (
                <>
                  <DatePicker
                    modal={this.state.isDatePickerOpen}
                    // style={{
                    //   flex: 1,
                    //   width: deviceWidth - 50,
                    //   marginVertical: 8,
                    //   borderBottomWidth: isEditable === true ? 0.5 : 0,
                    //   borderBottomColor: '#A9A9A9',
                    // }}
                    // date={dob}
                    date={
                      new Date(moment(dob, ["DD/MM/YYYY"]).format("YYYY-MM-DD"))
                    }
                    // mode={'date'}
                    // showIcon={false}
                    // disabled={!isEditable}
                    // maxDate={new Date()}
                    // placeholderTextColor={Constants.COLOR.FONT_HINT}
                    // format={'DD/MM/YYYY'}
                    // confirmBtnText={'Done'}
                    cancelBtnText={"Cancel"}
                    onConfirm={(date) => {
                      const dt = moment(date).format("DD/MM/YYYY");
                      this.setState({
                        dob: dt,
                        isDatePickerOpen: false,
                      });
                    }}
                    onCancel={() => {
                      this.setState({
                        isDatePickerOpen: false,
                      });
                    }}
                    // onDateChange={(dob) => {
                    //   this.setState({
                    //     dob,
                    //   });
                    // }}
                    // customStyles={{
                    //   placeholderText: {
                    //     fontSize: Constants.FONT_SIZE.M,
                    //     color: Constants.COLOR.FONT_HINT,
                    //   },
                    //   dateText: {
                    //     fontSize: Constants.FONT_SIZE.M,
                    //   },
                    //   dateInput: {
                    //     paddingVertical: deviceHeight / 133.4,
                    //     borderWidth: 0,
                    //     alignItems: 'flex-start',
                    //   },
                    //   disabled: {
                    //     backgroundColor: '#eef3fd',
                    //   },
                    // }}
                  />
                </>
              )}
            </View>
            <View style={styles.innerbody}>
              <Text style={styles.bodyheaderText}> Remarks </Text>
              <View style={{ marginLeft: 4 }}>
                <HTML
                  baseStyle={{ color: "black" }}
                  source={{
                    html: this.state.aboutCollector,
                  }}
                />
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              this.state.isEditable
                ? this._validateInputs()
                : this._navigateDashboardScreen();
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>
              {this.state.isEditable === true ? (
                <Text> Update </Text>
              ) : (
                <Text> Home </Text>
              )}
            </Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </View>
    );
  };
}

const mapStateToProps = (state, props) => {
  //props can be called as ownProps

  const {
    profileState: { isProfileLoading, profileDetails },
    configState: { profileUploadSize },
  } = state;

  return {
    isProfileLoading,
    profileDetails,
    profileUploadSize,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getProfileDetails,
      updateProfileDetails,
      setProfileImage,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewProfileScreen);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#eef3fd",
  },
  ScrollContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  innerContainer: {
    flexDirection: "row",
    // marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  secondInnerContainer: {
    flexDirection: "column",
    marginHorizontal: 10,
    paddingTop: 20,
  },
  innerbody: {
    marginVertical: 8,
  },
  headerText: {
    flex: 3,
    color: "#757677",
    fontSize: Constants.FONT_SIZE.XXXL,
    marginHorizontal: 5,
  },
  bodyheaderText: {
    fontSize: Constants.FONT_SIZE.M,
    color: "#fb5861",
    marginRight: 50,
  },
  bodyText: {
    fontSize: Constants.FONT_SIZE.M,
    color: "black",
    // marginRight: 50,
    marginVertical: 8,
    // marginTop: 2,
    borderBottomColor: "#A9A9A9",
  },
  header: {
    flexDirection: "row",
    flex: 1,
    paddingTop: 30,
  },
  button: {
    backgroundColor: "#040619",
    alignItems: "center",
    borderRadius: 25,
    width: deviceWidth / 3.9,
    marginTop: 15,
    alignSelf: "center",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOpacity: 1.0,
    elevation: 6,
    shadowRadius: 15,
    marginBottom: 15,
  },
  buttonText: {
    fontSize: Constants.FONT_SIZE.S,
    paddingVertical: 10,
    color: "#FFFFFF",
  },

  headerRightImage: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    alignSelf: "flex-end",
    alignContent: "flex-end",
    width: deviceHeight / 8,
    height: deviceHeight / 8,
    borderRadius: 50,
  },

  headerContainer: {
    //marginTop: 5,
    //  marginLeft: 5,
    // marginBottom: 2,
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    alignItems: "center",
    height: 60,
  },
  profileText: {
    fontSize: Constants.FONT_SIZE.L,
    color: "#757677",
    fontWeight: "bold",
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#757677",
  },
  headerCloseImageView: { padding: 10 },
  headerCloseImage: {
    width: 20,
    height: 20,
    marginRight: 15,
  },
  editTextView: {
    textAlign: "right",
    alignContent: "flex-end",
    alignItems: "flex-end",
    alignSelf: "flex-end",
    padding: 10,
  },
  editText: {
    color: "#1E75C0",
    textAlign: "right",
    alignContent: "flex-end",
    alignItems: "flex-end",
    alignSelf: "flex-end",
  },
  calenderContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  calenderSubContainer: {
    width: deviceWidth / 1.2,
    height: deviceWidth / 1.3,
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    borderColor: Constants.COLOR.WHITE_COLOR,
    elevation: 2,
  },
  backButton: {
    zIndex: 1,
    position: "absolute",
    bottom: 20,
    left: 15,
  },
  homeButtonImage: {
    height: 20,
    width: 20,
    marginHorizontal: 5,
  },
  activityIndicator: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
