import React, { useContext } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import AuthStack from './stack/AuthStack';
import { Spinner } from './components';
import { ProgressProvider, ProgressContext, UserProvider, UserContext } from './contexts';
import MyPage from './MyPage';

const MyPageMain = () => {
  return (
    <UserProvider>
      <ProgressProvider>
        <MyPageContent />
      </ProgressProvider>
    </UserProvider>
  );
};

const MyPageContent = () => {
  const { inProgress } = useContext(ProgressContext);
  const { user } = useContext(UserContext);
 

  return (
    <>
      {user?.uid && user?.email ? <MyPage /> : <AuthStack />}
      {inProgress && <Spinner />}
    </>
  );
};

export default MyPageMain;
