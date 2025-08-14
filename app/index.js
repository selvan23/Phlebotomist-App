import React from 'react';
import { Dimensions, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { navigationRef } from './rootNavigation';

import SetPasswordScreen from './components/SetPasswordScreen';
import VerificationScreen from './components/VerificationScreen';

import SplashScreen from './components/SplashScreen';
import LoginScreen from './components/LoginScreen';
import DashboardScreen from './components/DashboardScreen';
import OfflineNotice from './components/common/OfflineNotice';
import NavBar from './components/common/NavigationBar';
import SettingsScreen from './components/settings/SettingsScreen';
import ViewProfileScreen from './components/settings/ViewProfileScreen';
import ContactUsScreen from './components/settings/ContactUsScreen';
import PendingScreen from './components/schedules/PendingScreen';
import CompletedScreen from './components/schedules/CompletedScreen';
import CancelledScreen from './components/schedules/CancelledScreen';
import cancelBookingDetail from './components/schedules/CancelBookingDetailScreen';
import CollectionScreen from './components/collection/CollectionScreen';
import PendingDeliveryScreen from './components/delivery/PendingDeliveryScreen';
import DeliveredScreen from './components/delivery/DeliveredScreen';
import DeliveryDetailsScreen from './components/delivery/DeliveryDetailsScreen';
import AboutScreen from './components/settings/AboutScreen';
import SchedulesTabBar from './components/schedules/SchedulesTabBar';
import DeliveryTabs from './components/delivery/DeliveryTabs';

import SampleCollectionScreen from './components/schedules/SampleCollectionScreen';
import QRScanner from './components/schedules/QRScanner';
import SampleCollectionSummary from './components/schedules/SampleCollectionSummary';

import SampleCollectionDetail from './components/schedules/SampleCollectionDetail';
import PendingDetailScreen from './components/schedules/PendingDetailScreen';

import UploadPrescription from './components/schedules/UploadPrescription';
import PdfReport from './components/schedules/PdfReport';
import CancelBookingView from './components/schedules/CancelBookingView';
import NotificationListScreen from './components/NotificationListScreen';
import CompletedBookingDetailScreen from './components/schedules/CompletedBookingDetailScreen';
import SOSScreen from './components/SOSScreen'

import schedulesTabIcon from './images/bottomTabIcons/bookings_0.png';
import schedulesTabIconActive from './images/bottomTabIcons/bookings_1.png';
import collectionTabIcon from './images/bottomTabIcons/lab_0.png';
import collectionTabIconActive from './images/bottomTabIcons/lab_1.png';
import deliveryTabIcon from './images/bottomTabIcons/trends_0.png';
import deliveryTabIconActive from './images/bottomTabIcons/trends_1.png';
import settingsTabIcon from './images/bottomTabIcons/settings_0.png';
import settingsTabIconActive from './images/bottomTabIcons/settings_1.png';
import { Screen } from 'react-native-screens';
import Constants from './util/Constants';
import Utility from './util/Utility';
import { IconOutline } from "@ant-design/icons-react-native";

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;

const deviceWidth = Dimensions.get('window').width;

const bottomBarStyles = StyleSheet.create({
    avatar: {
        // width: deviceHeight / 30,
        // height: deviceHeight / 30,
        alignSelf: 'center',
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        backgroundColor: Constants.COLOR.WHITE_COLOR,
        borderTopColor: Constants.COLOR.BOOK_PHONE_BG,
        borderTopWidth: 1,
        bottom: 0,
    },
    buttonText: {
        textAlign: 'center',
        fontSize: Constants.FONT_SIZE.S,
        marginTop: 10,
    }
});

const schedulesTabArry = [
    {
        name: 'Pending',
        component: PendingScreen,
        id: 'pendingTab',
        isShowNavBar: false,
    },
    {
        name: 'Completed',
        component: CompletedScreen,
        id: 'completedTab',
        isShowNavBar: false,
    },
    {
        name: 'Cancelled',
        component: CancelledScreen,
        id: 'cancelledTab',
        isShowNavBar: false,
    }
];

const SchedulesTabGroup = (props) => {
    return <>
        <TopTab.Navigator
            initialRouteName="Pending"
            {...props}
            tabBar={
                (props) => <SchedulesTabBar
                    {...props}
                />
            }
            tabBarPosition={'top'}
            screenOptions={{
                lazy: true,
            }}
        >
            {
                schedulesTabArry.map((item, index) => (
                    <TopTab.Screen
                        key={index}
                        name={item.id}
                        component={item.component}
                    />
                ))
            }
        </TopTab.Navigator>
    </>;
};

const deliveryTabArry = [
    {
        name: 'Pending Delivery',
        component: PendingDeliveryScreen,
        id: 'pendingDeliveryTab',
        isShowNavBar: false,
    },
    {
        name: 'Delivered',
        component: DeliveredScreen,
        id: 'deliveredScreenTab',
        isShowNavBar: false,
    },
];

const DeliveryGroupScreen = (props) => {
    return <>
        <TopTab.Navigator
            initialRouteName="pendingDeliveryTab"
            {...props}
            tabBar={
                (props) => <DeliveryTabs
                    {...props}
                />
            }
            tabBarPosition={'top'}
            screenOptions={{
                lazy: true,
            }}
        >
            {
                deliveryTabArry.map((item, index) => (
                    <TopTab.Screen
                        key={index}
                        name={item.id}
                        component={item.component}
                    />
                ))
            }
        </TopTab.Navigator>
    </>;
};

const homeTabArray = [
    {
        name: 'Schedules',
        component: SchedulesTabGroup,
        image: schedulesTabIcon,
        activeImage: schedulesTabIconActive,
        // image: './images/bottomTabIcons/bookings_0.png',
        // activeImage: './images/bottomTabIcons/bookings_1.png',
        id: 'schedulesTab',
        isShowNavBar: true,
        icon:  'calendar'
        // isShowLocation: true,
    },
    {
        name: 'Collection',
        component: CollectionScreen,
        image: collectionTabIcon,
        activeImage: collectionTabIconActive,
        id: 'collectionTab',
        isShowNavBar: true,
        isShowLocation: true,
        icon:  'dollar'
    },
    {
        name: 'Delivery',
        // component: () => <><Text>Dashboard</Text></>,
        component: DeliveryGroupScreen,
        image: deliveryTabIcon,
        activeImage: deliveryTabIconActive,
        id: 'deliveryTab',
        isShowNavBar: true,
        icon:  'line-chart'
    },
    {
        name: 'Settings',
        // component: () => <><Text>Settings</Text></>,
        // component: SettingsGroupScreen,
        component: SettingsScreen,
        image: settingsTabIcon,
        activeImage: settingsTabIconActive,
        id: 'SettingsTab',
        isShowNavBar: true,
        isShowLocation: true,
        icon:  'setting'
    }
];

const TabBarItemComponent = (props) => {
    const {
        state,
        descriptors,
        navigation,
    } = props;


    return <>
        <View
            style={{
                flexDirection: 'row'
            }}
        >
           {
            state.routes.map((route, index) => {
                const { image, activeImage, name, icon } = homeTabArray.filter((item) => item.id === route.name)[0];
                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.name,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate({
                            name: route.name,
                            merge: true,
                        });
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                      type: 'tabLongPress',
                      target: route.name,
                    });
                  };

                return (
                    <TouchableOpacity
                        onPress={onPress}
                        onLongPress={onLongPress}
                        key={index}
                        style={bottomBarStyles.button}
                    >
                        <IconOutline 
                          color={isFocused ? Constants.COLOR.PRIMARY_COLOR : Constants.COLOR.FONT_HINT } 
                          style={bottomBarStyles.avatar}
                          size={35} 
                          name={icon} 
                        />
                        <Text
                            style={[
                                bottomBarStyles.buttonText,
                                {
                                    color: isFocused ? Constants.COLOR.PRIMARY_COLOR : Constants.COLOR.FONT_HINT,
                                    fontFamily: isFocused ? Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_SEMI_BOLD : Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR,
                                }
                            ]}
                        >{name}</Text>
                    </TouchableOpacity>
                )
            })
           }
        </View>
    </>;
};

const HomeTabBarNestedRoutes = (props) => <>
    <BottomTab.Navigator
        initialRouteName="schedulesTab"
        {...props}
        tabBar={
            (props) => <TabBarItemComponent
                {...props}
                activeTintColor={Constants.COLOR.THEME_COLOR}
                inactiveTintColor={'#000000'}
                activeBackgroundColor={'white'}
                inactiveBackgroundColor={'white'}
                showLabel={true}
            />
        }
        screenOptions={{
            lazy: true,
        }}
    >
        {/* <BottomTab.Group> */}
        {
            homeTabArray.map((item, index) => (
                <BottomTab.Screen
                    key={index}
                    name={item.id}
                    {...props}
                    component={item.component}
                    options={{
                        header: (props) => <NavBar
                            {...props}
                            isShowNavBar={item.isShowNavBar}
                            isShowLocation={item.isShowLocation}
                            title={item.name}
                        />,
                    }}
                />
            ))
        }
        {/* </BottomTab.Group> */}
    </BottomTab.Navigator>
</>;

const Main = () => {
    return <>
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
            <NavigationContainer
                ref={navigationRef}
            >
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false
                    }}
                    initialRouteName={'splashScreen'}
                >
                    <Stack.Screen
                        name="splashScreen"
                        component={SplashScreen}
                    />
                    <Stack.Screen
                        name="LoginScreen"
                        component={LoginScreen}
                    />
                    <Stack.Screen
                        name="SetPasswordScreen"
                        component={SetPasswordScreen}
                    />
                    <Stack.Screen
                        name="VerificationScreen"
                        component={VerificationScreen}
                        panHandlers={null}
                    />
                    <Stack.Screen
                        name="SOSScreen"
                        component={SOSScreen}
                        options={{
                            headerShown: false,
                            header: (props) => <NavBar
                                {...props}
                                hideNavBar={true}
                                isShowNavBar={false}
                            />
                        }}
                    />

                    {/* hometab bar */}
                    <Stack.Screen
                        name='homeTabBar'
                        // tabs={true}
                        // tabBarPosition={'bottom'}
                        // options={{
                        //     headerShown: true,
                        //     header: <NavBar
                        //         isShowNavBar={true}
                        //     />
                        // }}
                    >
                    {
                        (props) => HomeTabBarNestedRoutes(props)
                    }
                    </Stack.Screen>
                    <Stack.Group>
                        <Stack.Screen
                            name={'aboutScreen'}
                            component={AboutScreen}
                            options={{
                                headerShown: true,
                                header: (props) => <NavBar
                                    {...props}
                                    isShowNavBar={true}
                                    isShowLocation={false}
                                    title={'About Us'}
                                />
                            }}
                        />
                    </Stack.Group>
                    
                    <Stack.Screen
                        name={'UploadPrescription'}
                        component={UploadPrescription}
                    />
                    <Stack.Screen
                        name={'pdfReport'}
                        component={PdfReport}
                    />
                    <Stack.Screen
                        name={'cancelBookingView'}
                        component={CancelBookingView}
                    />
                    <Stack.Screen
                        name={'QRScanner'}
                        component={QRScanner}
                    />
                    <Stack.Screen
                        name={'DashboardScreen'}
                        component={DashboardScreen}
                    />
                    <Stack.Screen
                        name={'notificationListScreen'}
                        component={NotificationListScreen}
                    />
                    <Stack.Screen
                        name={'viewProfileScreen'}
                        component={ViewProfileScreen}
                        options={{
                            headerShown: false,
                            header: (props) => <NavBar
                                {...props}
                                hideNavBar={true}
                                isShowNavBar={false}
                            />
                        }}
                    />
                    <Stack.Screen
                        name={'contactUsScreen'}
                        component={ContactUsScreen}
                        options={{
                            headerShown: true,
                            header: (props) => <NavBar
                                {...props}
                                hideNavBar={false}
                                isShowNavBar={true}
                                title="Contact Us"
                            />
                        }}
                    />
                    <Stack.Screen
                        name={'deliveryDetails'}
                        component={DeliveryDetailsScreen}
                        options={{
                            headerShown: true,
                            header: (props) => <NavBar
                                {...props}
                                hideNavBar={false}
                                isShowNavBar={true}
                                title="Deliver Samples"
                            />
                        }}
                    />

                    <Stack.Screen
                        name={'sampleCollectionDetail'}
                        component={SampleCollectionDetail}
                        options={{
                            headerShown: true,
                            header: (props) => <NavBar
                                {...props}
                                hideNavBar={false}
                                isShowNavBar={true}
                                title="Bookings"
                            />
                        }}
                    />
                    <Stack.Screen
                        name={'pendingDetailScreen'}
                        component={PendingDetailScreen}
                        options={{
                            headerShown: true,
                            header: (props) => <NavBar
                                {...props}
                                hideNavBar={false}
                                isShowNavBar={true}
                                title="Bookings"
                            />
                        }}
                    />
                    <Stack.Screen
                        name={'completedBookingDetailScreen'}
                        component={CompletedBookingDetailScreen}
                        options={{
                            headerShown: true,
                            header: (props) => <NavBar
                                {...props}
                                hideNavBar={false}
                                isShowNavBar={true}
                                title="Bookings"
                            />
                        }}
                    />
                    <Stack.Screen
                        name={'cancelBookingDetail'}
                        component={cancelBookingDetail}
                        options={{
                            headerShown: true,
                            header: (props) => <NavBar
                                {...props}
                                hideNavBar={false}
                                isShowNavBar={true}
                                title="Bookings"
                            />
                        }}
                    />

                    <Stack.Screen
                        name={'sampleCollectionSummary'}
                        component={SampleCollectionSummary}
                        options={{
                            headerShown: true,
                            header: (props) => <NavBar
                                {...props}
                                hideNavBar={false}
                                isShowNavBar={true}
                                title="Sample Collections"
                            />
                        }}
                    />
                    <Stack.Screen
                        name={'sampleCollectionScreen'}
                        component={SampleCollectionScreen}
                        options={{
                            headerShown: true,
                            header: (props) => <NavBar
                                {...props}
                                hideNavBar={false}
                                isShowNavBar={true}
                                title="Sample Collections"
                            />
                        }}
                    />
                </Stack.Navigator>
                <View style={{position: 'absolute', top: 0, left: 0, right: 0}}>
                    <OfflineNotice />
                </View>
            </NavigationContainer>
        </SafeAreaView>
    </>;
};

export default Main;