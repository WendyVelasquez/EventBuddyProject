import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/Home";
import EventDetails from "../screens/EventDetails";
import FavoritesScreen from "../screens/Favorites";

const Stack = createStackNavigator();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="EventDetails" component={EventDetails} options={{ title: "" }} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ title: "" }} />
    </Stack.Navigator>
  );
}