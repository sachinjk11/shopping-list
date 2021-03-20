import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Shop from './components/ShoppingComponent';
import { NavigationContainer } from '@react-navigation/native';

const ShopStack = createStackNavigator();

function ShoppingStackScreen() {
  return (
    <ShopStack.Navigator
    screenOptions={{
      headerStatusBarHeight:15
    }}>
      <ShopStack.Screen name="Shopping List" component={Shop} />             
    </ShopStack.Navigator>
   );
}

export default class App extends React.Component {
  render(){
    return(
     <NavigationContainer>
        <ShoppingStackScreen/>
    </NavigationContainer>
    );
  } 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
