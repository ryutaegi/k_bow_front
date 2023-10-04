import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');
const colors = {
    white: '#ffffff',
    black: '#000000',
    grey_0: '#d5d5d5',
    grey_1: '#a6a6a6',
    red: '#e84118',
    blue: '#3679fe',
    green1 : '#618264',
    green2 : '#79AC78',
    green3 : '#B0D9B1',
    green4 : '#D0E7D2',
    red1 : '#FFE5D6',
    blue1 : '#D6E4FF',
    blue2 : '#ADC8FF',
    blue3 : '#84A9FF',
    blue4 : '#6690FF', 
    blue5 : '#3366FF', 
    blue6 : '#254EDB', 
    gray1 : 'rgb(138,138,138)',   
    gray2 : 'rgb(140,140,140)',  
    gray3 : 'rgb(140,140,140)',
    gray4 : 'rgb(150,150,150)',
    gray5 : 'rgb(200,200,200)', 
    gray6 : 'rgb(245,245,245)', 
    blue4 : '#2E64FE',
    blue5 : 'rgb(2,126,229)', 
};

export const theme = {
    label : colors.grey_1,
    inputPlaceholder : colors.grey_1,
    inputBorder:colors.grey_1,
    
    background: colors.white,
    text: colors.black,
    imageBackground: colors.grey_0,
    imageButtonBackground: colors.grey_1,
    imageButtonIcon: colors.white,

    SpinnerBackground: colors.black,
    SpinnerIndicator: colors.white,

    buttonBackground : colors.blue,
    buttonTitle : colors.white,
    buttonUnfilledTitle : colors.blue,
    buttonLogout: colors.red,

    mainColor1 : colors.gray1,
    mainColor2 : colors.gray2,
    mainColor3 : colors.gray3,
    mainColor4 : colors.blue4,
    red1 : colors.red1,

    blue1 : colors.blue1,
    blue2 : colors.blue2,
    blue3 : colors.blue3,
    blue4 : colors.blue4,
    blue5 : colors.blue5,
    blue6 : colors.blue6,

    gray1 : colors.gray1,
    gray2 : colors.gray2,
    gray3 : colors.gray3,
    gray4 : colors.gray4,
    gray5 : colors.gray5,
    gray6 : colors.gray6,

    gray : colors.gray,
    white : colors.white,
    black : colors.black,

    viewHeight : height,
    viewWidth : width,
};