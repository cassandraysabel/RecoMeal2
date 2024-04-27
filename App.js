import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Ingredient from './temporary_ingredientscreen';
import Calendar_Component from './temporary_calendar';
import Home from './temporary_home'

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="temporary_ingredientscreen">
        <Stack.Screen name="temporary_ingredientscreen" component={Ingredient} options={{ headerShown: false }} />
        <Stack.Screen name="temporary_calendar" component={Calendar_Component} options={{ headerShown: false }} />
        <Stack.Screen name="temporary_home" component={Home} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
