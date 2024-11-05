/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import 'react-native-url-polyfill/auto';
import { NavigationContainer } from '@react-navigation/native'
import RootStack from './screens/RootStack';
import AsyncStorage from '@react-native-async-storage/async-storage';

function App() {

  const [isLogin, setIsLogin] = useState(false);

  //로그인 인증 분기처리
  useEffect(() => {
    //로그인 여부 인증(check)
    async function checkStorage(){
      const token = await AsyncStorage.getItem('key');

      if(token){
        setIsLogin(true);
      }
    }
    
    checkStorage();
  }, []);

  return (     
    <NavigationContainer>
      <RootStack isLogin={isLogin}/>
    </NavigationContainer>
  );
}

export default App;
