import Notice_list from '../home/notice_list';
import HomeMain from '../HomeMain';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();
const HomeStack = () => {
    return(
    <Stack.Navigator>
        <Stack.Screen name="HomeMain" component={HomeMain} options={{headerShown : false,}}/>
      <Stack.Screen name="notice_list" component={Notice_list} options={{headerShown : false,}}/>
      
    </Stack.Navigator>
    )
    
}

export default HomeStack;