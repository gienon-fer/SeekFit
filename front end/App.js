import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Profile from "./componenets/screens/Profile";

const Tab = createBottomTabNavigator();


const ComingSoon = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: 18 }}>Coming Soon!</Text>
  </View>
);

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen
            name="Wardrobe"
            component={ComingSoon}
            options={{
              tabBarLabel: 'Wardrobe',
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="door-sliding" color={color} size={size} />
              )
            }}
          />
          <Tab.Screen
            name="Profile"
            component={Profile}
            options={{
              tabBarLabel: 'Profile',
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="person" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Friends"
            component={ComingSoon}
            options={{
              tabBarLabel: 'Friends',
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="group" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Planner"
            component={ComingSoon}
            options={{
              tabBarLabel: 'Planner',
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="calendar-month" color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
