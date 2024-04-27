import React from 'react';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function FavoritesScreen() {
  const navigation = useNavigation();

  const navigate_to_calendar = () => {
    navigation.navigate('temporary_calendar', {text1, displayText, purchaseDate,expirationDate, daysUntilExpiration, markedDates, setMarkedDates,selectedDateIngredients, setSelectedDateIngredients, handleMarkDate})
  }

  const navigate_to_home = () => {
    navigation.navigate('temporary_home', {recipes})
  }

  const navigate_to_ingredient = () => {
    navigation.navigate("temporary_ingredientscreen", { handleMarkDate });
  };






  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/favorites-bg.png")}
        style={[styles.bgimage, { zIndex: 0 }]}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <Image
          source={require("../assets/gradient.png")}
          style={[styles.gradientimage, { zIndex: 1 }]}
        />
        <Text style={[(styles.favText), { zIndex: 2 }]}>Favorites</Text>
      </View>




      {/* NAVIGATION BAR*/}
      <View style={[styles.navigationBar, {zIndex: 3}]}>
        <View style={styles.icons}>
          <Pressable onPress={navigate_to_home}><Image style={styles.icon} source={require("../assets/homeIcon.png")} /></Pressable>
          <Pressable><Image style={styles.icon} source={require("../assets/OnFavoritesIcon.png")} /></Pressable>
          <Pressable onPress={navigate_to_ingredient}><Image style={styles.icon} source={require("../assets/ingredientsIcon.png")} /></Pressable>
          <Pressable onPress={navigate_to_calendar}><Image style={styles.icon} source={require("../assets/calendarIcon.png")} /></Pressable>
          <Pressable><Image style={styles.icon} source={require("../assets/profileIcon.png")} /></Pressable>
        </View>
        <View style={styles.descriptions}>
          <Text style={styles.descriptionText}>HOME</Text>
          <Text style={styles.descriptionText}>FAVORITES</Text>
          <Text style={styles.descriptionText}>INGREDIENTS</Text>
          <Text style={styles.descriptionText}>CALENDAR</Text>
          <Text style={styles.descriptionText}>PROFILE</Text>
        </View>
      </View>

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  bgimage: {
    position: 'absolute',
    top:0,
    left:0,
    width: '50%',
    height: '12%',
  },
  overlay:{
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  gradientimage:{
    width: '100%', 
    height: '12%',  
  },
  favText:{ 
    color: '#333A73', 
    fontSize: 30, 
    fontWeight: 'bold',
    opacity: 1,
    position: 'absolute',
    marginTop: 40,
    marginRight: 50
  },
  navigationBar: {
    position:'absolute',
    backgroundColor: "#201E53",
    justifyContent: 'flex-end',
    bottom: 0,
    left: 0,
    right: 0,
  },
  icons: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10, // Add some padding for visual appeal
  },
  descriptions: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 10,
  },
  icon: {
    width: 30,
    height: 30,
  },
  descriptionText: {
    fontSize: 10,
    color: "white",
  },
});
