/*************************************************
 * SukraasLIS - Phlebotomist
 * UploadPrescription.js
 * Created by Shiva Sankar on 22/07/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/
'use strict';
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
} from 'react-native';
import Utility from '../../util/Utility';
import Constants from '../../util/Constants';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DeviceInfo from 'react-native-device-info';
import Permissions from 'react-native-permissions';
import LoadingScreen from '../common/LoadingScreen';
import store from '../../store';
import DocumentPicker from 'react-native-document-picker';
import { launchCamera } from 'react-native-image-picker';
// import RNFetchBlob from 'rn-fetch-blob';
import RNFetchBlob from 'react-native-blob-util';
import { nativationPop } from '../../rootNavigation';
import { IconOutline } from '@ant-design/icons-react-native';


const options = {
  title: 'Select Avatar',
  storageOptions: {
    skipBackup: true,
    path: 'images',
    mediaType: 'photo',
  },
};

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class UploadPrescription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isUploading: false,
      fileData: {},
      fileType: '',
      fileUri: '',
      fileName: '',
      closeBtnDisabled: false,
    };
  }

  render() {
    if (this.state.isUploading) {
      return <LoadingScreen />;
    } else {
      return this._renderUploadPrescriptionView();
    }
  }

  _renderUploadPrescriptionView = () => {
    return (
      <KeyboardAwareScrollView
        style={[styles.mainContainer, { paddingHorizontal: 25 }]}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            marginTop: 25,
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontSize: Constants.FONT_SIZE.XL,
              paddingVertical: 16,
              color: Constants.COLOR.BUTTON_BG,
              fontWeight: '600',
              fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_SEMI_BOLD
            }}>
            Upload Prescription
          </Text>
          <TouchableOpacity
            disabled={this.state.closeBtnDisabled}
            onPress={() => {
              this.setState({
                closeBtnDisabled: true,
              });
              this._closeClick();
              setTimeout(() => {
                this.setState({
                  closeBtnDisabled: false,
                });
              }, 1000);
            }}>
            <IconOutline style={styles.closeImageStyle} name='close' size={deviceHeight / 30} />
          </TouchableOpacity>
        </View>
        {this._renderContentView()}
      </KeyboardAwareScrollView>
    );
  };

  _renderContentView() {
    return (
      <View
        style={{
          borderRadius: 0.5,
          flex: 1,
          height: Platform.OS == 'ios' ? deviceHeight + 20 : deviceHeight - 150,
          borderStyle: 'dashed',
          borderWidth: 1,
          top: 10,
          marginBottom: 30,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Constants.COLOR.UPLOAD_FILES_BG,
        }}>
        <IconOutline name='cloud-upload' size={130} color={Constants.COLOR.THEME_COLOR} />
        <Text
          style={{
            fontSize: Constants.FONT_SIZE.XXL,
            fontWeight: '500',
            paddingVertical: 20,
            color: 'black',
            fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_SEMI_BOLD
          }}>
          BROWSE FILES HERE
        </Text>
        <Text
          style={{
            textAlign: 'center',
            fontSize: Constants.FONT_SIZE.M,
            paddingHorizontal: Platform.OS == 'ios' ? 60 : 40,
            color: 'black',
            fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR
          }}>
          Take a picture or Browse files here of browse your device
        </Text>
        <TouchableOpacity
          onPress={() => {
            this._openGallery();
          }}
          style={{
            backgroundColor: Constants.COLOR.CUSTOMER_CALL_BG_COLOR,
            marginTop: 30,
            paddingVertical: 10,
            width: deviceHeight * 0.25,
            borderRadius: 20,
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: Constants.FONT_SIZE.S,
              color: Constants.COLOR.WHITE_COLOR,
              fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR
            }}>
            BROWSE FILES
          </Text>
        </TouchableOpacity>
        <Text style={{ 
          paddingVertical: 10,
          color: Constants.COLOR.FONT_COLOR,
          fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR
          }}>or</Text>
        <TouchableOpacity
          onPress={() => {
            this._clickPicture();
          }}
          style={{
            backgroundColor: Constants.COLOR.CUSTOMER_CALL_BG_COLOR,
            paddingVertical: 10,
            width: deviceHeight * 0.25,
            borderRadius: 20,
          }}>
          <Text
            style={{
              fontSize: Constants.FONT_SIZE.S,
              color: Constants.COLOR.WHITE_COLOR,
              textAlign: 'center',
              left: Platform.OS == 'ios' ? 0 : 0,
              paddingHorizontal: 10,
              fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR
            }}>
            CLICK A PICTURE
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  _closeClick = () => {
    // Actions.pop();
    nativationPop();
  };

  _clickPicture = () => {
    if (Platform.OS === 'ios') {
      {
        this._launchCamera();
      }
    } else {
      const systemVersion = DeviceInfo.getSystemVersion();
      if (parseFloat(systemVersion) >= 6) {
        Permissions.check('android.permission.CAMERA').then((response) => {
          if (response === 'granted') {
            {
              this._launchCamera();
            }
          } else {
            Permissions.request('android.permission.CAMERA').then(
              (permission) => {
                if (permission === 'granted') {
                  {
                    this._launchCamera();
                  }
                } else {
                  Alert.alert('Please Allow access to Take Picture');
                }
              },
            );
          }
        });
      }
    }
  };

  _launchCamera = () => {
    this.setState({ isUploading: true });
    launchCamera({
      mediaType: 'photo',
      saveToPhotos: true,
      includeBase64: true,
      maxHeight: 200,
      maxWidth: 200,
    }, (response) => {
      console.log('Launch Camera');
      if (response.didCancel) {
        this.setState({ isUploading: false });
        console.log('User cancelled image picker');
      } else if (response.error) {
        this.setState({ isUploading: false });
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        this.setState({ isUploading: false });
        console.log('User tapped custom button: ', response.customButton);
        Alert.alert(response.customButton);
      } else {
        if (store.getState().configState.uploadSize !== '') {
          if (store.getState().configState.uploadSize > response.assets[0].fileSize) {
            this._updateStateData(response.assets[0]);
          } else {
            this.setState({ isUploading: false });
            Utility.showAlert(
              Constants.ALERT.TITLE.ERROR,
              'File size should be less than ' + this._convertByteToMB(),
            );
          }
        } else {
          const systemVersion = DeviceInfo.getSystemVersion();
          if (parseFloat(systemVersion) >= 6) {
            Permissions.check('android.permission.WRITE_EXTERNAL_STORAGE').then(
              (response) => {
                if (response === 'granted') {
                  {
                    this._chooseDocumented();
                  }
                } else {
                  Permissions.request(
                    'android.permission.WRITE_EXTERNAL_STORAGE',
                  ).then((permission) => {
                    if (permission === 'granted') {
                      {
                        this._chooseDocumented();
                      }
                    } else {
                      Alert.alert('Please Allow access to open Gallery');
                    }
                  });
                }
              },
            );
          }
          this._updateStateData(response.assets[0]);
        }
      }
    });
  };

  _updateStateData = (response) => {
    this.setState(
      {
        fileData: response.data,
        fileType: response.type,
        fileUri: response.uri,
        fileName: response.fileName,
      },
      () => {
        const { fileType, fileData, fileUri, fileName } = this.state;
        // Actions.pop({
        //   refresh: {
        //     fileUri: fileUri,
        //     fileType: fileType,
        //     fileData: {
        //       base64: fileData,
        //       type: fileType,
        //       fileUri: fileUri,
        //       fileName: fileName,
        //     },
        //   },
        //   timeout: 1,
        // });
        this.props.route.params.onGoBack({
          fileUri: fileUri,
          fileType: fileType,
          fileData: {
            base64: fileData,
            type: fileType,
            fileUri: fileUri,
            fileName: fileName,
          },
        });
        setTimeout(() => {
          nativationPop();
        }, 300);
      },
    );
  };

  _openGallery = () => {
    this._chooseDocumented();
    // if (Platform.OS === 'ios') {
    //   {
    //     this._chooseDocumented();
    //   }
    // } else {
    //   const systemVersion = DeviceInfo.getSystemVersion();
    //   if (parseFloat(systemVersion) >= 6) {
    //     Permissions.check('android.permission.READ_EXTERNAL_STORAGE').then(
    //       (response) => {
    //         if (response === 'granted') {
    //           {
    //             this._chooseDocumented();
    //           }
    //         } else {
    //           Permissions.request(
    //             'android.permission.READ_EXTERNAL_STORAGE',
    //           ).then((permission) => {
    //             if (permission === 'granted') {
    //               {
    //                 this._chooseDocumented();
    //               }
    //             } else {
    //               Alert.alert('Please Allow access to open Gallery');
    //             }
    //           });
    //         }
    //       },
    //     );
    //   } else {
    //     this._chooseDocumented();
    //   }
    // }
  };
  _chooseDocumented = async function () {
    this.setState({ isUploading: true });
    try {
      let res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: false
      });

      res = res[0];
      if (
        res.type === 'image/jpeg' ||
        res.type === 'image/jpg' ||
        res.type === 'image/png' ||
        res.type === 'application/tif' ||
        res.type === 'application/gif' ||
        res.type === 'application/svg' ||
        res.type === 'application/pdf'
      ) {
        if (store.getState().configState.uploadSize !== '') {
          if (store.getState().configState.uploadSize > res.size) {
            if (Platform.OS === 'ios') {
              // Actions.pop({
              //   refresh: {
              //     fileUri: res.uri,
              //     // fileType: res.type,
              //     fileData: {
              //       base64: '',
              //       type: res.type,
              //       fileUri: res.uri,
              //       fileName: res.name,
              //     },
              //   },
              //   timeout: 1,
              // });
              this.props.route.params.onGoBack({
                fileUri: res.uri,
                // fileType: res.type,
                fileData: {
                  base64: '',
                  type: res.type,
                  fileUri: res.uri,
                  fileName: res.name,
                },
              });
              setTimeout(() => {
                nativationPop();
              }, 300);
            }
            else {
              this._covertBase64(res.uri, res.type, res.name);
            }
          } else {
            this.setState({ isUploading: false });
            Utility.showAlert(
              Constants.ALERT.TITLE.ERROR,
              'File size should be less than ' + this._convertByteToMB(),
            );
          }
        } else {
          if (Platform.OS === 'ios') {
            // Actions.pop({
            //   refresh: {
            //     fileUri: res.uri,
            //     // fileType: res.type,
            //     fileData: {
            //       base64: '',
            //       type: res.type,
            //       fileUri: res.uri,
            //       fileName: res.name,
            //     },
            //   },
            //   timeout: 1,
            // });
            this.props.route.params.onGoBack({
              fileUri: res.uri,
              // fileType: res.type,
              fileData: {
                base64: '',
                type: res.type,
                fileUri: res.uri,
                fileName: res.name,
              },
            });
            setTimeout(() => {
              nativationPop();
            }, 300);
          }
          else {
            this._covertBase64(res.uri, res.type, res.name);
          }
        }
      } else {
        this.setState({ isUploading: false });
        Utility.showAlert(
          Constants.ALERT.TITLE.ERROR,
          Constants.VALIDATION_MSG.UPLOAD_FORMAT,
        );
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        this.setState({ isUploading: false });
        console.log('Documented error', err);
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  _covertBase64 = (uri, type, name) => {
    var str_array = type.split('/');
    RNFetchBlob.fs.readFile(uri, 'base64').then((data) => {
      this.setState(
        {
          fileData: data,
          fileUri: uri,
          fileType: type,
          fileName: name,
        },
        () => {
          const { fileUri, fileType, fileData, fileName } = this.state;
          // Actions.pop({
          //   refresh: {
          //     fileUri: fileUri,
          //     fileType: fileType,
          //     fileData: {
          //       base64: fileData,
          //       type: fileType,
          //       fileUri: fileUri,
          //       fileName: fileName,
          //     },
          //   },
          //   timeout: 1,
          // });
          this.props.route.params.onGoBack({
            fileUri: fileUri,
            fileType: fileType,
            fileData: {
              base64: fileData,
              type: fileType,
              fileUri: fileUri,
              fileName: fileName,
            },
          });
          setTimeout(() => {
            nativationPop();
          }, 300);
        },
      );
    });
  };

  _convertByteToMB = () => {
    var bytes = store.getState().configState.uploadSize;
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  };
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Constants.COLOR.WHITE_COLOR,
  },
  closeImageStyle: {
    alignSelf: 'flex-end',
    marginVertical: 16,
    width: deviceHeight / 35,
    height: deviceHeight / 35,
  },
  loginText: {
    color: 'white',
    fontSize: Constants.FONT_SIZE.L,
  },
  textinput: {
    flex: 1,
    color: Constants.COLOR.THEME_COLOR_2,
    padding: 5,
    fontSize: Constants.FONT_SIZE.L,
  },
});

export default UploadPrescription;
