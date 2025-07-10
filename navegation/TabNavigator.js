import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons, FontAwesome, Feather } from "@expo/vector-icons";
import HomeStackNavigator from "./HomeStackNavigators";
import FavoritesScreen from "../screens/Favorites";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#2196F3",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "#fff" },
        tabBarIcon: ({ color, size, focused }) => {
          if (route.name === "Home") {
            return (
              <MaterialIcons
                name={focused ? "home" : "home"}
                size={size}
                color={color}
              />
            );
          } else if (route.name === "Favorites") {
            return (
              <FontAwesome
                name={focused ? "heart" : "heart-o"}
                size={size}
                color={color}
              />
            );
          } else if (route.name === "Profile") {
            return (
              <Feather
                name="user"
                size={size}
                color={color}
              />
            );
          }
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}