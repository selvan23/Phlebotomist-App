/*************************************************
 * SukraasLIS
 * URL.js
 * Created by Sankar on 8/07/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

// Development Server
export const isDevelopment = true;
export const serverName = 'Dev Server';

// Stage Server Config
// export const S3URL = 'http://110.44.126.145/SamyakApp/App_Config/Live_Phlebotomist/config.json';
// export const S3URL = 'https://product.sukraa.in/MobileApp/App_Config/Stage_Phlebotomist/config.json';
 // 'http://110.44.126.145:9090/SamyakApp_Stage/App_Config/Stage_Phlebotomist/config.json';
//'http://112.133.223.241:7791/SukraaApp/App_Config/Stage_Phlebotomist/config.json';
export const S3URL = 'https://product.sukraa.in/SlimsMobile/App_Config/Collector/config.json';
 
// Live Server Config
// export const S3URL =
// 'http://110.44.126.145/SamyakApp/App_Config/Live_Phlebotomist/config.json';

export const CONTACT_US = 'Contact_Us';
export const STAFF_PROFILE = 'Staff_Profile';
export const UPDATE_PROFILE = 'Staff_Profile_Update';

export const LOGIN = 'Staff_Login';
export const OTP_SEND = 'OTP_SEND';
export const SET_PASSWORD = 'SetPassword';
export const OTP_VERIFICATION = 'OTP_Verification';

//Collection
export const GET_CASH_COLLECTION_LIST = 'Staff_Vs_Payment_Collection';
export const CONFIG = 'App_Settings';

//Collection Detail
export const UPLOAD_PRESCRIPTION = 'Upload_Prescription';
export const CHECK_BAR_CODE = 'Check_Barcode';
export const UPDATE_SAMPLE_COLLECTION = 'Sample_Collection_Update';

//Update Location
export const UPLOAD_LOCATION = 'Upload_Location';

// cancel - Deny post Booking Url
export const ACTION_ON_BOOKING = 'Action_On_Booking';

// About
export const ABOUT_US = 'About_Us';

// Schedules
export const GET_PENDING_LIST = 'Booking_Summary_Status_Count';
export const GET_PENDING_BOOKING_DETAIL = 'Order_Booking_Detail';
export const VIEW_PRESCRIPTION = 'View_Prescription';

// calender Url
export const SCHEDULED_BOOKING_DATE_RANGE = 'Scheduled_Booking_DateRange';
// Pending Delivery
export const GET_DELIVERY_LIST = 'Sample_Delivery_Status_Count';
//sample collection summary detail
export const UPDATE_RATING = 'Update_Ratings';
export const POST_REVIEW = 'Post_Reviews';
export const SAMPLE_COLLECTION_UPDATE = 'Sample_Collection_Update';
//  Delivery Detail
export const GET_DELIVERY_DETAIL = 'Sample_Delivery_Details';
export const DELIVERY_DETAIL_UPDATE = 'Sample_Delivery_Update';
// Notification
export const NOTIFICATION_COUNT = 'User_Notify_In_Count';
export const NOTIFICATION_LIST = 'User_Notify_In_List';
export const NOTIFICATION_LIST_COUNT_UPDATE = 'User_Notify_Update';

export const OTP_BOOKING_RESEND = 'Resend_Booking_Otp';
export const OTP_BOOKING_VERIFY = 'Booking_Otp_Verification';
