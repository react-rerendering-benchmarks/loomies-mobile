import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MapView } from '../pages/MapView';
import { CaptureView } from '../pages/CaptureView';
import { CombatView } from '../pages/CombatView';
import { Login } from '../pages/Login';
import { Signup } from '../pages/Signup';
import { BottomNavigation } from './BottomNavigation';
import { MapProvider } from '@src/context/MapProvider';
import { ModelProvider } from '@src/context/ModelProvider';
import { EmailValidationView } from '../pages/EmailValidationView';
import { NewCodeView } from '../pages/NewCodeView';
import { LoomieDetails } from '@src/pages/LoomieDetails';
import { LoomieDetailsSceneProvider } from '@src/context/LoomieDetailsSceneProvider';

const Stack = createStackNavigator();
export const StackNavigation = () => {
  /*
   * Map provider at the top so map data is kept between screens
   * Model provider at the top so model data is kept between screens
   */
  return (
    <MapProvider>
      <ModelProvider>
        {/* The LoomieDetailsSceneProvider is supposed to only be used in the 
        Loomie details page, but has to wrap all the others pages because a context
        cannot be inside a Stack.Navigator */}
        <LoomieDetailsSceneProvider>
          <Stack.Navigator
            initialRouteName='Map'
            screenOptions={{ headerShown: false }}
          >
            {/* Views that are not included in the bottom tabs navigation but are reachable using the navigator hook */}
            <Stack.Screen name='Map' component={MapView} />
            <Stack.Screen name='Capture' component={CaptureView} />
            <Stack.Screen name='Combat' component={CombatView} />
            <Stack.Screen name='Login' component={Login} />
            <Stack.Screen name='Signup' component={Signup} />
            <Stack.Screen
              name='EmailValidation'
              component={EmailValidationView}
            />
            <Stack.Screen name='NewCode' component={NewCodeView} />
            {/* Views that includes the bottom tabs navigation */}
            <Stack.Screen name='Application' component={BottomNavigation} />

            <Stack.Screen name='LoomieDetails' component={LoomieDetails} />
          </Stack.Navigator>
        </LoomieDetailsSceneProvider>
      </ModelProvider>
    </MapProvider>
  );
};
