import { StackActions, createNavigationContainerRef } from '@react-navigation/native';

const navigationRef = createNavigationContainerRef();

const navigate = (name, params) => {
    if (navigationRef.isReady()) {
        navigationRef.navigate(name, params);
    }
};

const navigationReplace = (name, params = {}) => {
    if (navigationRef.isReady()) {
        navigationRef.dispatch(
            StackActions.replace(name, params)
        );
    }
};

const nativationPop = () => {
    if (navigationRef.isReady()) {
        return navigationRef.goBack();
    }
};

const navigationSetParams = (params) => {
    if (navigationRef.isReady()) {
        navigationRef.setParams(params);
    }
};

const navigationReset = (params = {}) => {
    if (navigationRef.isReady()) {
        navigationRef.reset(params);
        // navigationRef.reset();
    }
};

export default null;

export {
    navigationRef,
    navigate,
    nativationPop,
    navigationReplace,
    navigationReset,
    navigationSetParams,
};