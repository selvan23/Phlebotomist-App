/*************************************************
 * SukraasLIS
 * Constants.js
 * Created by Sankar on 8/07/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

"use strict";

/**
 * Returns all the constants used in the application
 * Separate constants according to the category and usage
 */
module.exports = {
  SCREEN_SIZE: {
    PLUS_SIZE: 667,
  },
  ACTIONS: {
    //Common Actions
    NETWORK_STATUS_CHANGED: "NETWORK_STATUS_CHANGED",
    APP_GOES_TO_BACKGROUND: "APP_GOES_TO_BACKGROUND",
    GPS_LOCATION_CHANGE: "GPS_LOCATION_CHANGE",
    LOGIN_SUCCESS_CHECK: "LOGIN_SUCCESS_CHECK",
    GPS_LOCATION_MESSAGE: "GPS_LOCATION_MESSAGE",

    //Splash Screen Actions
    SPLASH_SHOW_LOADING: "SPLASH_SHOW_LOADING",
    SPLASH_HIDE_LOADING: "SPLASH_HIDE_LOADING",
    SPLASH_ERROR_UPDATE: "SPLASH_ERROR_UPDATE",

    //Register Screen Action
    REGISTER_SHOW_LOADING: "REGISTER_SHOW_LOADING",
    REGISTER_HIDE_LOADING: "REGISTER_HIDE_LOADING",

    //Login Screen Actions
    LOGIN_SHOW_PAGE_LOADING: "LOGIN_SHOW_PAGE_LOADING",
    LOGIN_HIDE_PAGE_LOADING: "LOGIN_HIDE_PAGE_LOADING",
    LOGIN_SHOW_LOADING: "LOGIN_SHOW_LOADING",
    LOGIN_HIDE_LOADING: "LOGIN_HIDE_LOADING",
    FORGET_PWD_SHOW_LOADING: "FORGET_PWD_SHOW_LOADING",
    FORGET_PWD_HIDE_LOADING: "FORGET_PWD_HIDE_LOADING",

    //Collection Screen
    COLLECTION_SCREEN_SHOW_LOADING: "COLLECTION_SCREEN_SHOW_LOADING",
    COLLECTION_SCREEN_HIDE_LOADING: "COLLECTION_SCREEN_HIDE_LOADING",
    GET_COLLECTION_BOOKING_LIST: "GET_COLLECTION_BOOKING_LIST",
    GET_CASH_COLLECTED_USER_DETAILS: " GET_CASH_COLLECTED_USER_DETAILS",
    //ShowCalenderPopUp Loading
    SHOW_CALENDER_LOADING: "SHOW_CALENDER_LOADING",
    HIDE_CALENDER_LOADING: "HIDE_CALENDER_LOADING",

    //Submit Password
    SET_PASSWORD_SHOW_LOADING: "SET_PASSWORD_SHOW_LOADING",
    SET_PASSWORD_HIDE_LOADING: "SET_PASSWORD_HIDE_LOADING",
    //Verify OTP Screen Actions
    OTP_VERIFY_SHOW_LOADING: "OTP_VERIFY_SHOW_LOADING",
    OTP_VERIFY_HIDE_LOADING: "OTP_VERIFY_HIDE_LOADING",
    OTP_RESEND_SHOW_LOADING: "OTP_RESEND_SHOW_LOADING",
    OTP_RESEND_HIDE_LOADING: "OTP_RESEND_HIDE_LOADING",
    //cancel Deny pop up Action
    SHOW_POSTMESSAGE_LOADING: "SHOW_POSTMESSAGE_LOADING",
    HIDE_POSTMESSAGE_LOADING: "HIDE_POSTMESSAGE_LOADING",
    GET_CALENDER_DATE: " GET_CALENDER_DATE",

    //About Screen
    SHOW_ABOUTSCREEN_LOADING: "SHOW_ABOUTSCREEN_LOADING",
    HIDE_ABOUTSCREEN_LOADING: "HIDE_ABOUTSCREEN_LOADING",
    GET_ABOUTSCREEN_INFO: "GET_ABOUTSCREEN_INFO",

    //Contact Screen
    SHOW_CONTACT_SCREEN_LOADING: "SHOW_CONTACT_SCREEN_LOADING",
    HIDE_CONTACT_SCREEN_LOADING: "HIDE_CONTACT_SCREEN_LOADING",
    GET_CONTACT_SCREEN_INFO: "GET_CONTACT_SCREEN_INFO",
    GET_CONTACT_MOBILE_NO: "GET_CONTACT_MOBILE_NO",

    // Profile Screeen related
    PROFILE_SHOW_LOADING: "PROFILE_SHOW_LOADING",
    PROFILE_HIDE_LOADING: "PROFILE_HIDE_LOADING",
    GET_PROFILE_DETAILS: "GET_PROFILE_DETAILS",

    //Config Action
    CONFIG_SET_DEVICE_INFO_DATA: "CONFIG_SET_DEVICE_INFO_DATA",
    UPDATE_ONE_SIGNAL_DETAILS: "UPDATE_ONE_SIGNAL_DETAILS",

    CONFIG_SET_CURRENCY: "CONFIG_SET_CURRENCY",
    CONFIG_SET_FIRM_NAME: "CONFIG_SET_FIRM_NAME",
    CONFIG_SET_FIRM_NO: "CONFIG_SET_FIRM_NO",
    CONFIG_SET_UPLOAD_SIZE: "CONFIG_SET_UPLOAD_SIZE",
    CONFIG_SET_PROFILE_UPLOAD_SIZE: "CONFIG_SET_PROFILE_UPLOAD_SIZE",
    CONFIG_SET_MOBILE_NO: "CONFIG_SET_MOBILE_NO",
    CONFIG_SET_USER_NAME: "CONFIG_SET_USER_NAME",
    CONFIG_SHOW_LOADING: "CONFIG_SHOW_LOADING",
    CONFIG_HIDE_LOADING: "CONFIG_HIDE_LOADING",
    USER_PROFILE_IMAGE: "USER_PROFILE_IMAGE",
    CONFIG_SET_COLLECTOR_CODE: "CONFIG_SET_COLLECTOR_CODE",
    CONFIG_SET_COLLECTOR_OTP_MANDATORY: "CONFIG_SET_COLLECTOR_OTP_MANDATORY",
    CONFIG_PHONEPE_URL: "CONFIG_PHONEPE_URL",
    //LOGOUT
    LOGOUT_USER: "LOGOUT_USER",

    // Schedule Module
    // Pending screen
    SHOW_PENDING_SCREEN_LOADING: "SHOW_PENDING_SCREEN_LOADING",
    HIDE_PENDING_SCREEN_LOADING: "HIDE_PENDING_SCREEN_LOADING",
    SHOW_PDF_LOADING: "SHOW_PDF_LOADING",
    HIDE_PDF_LOADING: "HIDE_PDF_LOADING",
    SET_PENDING_DATE: "SET_PENDING_DATE",
    SET_CANCELED_DATE: "SET_CANCELED_DATE",
    SET_COMPLETED_DATE: "SET_COMPLETED_DATE",
    GET_BOOKING_LISTS: "GET_BOOKING_LISTS",
    SET_BOOKING_TO_INITIAL: "SET_BOOKING_TO_INITIAL",
    GET_BOOKING_DETAIL: "GET_BOOKING_DETAIL",
    GET_PDF_REPORT: "GET_PDF_REPORT",
    GET_TABBAR_COUNT: "GET_TABBAR_COUNT",

    SHOW_PENDING_DETAIL_SCREEN_LOADING: "SHOW_PENDING_DETAIL_SCREEN_LOADING",
    HIDE_PENDING_DETAIL_SCREEN_LOADING: "HIDE_PENDING_DETAIL_SCREEN_LOADING",

    //Cancel Booking Detail
    SHOW_CANCEL_DETAIL_SCREEN_LOADING: "SHOW_CANCEL_DETAIL_SCREEN_LOADING",
    HIDE_CANCEL_DETAIL_SCREEN_LOADING: "HIDE_CANCEL_DETAIL_SCREEN_LOADING",
    GET_CANCEL_BOOKING_DETAIL: "GET_CANCEL_BOOKING_DETAIL",

    //completed Booking Detail
    SHOW_COMPLETED_DETAIL_SCREEN_LOADING: "SHOW_COMPLETED_SCREEN_LOADING",
    HIDE_COMPLETED_DETAIL_SCREEN_LOADING: "HIDE_COMPLETED_SCREEN_LOADING",
    GET_COMPLETED_BOOKING_DETAIL: "GET_COMPLETED_BOOKING_DETAIL",

    //Sample Collection Detail
    SHOW_UPLOAD_PRESCRIPTION_LOADING: "SHOW_UPLOAD_PRESCRIPTION_LOADING",
    HIDE_UPLOAD_PRESCRIPTION_LOADING: "HIDE_UPLOAD_PRESCRIPTION_LOADING",

    //Upload Location
    SHOW_UPLOAD_LOCATION_LOADING: "SHOW_UPLOAD_LOCATION_LOADING",
    HIDE_UPLOAD_LOCATION_LOADING: "HIDE_UPLOAD_LOCATION_LOADING",

    //Pending Delivery Screen
    SHOW_PENDINGDELIVERY_LOADING: "SHOW_PENDINGDELIVERY_LOADING",
    HIDE_PENDINGDELIVERY_LOADING: "HIDE_PENDINGDELIVERY_LOADING",
    GET_PENDINGDELIVERYSCREEN_INFO: "GET_PENDINGDELIVERYSCREEN_INFO",
    GET_PENDING_DELIVERY_LIST: "GET_PENDING_DELIVERY_LIST",
    GET_DELIVERY_LIST: "GET_DELIVERY_LIST",

    SHOW_SUBMIT_BAR_CODE_LOADING: "SHOW_SUBMIT_BAR_CODE_LOADING",
    HIDE_SUBMIT_BAR_CODE_LOADING: "HIDE_SUBMIT_BAR_CODE_LOADING",

    //Sample Collection Summary
    SHOW_SAMPLE_COLLECTION_SUMMARY_SCREEN_LOADING:
      "SHOW_SAMPLE_COLLECTION_SUMMARY_SCREEN_LOADING",
    HIDE_SAMPLE_COLLECTION_SUMMARY_SCREEN_LOADING:
      "HIDE_SAMPLE_COLLECTION_SUMMARY_SCREEN_LOADING",
    SET_SAMPLE_COLLECTION_SUMMARY: "SET_SAMPLE_COLLECTION_SUMMARY",

    // delivery detail
    SHOW_DELIVERY_DETAIL_LOADING: "SHOW_DELIVERY_DETAIL_LOADING",
    HIDE_DELIVERY_DETAIL_LOADING: "HIDE_DELIVERY_DETAIL_LOADING",
    GET_DELIVERY_DETAIL_INFO: "GET_DELIVERY_DETAIL_INFO",

    //Notification
    SET_NOTIFICATION_COUNT: "SET_NOTIFICATION_COUNT",
    SHOW_NOTIFICATION_LOADING: "SHOW_NOTIFICATION_LOADING",
    HIDE_NOTIFICATION_LOADING: "HIDE_NOTIFICATION_LOADING",
    NOTIFICATION_LIST_DATA: "NOTIFICATION_LIST_DATA",
    SHOW_NOTIFICATION_UPDATE_LOADING: "SHOW_NOTIFICATION_UPDATE_LOADING",
    HIDE_NOTIFICATION_UPDATE_LOADING: "HIDE_NOTIFICATION_UPDATE_LOADING",
    UPDATE_NOTIFICATIONS: "UPDATE_NOTIFICATIONS",

    //Sos
    SOS_SHOW_LOADING: "SOS_SHOW_LOADING",
    SOS_HIDE_LOADING: "SOS_HIDE_LOADING",
    GET_SOS_DETAILS: "GET_SOS_DETAILS",

    //verification code
    SHOW_VERIFICATION_CODE_SUBMIT_LOADING:
      "SHOW_VERIFICATION_CODE_SUBMIT_LOADING",
    HIDE_VERIFICATION_CODE_SUBMIT_LOADING:
      "HIDE_VERIFICATION_CODE_SUBMIT_LOADING",
    SHOW_VERIFICATION_CODE_RESEND_LOADING:
      "SHOW_VERIFICATION_CODE_RESEND_LOADING",
    HIDE_VERIFICATION_CODE_RESEND_LOADING:
      "HIDE_VERIFICATION_CODE_RESEND_LOADING",
  },

  KEY: {
    ONE_SIGNAL_ID: "ONE_SIGNAL_ID",
  },

  SCREEN_TITLE: {
    SCHEDULE: "Schedule",
  },

  COLOR: {
    THEME_COLOR: '#1E3989',
    THEME_COLOR_2: "#3700B3",
    FONT_COLOR: "#3F3F3F",
    FONT_HINT: "#A19B9B",
    SCREEN_BG: "#F2F2F2",
    BUTTON_BG: "#1E75C0",
    WHITE_COLOR: "#FFFFFF",
    HALF_WHITE: "#fbfbfb",
    BLACK_COLOR: "#000000",

    BACKGROUND_COLOR_SCREEN: "#FAFBFB",
    FONT_COLOR_DEFAULT: "#797979",
    FONT_LINK_COLOR: "#80C0FE",
    DELIVERY_SHADOW_BG: "#676767",
    DELIVERY_PHONE_BG: "#BBBBBB",
    CALL_US_BG_COLOR: "#080913",
    CUSTOMER_CALL_BG_COLOR: "#3E3E3F",

    // Schedule
    BOOK_LEFT_SIDE_BG: "#3C3636",
    BOOK_DATE_TIME_TEXT_COLOR: "#FFFAFA",
    BOOK_ADDRESS_TEXT_COLOR: "#969696",
    BOOK_ID_TEXT_COLOR: "#808080",
    BOOK_SUBMITTED_BG: "#67CD83",
    BOOK_PENDING_BG: "#F8C55C",
    BOOK_SHADOW_BG: "#676767",
    BOOK_PAY_BG: "#0F73CA",
    BOOK_PHONE_BG: "#BBBBBB",
    PAYMENT_STATUS_ONLINE: "#5AA218",
    CASH_ON_HAND: "#F2B94B",
    GREEN_COLOR: "#36A376",
    DIVIDER_COLOR: "#808080",
    // Schedule Tabs
    PENDING_TAB: "#1E4897",
    COMPLETED_TAB: "#99CA23",
    CANCELED_TAB: "#F95B63",
    //lab summary
    LAB_SUB_TOTAL_FONT: "#3A5BA1",
    LAB_CART_VIEW: "#f7f7f7",
    LAB_TOTAL_VIEW: "#f2f2f2",
    LAB_CART_ITEM_FONT: "#6C6C6C",
    LAB_HEADER_VIEW: "#F3F3F3",
    LAB_SUMMARY_TEXT: "#676767",
    //lab summary
    PRIMARY_COLOR: '#1E3989',
  },

  FONT_SIZE_BAK: {
    BIG: 30,
    XXXL: 26,
    XXL: 23,
    XL: 20,
    L: 18,
    M: 16,
    SM: 14,
    S: 12,
    XS: 10,
    XXS: 8,
  },

  FONT_SIZE: {
    BIG: 28,
    XXXL: 24,
    XXL: 21,
    XL: 18,
    L: 16,
    M: 14,
    SM: 12,
    S: 10,
    XS: 8,
    XXS: 6,
  },

  ALERT: {
    TITLE: {
      APP_NAME: "Samiyak Phlebotomist",
      INFO: "Info",
      ERROR: "Error",
      FAILED: "Failed",
      SUCCESS: "Success",
      UPDATE_SUCCESS: "Updated Successfully",
      AUTH_FAILED: "Authentication Failure",
      WENT_WRONG: "Sorry, something went wrong",
      EXPIRED: "Logout",
    },
    BTN: {
      OK: "Ok",
      CANCEL: "Cancel",
      YES: "Yes",
      NO: "No",
    },
    MESSAGE: {
      LOGOUT_MESSAGE: "Do you want to logout?",
      DELETE_MESSAGE: "Are you sure you want to Delete this Info?",
      ENABLE_LOCATION:
        "To continue,turn on device location,Which uses location service to open Settings",
      SELECT_LOCATION: "select location from map",
      UPDATE_ADDRESS_SUCCESS: "Address updated successfully",
      ADD_ADDRESS_SUCCESS: "Address added successfully",
      CLEAR_ALL: "Are you sure that you want to clear all notification?",
      MARK_ALL: "Are you sure that you want to mark all notification as read?",
    },
  },

  VALIDATION_MSG: {
    LOGIN_VALIDATION: "Please enter valid username and password",
    ERROR_CATCH: "Request Failed",
    NO_INTERNET: "Please check your internet connectivity",
    WENT_WRONG: "We're working on it and we'll get it fixed as soon as we can",
    NO_NAME: "Name is required",
    NO_EMAIL: "Email is required",
    NO_FIRSTNAME: "First Name is required",
    NO_LASTNAME: "Last Name is required",
    NO_USERNAME: "Valid User Name is required",
    NO_EMP_ID: "Empolyee ID is required",
    NO_PASSWORD: "Need atleast 8 characters in password",
    MATCH_PASSWORD: "Password did not match",
    VALID_PASSWORD:
      "The Password should be 8 or more characters Alpha Numeric value",
    NO_DOB: "Date of Birth is required",
    NO_MOBILE_NO: "Valid Mobile Number is required",
    USER_NAME_ERROR: "Enter a valid user name",
    INVALID_EMAIL: "Invalid Email Address",
    CHECK_USERNAME_FAILED: "Unable to check username try again later",
    SIGNUP_FAILED:
      "Signup failed. Please check the provided inputs and try again",
    ALREADY_SIGNUP:
      "Already signedup. Please login using your mobile number and password",
    NOT_FOUND_SIGNUP:
      "Unable to signup. Please check the provided inputs and try again",
    NEED_DOB_SIGNUP:
      "Found a difficulty on registration. Please enter Date of Birth",
    DUPLICATE_SIGNUP:
      "Found a difficulty on registration. Please contact the support team",
    SETPASSWORD_FAILED: "Failed to save password",

    NO_OTP: "Valid OTP is required",
    OTP_RESEND_SUCCESS: "New OTP sent to the registered mobile number",
    OTP_RESEND_FAILED: "Unable to send OTP now. Please try after sometime",
    OTP_VERIFY_FAILED: "OTP verification failed. Please try again later",

    AUTH_FAILED: "The username and password you entered does not match",
    REQ_FAILED: "Request failed.",
    NO_DATA_FOUND: "No Data Found",
    QR_SCAN_FAILED: "Error in scanning the barcode. Kindly scan it again",
    NO_GENDER: "Gender is required",
    NO_RELATION: "Relation is required",
    NO_ADDRESS1: "Address Line 1 is required",
    NO_ADDRESS2: "Address Line 2 is required",
    NO_CITY: "City is required",
    NO_STATE: "State is required.",
    NO_PINCODE: "Pincode is required.",
    NO_STREET: "Street is required",
    NO_PLACE: "Place is required",
    INPUT_VALIDATION_ERROR: "Invalid username or password.",
    NO_PREFERED_LOCATION: "Preferred location is required",
    NO_ADDRESS_TYPE: "Address type is required",
    NO_PROMOTION: "No PromoCode found.",
    NO_ADDRESS: "No Address Found.Kindly add your address.",

    NO_TEST_SELECTED: "Kindly choose test or upload prescription to proceed",
    NO_DATE_TIME_SELECTED: "Kindly select Date and Time",
    NO_PATIENT_SELECTED: "Kindly select the patient to proceed",
    NO_PATIENT_ADDRESS_SELECTED:
      "Kindly select the patient and Address to proceed",
    NO_BRANCH: "Kindly select your branch",
    BRANCH_UPDATED: "Branch updated Successfully",
    UPLOAD_FILE_SIZE: "File Size too large. Kindly pick another one",
    UPLOAD_FORMAT: "Supports only image or pdf files",
    BOOKING_TIME_SLOT_ERROR:
      "Time slot not available for the selected date. Kindly select different Date",
    ADD_POST_MESSAGE: "Please post the reason for cancellation",
    PROFILE_UPDATE_SUCCESS: "Profile updated successfully",
    NO_SAMPLE_COLLECTION_UPDATE: "No sample has been verified",
    BAR_CODE_EMPTY:
      "No lab test available for collection. Kindly contact the admin",
    NO_DELIVERY_ITEM: "No delivery item selected",
    NO_BARCODE: "Kindly enter the barcode",
    DUPLICATE_BARCODE: "Barcode already assigned another sample",
  },

  HTTP_CODE: {
    SUCCESS: 200,
    INSERT_SUCESS: 201,
    AUTHENTICATION_FAILURE: 401,
    REQUIRED_MISSING: 403,
    REQUEST_TIMED_OUT_FAILURE: 500,
    INPUT_VALIDATION_ERROR: 400,
    NO_DATA_FOUND: 404,
    NO_INTERNET: 503,
    UNPROCESSABLE_ENTITY: 422,
  },

  ASYNC: {
    ASYNC_PHONE_NUMBER: "@LISphoneNumber",
    ASYNC_USER_NAME: "@LISuserName",
    ASYNC_OTP: "@LISotp",
    ASYNC_PASSWORD: "@LISpassword",
    ASYNC_LOGIN_SUCCESS: "@LISlogin_success",
    ASYNC_DEFAULT_BRANCH_NAME: "@LISdefault_branch_name",
    ASYNC_DEFAULT_FIRM_NO: "@LISdefault_firm_no",
    ASYNC_USER_IMAGE_URL: "@LISProfile_image",
    ASYNC_COLLECTOR_CODE: "@LISCollector_Code",
  },

  FONT_FAMILY: {
    FONT_FAMILY_POPPINS_REGULAR: 'Poppins-Regular',
    FONT_FAMILY_POPPINS_MEDIUM: 'Poppins-Medium',
    FONT_FAMILY_POPPINS_SEMI_BOLD: 'Poppins-SemiBold',
    FONT_FAMILY_POPPINS_BOLD: 'Poppins-Bold',
  
    FONT_FAMILY_WIX_REGULAR: 'WixMadeforText-Regular',
    FONT_FAMILY_WIX_MEDIUM: 'WixMadeforText-Medium',
    FONT_FAMILY_WIX_SEMI_BOLD: 'WixMadeforText-SemiBold',
  
    FONT_FAMILY_ANEK_LATIN_REGULAR: 'AnekLatin-Regular',
    FONT_FAMILY_ANEK_LATIN_MEDIUM: 'AnekLatin-Medium',
    FONT_FAMILY_ANEK_LATIN_SEMI_BOLD: 'AnekLatin-SemiBold',

    FONT_FAMILY_POPPINS_LIGHT: 'Poppins-Light',
  }
};