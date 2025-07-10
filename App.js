import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/Login";
import SignupScreen from "./screens/Signup";
import RecoverPassScreen from "./screens/Recovery";
import TabNavigator from "./navegation/TabNavigator";
import { AuthProvider, useAuth } from "./context/AuthContext";

const Stack = createStackNavigator();

function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return null; 
  }

  return (
    <NavigationContainer>
      {user ? (
        <TabNavigator />
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Login" }} />
          <Stack.Screen name="Signup" component={SignupScreen} options={{ title: "Sign Up" }} />
          <Stack.Screen name="RecoverPassword" component={RecoverPassScreen} options={{ title: "Password Recovery" }} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
