import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Button, FlatList, ScrollView, Modal, Alert, Dimensions,Pressable } from 'react-native';
import { Calendar } from 'react-native-calendars';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Swipeout from 'react-native-swipeout';


const ScreenWidth= Dimensions.get('window').width;  
const Ingredient = ({route,navigation}) => {
  

  const navigate_to_calendar = () => {
    navigation.navigate('temporary_calendar', {text1, displayText, purchaseDate,expirationDate, daysUntilExpiration, markedDates, setMarkedDates,selectedDateIngredients, setSelectedDateIngredients, handleMarkDate})
  
  }

  const navigate_to_home = () => {
    navigation.navigate('temporary_home', {recipes})
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


    const fetchRecipes = async (ingredient) => {
      try {
        const response = await fetch(
          `https://api.edamam.com/search?q=${encodeURIComponent(
            ingredient
          )}&app_id=edad196e&app_key=72b9b5a24765be1a0be1c75b89c2c52c`
        );
        const data = await response.json();
        
        // Map over the hits array and return an array of recipe objects
        return data.hits.map(hit => ({
          ingredient: ingredient, // Associate each recipe with the inputted ingredient
          recipe: hit.recipe // Include recipe information
        }));
      } catch (error) {
        console.error('Error fetching recipes:', error);
        return [];
      }
    };
    

    const [recipes, setRecipes] = useState([]); 

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
    
            // Fetch recipes for the inputted ingredient
            const fetchedRecipes = await fetchRecipes(text1);
            // Update recipes state by concatenating the newly fetched recipes with the existing ones
            setRecipes((prevRecipes) => [...prevRecipes, ...fetchedRecipes]);
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
    // Remove the ingredient from the displayText array
    const deletedIngredient = displayText[index];
    if (!deletedIngredient) {
      console.error('Cannot delete ingredient at index:', index);
      return;
    }
    const newDisplayText = [...displayText];
    newDisplayText.splice(index, 1);
    setDisplayText(newDisplayText);
  
    // Remove the corresponding recipes from the recipes state
    const updatedRecipes = recipes.filter((recipe) => recipe.ingredient !== displayText[index].name);
    setRecipes(updatedRecipes);

  
    // Remove the expiration date from the markedDates state
    const updatedMarkedDates = { ...markedDates };
    delete updatedMarkedDates[deletedIngredient.expirationDate];
    setMarkedDates(updatedMarkedDates);
  };




  
  
  const [isInputScreenVisible, setIsInputScreenVisible]= useState(false)
  const toggleInputScreen = () =>{
    setIsInputScreenVisible(!isInputScreenVisible)
  };




   









  return (

    
    
    <View style={styles.container}>
        <View style={styles.icontainer}></View>
                    <Image
                    source={require("./assets/ingredients-bg.png")}
                    style={[styles.bgimage, { zIndex: 0 }]}
                    resizeMode = "cover"
                    />
                    <View style={styles.overlay}>
                        <Image
                            source={require("./assets/gradient.png")}
                            style={[styles.gradientimage, { zIndex: 1 }]}
                        />

                        <Text style={[(styles.ingredientsText), { zIndex: 2 }]}>Ingredients</Text>
                    </View>
                
                    
        <View style={styles.content}>     
            
        <ScrollView style={styles.scrollContainer}>
                  {displayText.map((text, index) => (
                  <Swipeout
                    key={index}
                    right={[
                      {
                        component: (
                          <View style={{ width: 70, height: 69, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: 'white' }}>Delete</Text>
                          </View>
                        ),
                        onPress: () => handleDelete(index, text.expirationDate),
                        backgroundColor: 'transparent',
                      }
                    ]}
                    autoClose={true}
                    backgroundColor='transparent'
                  >
                      <View key={index} style={styles.rectangle}>
                          <View style={styles.displayItem}>
                              <Image source={{ uri: text.image }} style={styles.image} />
                              <View style={styles.textposition}>
                                  <Text style={styles.displayText}>{text.name}</Text>
                                  {daysUntilExpiration !== '' && (
                                      <Text style={styles.resultText}>Will expire on: {text.daysUntilExpiration} days</Text>
                                  )}
                              </View>
                          </View>
                          
                      </View>
                  </Swipeout>
                  ))}
                </ScrollView>

                <TouchableOpacity style={styles.searchbar} onPress={toggleInputScreen}>
                    <Text style={{color:'black', fontSize:16, justifyContent:'center'}}>Add Ingredient</Text>
                </TouchableOpacity>

                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={isInputScreenVisible}
                    onRequestClose={toggleInputScreen}
                >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    
                    <TouchableOpacity
                        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                        onPress={toggleInputScreen}
                    />

                    <View style={{ width: 330, height: 300, backgroundColor: '#F2F2F2', justifyContent:'center', alignItems:'center', borderRadius:15 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center',  }}>
                        <Text style={{fontSize:16, color:'#333333', fontWeight:"bold", marginBottom:8, marginLeft:30}}>Ingredient</Text>
                        <View style={{flex:1}}></View>
                        </View>
                        <TextInput
                        style={{height:27, width:257, backgroundColor:'#D9D9D9', justifyContent:'center',alignItems:'center', marginBottom:10, borderRadius:10, paddingLeft:5}}
                        placeholder={'Input Ingredient'}
                        placeholderTextColor='#888'
                        onChangeText={handleInputChange}
                        value={text1}
                        />

                        <View style={{ flexDirection: 'row', alignItems: 'center',  }}>
                        <Text style={{fontSize:16, color:'#333333', fontWeight:"bold", marginBottom:8, marginLeft:30, }}>Date of Purchase</Text>
                        <View style={{flex:1}}></View>
                        </View>

                        <View style={{height:27, width:257, backgroundColor:'#D9D9D9', justifyContent:'center',alignItems:'center', marginBottom:10,borderRadius:10, paddingLeft:5, flexDirection:"row"}}>
                        <TextInput
                            style={{flex:1, paddingLeft:5}}
                            placeholder={'YYYY-MM-DD'}
                            placeholderTextColor='#888'
                            value={purchaseDate}
                            onChangeText={text => setPurchaseDate(text)}

                        ></TextInput>
                        <TouchableOpacity onPress={togglePurhaseDate} style={{marginLeft:'auto', marginRight:'5'}}>
                            <Image source={require("./assets/calendarIcon.png")} style={styles.icon_size}/>
                        </TouchableOpacity>


                        <DateTimePickerModal
                            isVisible={isPurchaseDateVisible}
                            mode="date"
                            onConfirm={handlePurchaseDateConfirm}
                            onCancel={togglePurhaseDate}
                        ></DateTimePickerModal>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center',  }}>
                        <Text style={{fontSize:16, color:'#333333', fontWeight:"bold", marginBottom:8, marginLeft:30, }}>Expiration Date</Text>
                        <View style={{flex:1}}></View>
                        </View>

                        <View style={{height:27, width:257, backgroundColor:'#D9D9D9', justifyContent:'center',alignItems:'center', marginBottom:20,borderRadius:10, paddingLeft:5, flexDirection:"row"}}>
                        <TextInput
                            style={{flex:1, paddingLeft:5}}
                            placeholder={'YYYY-MM-DD'}
                            placeholderTextColor='#888'
                            value={expirationDate}
                            onChangeText={text => setExpirationDate(text)}

                        ></TextInput>
                        <TouchableOpacity onPress={toggleExpiryDate} style={{marginLeft:'auto', marginRight:'5'}}>
                            <Image source={require("./assets/calendarIcon.png")} style={styles.icon_size}/>
                        </TouchableOpacity>

                        <DateTimePickerModal
                            isVisible={isExpiryDateVisible}
                            mode="date"
                            onConfirm={handleExpiryDateConfirm}
                            onCancel={toggleExpiryDate}
                        ></DateTimePickerModal>

                        </View>

                        <TouchableOpacity onPress={() => { handlePress() }} style={styles.button}>
                            <Text style={styles.buttonText}>ADD</Text>
                        </TouchableOpacity>

                    </View>

                    

                    </View>
                </Modal>

        </View> 
         
        <View style={[styles.navigationBar, {zIndex: 3}]}>
          
          <Pressable style={styles.icons} onPress={navigate_to_home}>
            <Image style={styles.icon} source={require("./assets/homeIcon.png")} />
            <Text style={styles.descriptionText}>HOME</Text>
          </Pressable>
          
          <View style={{ width: 8}}/>
          
          <Pressable style={styles.icons}>
            <Image style={styles.icon} source={require("./assets/favoritesIcon.png")} />
            <Text style={styles.descriptionText}>FAVORITES</Text>
          </Pressable>
          
          <View style={{ width: 8}}/>
          
          <Pressable style={styles.icons}>
            <Image style={styles.icon} source={require("./assets/ingredientsIcon.png")} />
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
    marginLeft: 15,
    marginBottom: 10,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
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
    width: 55,
    height: 55,
    borderRadius: 27.5,
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
    width: ScreenWidth,
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
    width: ScreenWidth,
    height:62,
    resizeMode: 'contain',
    
  },



  

});

export default Ingredient;