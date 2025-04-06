import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./src/pages/login";
import Home from "./src/pages/home";
import Booking from "./src/pages/booking";
import Services from "./src/pages/services";
import Register from "./src/pages/register";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerBackVisible: false,
            gestureEnabled: false, // opcional: impede voltar por swipe no iOS
          }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{
            headerBackVisible: false,
          }}
        />
        <Stack.Screen
          name="Home"
          options={{
            headerBackVisible: false,
          }}
          component={Home}
        />
        <Stack.Screen name="Agendar" component={Booking} />
        <Stack.Screen name="Services" component={Services} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
