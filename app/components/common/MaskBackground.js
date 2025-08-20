import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
// import { IMAGES } from '../../utils/SharedImages';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const MaskBackground = ({ position = 'left', flip = false,computedMargin }) => {

    console.log(computedMargin,"computedMargin");
    
    return (
        <View
            style={[
                styles.maskContainer,
                position === 'right' ? styles.maskRight : styles.maskLeft,
                flip && styles.flip,computedMargin > 0 && { top: -screenHeight * 0.20, }
            ]}
        >
            <Image source={require('../../images/mask.png')} style={styles.maskImage} />
        </View>
    );
};

const styles = StyleSheet.create({
    maskContainer: {
        position: 'absolute',
        top: -screenHeight * 0.02, 
        height: screenHeight * 0.15, 
        width: screenWidth * 0.5, 
        zIndex: 1,
    },
    maskLeft: {
        left: 0,
    },
    maskRight: {
        right: 0,
    },
    flip: {
        transform: [{ rotateY: '180deg' }],
    },
    maskImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover', 
    },
});

export default MaskBackground;

