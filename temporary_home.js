import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Button, FlatList, ScrollView, Modal, Alert, Dimensions,Pressable, Linking } from 'react-native';
import { Calendar } from 'react-native-calendars';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Swipeout from 'react-native-swipeout';



const ScreeWidth= Dimensions.get('window').width;

const Home = ({route,navigation}) => {
  const { recipes } = route.params;

  const navigate_to_calendar = () => {
    navigation.navigate('temporary_calendar', {text1, displayText, purchaseDate,expirationDate, daysUntilExpiration, markedDates, setMarkedDates,selectedDateIngredients, setSelectedDateIngredients, handleMarkDate})

  }

  const navigate_to_ingredient = () => {
    navigation.navigate('temporary_ingredientscreen')
  }
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDateIngredients, setSelectedDateIngredients] = useState([]);
  const handleMarkDate = (date) => {
     //Assuming date format is 'YYYY-MM-DD'
    const updatedMarkedDates = { ...markedDates };
    updatedMarkedDates[date] = { selected: true, marked: true,  }; // Setting selectedDotColor to red
    setMarkedDates(updatedMarkedDates);

    const ingredientsForSelectedDate = displayText.filter((ingredient) => ingredient.expirationDate === date);
    setSelectedDateIngredients(ingredientsForSelectedDate);
  };

    const [text1, setText1] = useState('');
    const [displayText, setDisplayText] = useState([]);
    const [purchaseDate, setPurchaseDate]=useState('');
    const [expirationDate, setExpirationDate]= useState('');
    const [daysUntilExpiration, setDaysUntilExpiration]= useState('');
  
    const handleInputChange = (text) => {
      setText1(text);
    };
  
    const handlePress = async () => {
      if (text1.trim() !== '') {
        try {
          const response = await fetch(`https://api.edamam.com/api/food-database/v2/parser?ingr=${text1}&app_id=7d110714&app_key=fb587c1ac3389996471cfe7104d369e9`);
          const data = await response.json();
  
          if (!purchaseDate || !expirationDate) {
              alert('Please enter both purchase date and expiration date.');
              return;
            }
  
          if (data.hints && data.hints.length > 0) {
              const ingredient = data.hints[0];
              const expirationDateTime = new Date(expirationDate);
              const currentDate = new Date();
              const daysRemaining = Math.ceil((expirationDateTime - currentDate) / (1000 * 60 * 60 * 24));
  
              const newIngredient = {
                  name: ingredient.food.label,
                  image: ingredient.food.image,
                  purchaseDate: purchaseDate,
                  expirationDate: expirationDate,
                  daysUntilExpiration: daysRemaining,
              
              };
  
              setDisplayText([...displayText, newIngredient]);
              setText1('');
              setPurchaseDate('');
              setExpirationDate('');
              setDaysUntilExpiration(daysRemaining);

              handleMarkDate(expirationDate);

          } else {
            alert('Ingredient not found');
          }
        } catch (error) {
          console.log('Error fetching data:', error);
        }
      }
    };

  const handleDone = () => {
    if (displayText.length < 5) {
      Alert.alert('Please enter at least 5 ingredients.');
      return;
    }
    navigation.navigate('AddIngredientsScreen', {displayText, daysUntilExpiration, text1});
  };

  const handleCalculate =() => {
    if (!purchaseDate || !expirationDate) {
      alert('Please enter both purchase date and expiration date.');
      return;
    }

    const purchaseDateTime = new Date(purchaseDate);
    const expirationDateTime = new Date(expirationDate);

    const currentDate = new Date();
    const daysRemaining = Math.ceil((expirationDateTime-currentDate) / (1000 * 60 * 60 *24));

    setPurchaseDate('');
    setExpirationDate('');
    setDaysUntilExpiration(daysRemaining);
    
  };



  const [isPurchaseDateVisible, setisPurchaseDateVisible] = useState(false)
  const [isExpiryDateVisible, setisExpiryDateVisible]=useState(false)

  const togglePurhaseDate = () => {
    setisPurchaseDateVisible(!isPurchaseDateVisible);
  };

  const toggleExpiryDate = () => {
    setisExpiryDateVisible(!isExpiryDateVisible);
  };

  const handlePurchaseDateConfirm = (date) => {
    setPurchaseDate(moment(date).format('YYYY-MM-DD'));
    togglePurhaseDate();

  };

  const handleExpiryDateConfirm = (date) => {
    setExpirationDate(moment(date).format('YYYY-MM-DD'));
    toggleExpiryDate();
  };

  const handleDelete = (index) => {
    const newDisplayText = [...displayText];
    newDisplayText.splice(index, 1);
    setDisplayText(newDisplayText);

    const updatedMarkedDates = { ...markedDates };
    delete updatedMarkedDates[expirationDate];
    setMarkedDates(updatedMarkedDates);
  };

  const [isInputScreenVisible, setIsInputScreenVisible]= useState(false)
  const toggleInputScreen = () =>{
    setIsInputScreenVisible(!isInputScreenVisible)
  };



  
  const RecipeCard = ({ recipe }) => (
    <View style={{height:234, }}>
      <View style={{justifyContent:'flex-start', alignItems:'center', marginHorizontal: 5, marginBottom: 20, backgroundColor: '#333A73', borderRadius: 15, elevation: 3, marginTop: 10,height: 234, width:162 }}>
        <Image
          source={{ uri: recipe.recipe.image }}
          style={{ width: 151, height: 102, marginLeft:10,marginRight:10, marginTop:10, marginBottom:5, borderRadius:15,  }} // Adjust width/height as needed
        />
        <View style={{alignItems:'center', justifyContent:'center'}}>
          <Text style={{ fontSize: 11, fontWeight: 'bold', padding: 5, color: 'white', textTransform: 'uppercase' }}>
            {recipe.recipe.label.toUpperCase()}
          </Text>
        </View>
        
        <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 10 }}>
          <View
            style={{  width: 138, height: 19, backgroundColor:'white', flexDirection:'row', alignItems:'center', justifyContent:'center', borderRadius:10, }}>
            
            
          
            <View style={{width: 13, height: 13, backgroundColor:'#FBA834', borderRadius:6.6, justifyContent:'center', alignItems:'center', marginRight:3, marginLeft:0}}>
              <Image source={require('./assets/hearticon.png')} style={{width:13, height:10}}></Image>
            </View>
            
            <Text style={{fontSize:6, fontWeight:'500',  color:'black', }}>Add To Favorites</Text>
            
            <TouchableOpacity 
              style={{width:53, height:13, justifyContent:'center', alignItems:'center', borderRadius:35, backgroundColor:'#FBA834', marginLeft:8}}
              onPress={() => openRecipeUrl(recipe.recipe.url)} 
              >
                <Text style={{fontSize:8, fontWeight:'500', color:'white'}}>See More...</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
  
  const RecipeList = ({ recipes }) => (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.recipe.label} recipe={recipe} />
      ))}
    </ScrollView>
  );


  const openRecipeUrl = (url) => {
    Linking.openURL(url);
  };


  return (
    
    <View style={styles.container}>
    <View style = {styles.header}>
      <View>
      <Image source= {require("./assets/gradient.png")} style={{position:"absolute"}}></Image>
      </View>
        
    <View style={styles.abtnprem}>
        <Image style={{width: 20, height: 20, right: 1 }} source={require("./assets/premium.png")}></Image>
        <Text style={{fontSize: 15, fontWeight: "bold", color: "#333A73", left: -80}}>
        <Text style={{fontSize: 15, fontWeight: "bold", color: "#FBA834"}}>PREMIUM</Text>
        </Text>
        <Text style={{fontSize: 15, fontWeight: "bold", color: "#333A73"}}> ABOUT </Text>
    </View>
    <Text style={{color: "#333A73", fontSize: 25, fontWeight: "bold", marginLeft: 25, marginTop: 45}}>WELCOME!</Text>
    <TextInput style={styles.input} placeholder='Input your ingredients'></TextInput>
    <Image style={{width: 30, height: 30, left: 204, top: -40}} source={require("./assets/calendarIcon.png")}></Image>
    <View style = {{width: 50, height: 30, left: 240, top: -68 }}>
        <Button  title='ADD'></Button>
    </View>
    <View style={{backgroundColor: "red", width: 87, height: 87, borderRadius: 100, left: 300, top: -120, backgroundColor: "white" }}></View>
    <Image style={{ width: 110, height: 90, left: 293, top: -220 }}source={require("./assets/logoNoText.png")}></Image>
  </View>
                
                
        <RecipeList recipes={recipes} />

      
        <View style={[styles.navigationBar, {zIndex: 3}]}>
          
          <Pressable style={styles.icons}>
            <Image style={styles.icon} source={require("./assets/homeIcon.png")} />
            <Text style={styles.descriptionText}>HOME</Text>
          </Pressable>
          
          <View style={{ width: 8}}/>
          
          <Pressable style={styles.icons}>
            <Image style={styles.icon} source={require("./assets/favoritesIcon.png")} />
            <Text style={styles.descriptionText}>FAVORITES</Text>
          </Pressable>
          
          <View style={{ width: 8}}/>
          
          <Pressable style={styles.icons} onPress={navigate_to_ingredient}>
            <Image style={styles.icon} source={require("./assets/OnIngredientsIcon.png")} />
            <Text style={styles.descriptionText}>INGREDIENTS</Text>
          </Pressable>
          
          <View style={{ width: 8}}/>
        
          <Pressable style={styles.icons} onPress={navigate_to_calendar}> 
            <Image style={styles.icon} source={require("./assets/calendarIcon.png")} />
            <Text style={styles.descriptionText}>CALENDAR</Text>
          </Pressable>
          
          <View style={{ width: 8}}/>
          
          
          <Pressable style={styles.icons}>
            <Image style={styles.icon} source={require("./assets/profileIcon.png")} />
            <Text style={styles.descriptionText}>PROFILE</Text>
          </Pressable>
          
        </View>  
        

      </View>
  
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  abtnprem:{
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-around",
    alignContent:"flex-start",
    top: 20
},
  input: {
    width: 190,
    height: 40,
    backgroundColor: "#D9D9D9",
    borderRadius: 10,
    marginLeft: 10,
    top: 0,
    shadowOpacity: 0.59,
    shadowRadius: 4.65,
    elevation: 7
},

  calendar:{
    shadowOpacity: 0.59,
    shadowRadius: 4.65,
    elevation: 7
},

  searchbar: {
    width: 273,
    height: 40,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginTop: 25,
    marginBottom: 10,
    paddingLeft: 5,
    flexDirection: 'row'
  },
  button: {
    backgroundColor: '#1F41BB',
    borderRadius: 5,
    height: 25,
    width: 100,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    
  },
  displayContainer: {
    width: '100%',
    marginTop: 10,
  },
  displayText: {
    fontSize: 16,
  },
  displayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,

  },

  textposition: {
    fontSize: 12,
    marginLeft:5

  },

  deleteposition : {
    
  },

  image: {
    width: 59,
    height: 55,
    borderRadius: 25,
    marginLeft: 5,
  },

  rectangle: {
    backgroundColor: 'lightgray',
    padding: 10,
    marginBottom: 10,
    
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    width: 358,
    height:69,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },

  scrollContainer: {
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
    
  },

  resultText: {
    fontSize: 14,
    color: 'red',
  },

  icon_size: {
    width: 35,
    height: 30,
    resizeMode: 'contain'
  },

  icontainer: {
    width:'100%',
    height:97,
    position: 'relative',
    backgroundColor:'white'
  },

  bgimage: {
    position:'absolute',
    top:0,
    left:0,
    width: '50%',
    height: '12%',
  },

  gradientimage:{
    width: '100%', 
    height: '12%',  
  },

  ingredientsText:{
    color: '#333A73', 
    fontSize: 30, 
    fontWeight: 'bold',
    opacity: 1,
    position: 'absolute',
    top: 40,
    right:15

  },


  overlay:{
    position: 'absolute',
    top: 0,
    left: 0,
    width: ScreeWidth,
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },

  icon: {
    width: 35,
    height: 30,
    resizeMode: 'contain'
    
  },

  icons: {
    alignItems: 'center', 
    
  },

  descriptionText: {
    fontSize: 10,
    color: "white",
  },

  descriptions: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 10,
  },

  navigationBar: {
    backgroundColor: "#201E53",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', 
    paddingHorizontal:20,
    width: ScreeWidth,
    height:62,
    resizeMode: 'contain',
    
  },



  recipe_rectangle: {
    width: 511,
    height: 234,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems:'center',
    marginRight: 5,
  }



  

});

export default Home;