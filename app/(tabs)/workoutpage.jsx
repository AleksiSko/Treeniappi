import { StyleSheet,openDatabase, TouchableOpacity,Pressable, Text, View, SafeAreaView, PanResponder, FlatList, Image } from 'react-native';
import React, { useState,useEffect, useRef,useMemo, use  } from 'react';
import { Picker } from '@react-native-picker/picker';
import Icon1 from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/Foundation'
import Slider from '@react-native-community/slider';
import SaveIcon from 'react-native-vector-icons/Entypo';
import AddIcon from 'react-native-vector-icons/MaterialIcons';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import exercises from '../components/exercises.json'; // Tuo JSON-tiedosto
import specificexercises from '../components/specificexercises.json';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';



import Set1 from '../components/set1';
import MovementsPage from '../components/movements';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { store } from 'expo-router/build/global-state/router-store';







const WorkoutPage = () => {
  const router = useRouter();
  const { category } = useLocalSearchParams(); // Valittu kategoria
  const [workoutData, setWorkoutData] = useState([]); // Tallennetaan liikkeet
  const [savedWorkoutData, setSavedWorkoutData] = useState([]); // Tallennetaan liikkeet
  const [selectedExercise, setSelectedExercise] = useState(); // Valittu liike
  const [specifiedExercise, setSpecifiedExercise] = useState ();
  const [selectedSet, setSelectedSet] = useState('1'); // Valittu sarjojen määrä 
  const [RepsliderValue, setRepSliderValue] = useState(0);
  const [WeightsliderValue, setWeightSliderValue] = useState(0); // Sliderin arvo
  const [step, setStep] = useState(0); // Vaiheiden hallinta
  const [maxSteps, setMaxSteps] = useState(2); // Maksimi askel
  const [sets, setSets] = useState([]); // Sarjat
  const [movements, setMovements] = useState([]); // Liikkeet
  const [show, setShow] = useState(false); 
  const [index, setIndex] = useState(1); 
  const today = new Date();
  const formattedDate = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;
  const [data, setData] = useState([]); 


  //storing data
const storeWorkouts = async (newWorkout) => {
  try {
    const existingData = await AsyncStorage.getItem('my-workouts');
    const parsedData = existingData ? JSON.parse(existingData) : [];
    const updatedData = [...parsedData, newWorkout];
    const jsonValue = JSON.stringify(updatedData); 
    await AsyncStorage.setItem('my-workouts', jsonValue);
    console.log('Data saved successfully');
  } catch (e) {
    console.error('Error saving data:', e);
  }
};


const addManualWorkout = async () => {
  const manualWorkout = {
     category: 'Työntävät',
    date: '26.5.2025',
    workout: [
      {
        exercise: 'Penkkipunnerrus - tnk',
        sets: [
          { reps: 10, weight: 95 },
          { reps: 10, weight: 90 },
        ]
      },
      {
        exercise: 'Vinopenkkipunnerrus - kp',
        sets: [
          { reps: 13, weight: 37.5 },
          { reps: 13, weight: 32.5 },
        ]
      },
      {
        exercise: 'Pushdown - köysi',
        sets: [
          { reps: 9, weight: 40 },
          { reps: 10, weight: 35 },
          { reps: 10, weight: 30 },
        ]
      },
         
    ]

  };

  try {
    const existingData = await AsyncStorage.getItem('my-workouts');
    const parsedData = existingData ? JSON.parse(existingData) : [];
    const updatedData = [...parsedData, manualWorkout];
    await AsyncStorage.setItem('my-workouts', JSON.stringify(updatedData));
    console.log('Manuaalinen treeni lisätty!');
  } catch (e) {
    console.error('Virhe tallennuksessa:', e);
  }
};



  const handleAdd = () => {
    const newSet = {
      reps: RepsliderValue,
      weight: WeightsliderValue,
    };
  
    setSets((prevSets) => {
      const updatedSets = [...prevSets, newSet];
      console.log("Updated sets:", updatedSets);
  
      if (parseInt(index, 10) === parseInt(selectedSet, 10)) { 
            const newWorkout = {
            exercise: specifiedExercise,
            sets: updatedSets,
          };

      // Päivitä workoutData
          setWorkoutData((prevData) => {
            const updatedWorkoutData = [...prevData, newWorkout];
            return updatedWorkoutData;
          });

          setRepSliderValue(0);
          setWeightSliderValue(0);
          setStep(6);
          setIndex(1);
          setSets([]); // Tyhjennä sarjat
          } 
    else {
      setIndex((prev) => prev + 1);
      setStep((prev) => prev + 1);
    }

    return updatedSets;
  });
};

  const saveData = () => {
    const newData = {
      id: uuidv4(),
      category: category,
      date: formattedDate,
      workout: workoutData,
    }
    setData((prevData) => {
      const newData = [...prevData, newData];
    } 
    );  
    storeWorkouts(newData);
  }

  // PanResponder logiikka
  const [maxStep, setMaxStep] = useState(2); // Alustetaan oletusarvoksi 2

  // Päivitä maxStep aina, kun selectedSet muuttuu
  useEffect(() => {
    setMaxStep(2 + parseInt(selectedSet, 10)); // Lisää selectedSet maksimiarvoon
  }, [selectedSet]);
  
  const onRepChange = (value) => {
    setRepSliderValue(value); // Päivitä toistojen määrä
  };
  
  const onWeightChange = (value) => {
    setWeightSliderValue(value); // Päivitä painojen määrä
  };

  useEffect(() => {
    setSelectedExercise(exercises[category][0]);
    setSpecifiedExercise (specificexercises[exercises[category][0]][0]);
    console.log("Selected exercise:", exercises[category][0]);
  }, [category]);

  const handleBackPress = () => {
    if (step === 0) {
      router.push('/'); 
    }
    if (step > 2) {
      setIndex(prev => prev - 1); 
      setStep(prev => prev - 1);
      setSets(prevSets => prevSets.slice(0, -1));
    }
    else {
      setStep(prev => prev - 1);
    }
  }


  return (
      <SafeAreaView style={styles.container}>
         <View style = {styles.header}>
          <Text style={{ color: 'white', fontSize: 10 }}>WorkoutPage</Text>
         </View>
      {
      show === true ? 
      <MovementsPage
        workoutData={workoutData}
        category={category} 
      />
      : null
      }
    
      <View style = {styles.photoContainer}>
        {step === 0 && (
          <>
            <Text style = {{color: 'white', fontSize: 20, fontWeight: 'bold'}}> Lisää liike ja variaatio </Text>
            <Picker
              selectedValue={selectedExercise}
              onValueChange={(itemValue) =>  setSelectedExercise(itemValue)}
              
              style={styles.picker}
              itemStyle={{ color: 'white' }}
            >
              {exercises[category]?.map((exercise, index) => (
                <Picker.Item key={index} label={exercise} value={exercise} />
              ))}
            </Picker>
          </>
        )}
      </View>
      <View style={styles.addWorkout}>
        {step === 0 && (
          <>
            
            {specifiedExercise !== null && (
              <Picker
              selectedValue={specifiedExercise}
              onValueChange={(itemValue) =>  setSpecifiedExercise(itemValue)}
              

              style={styles.picker}
              itemStyle={{ color: 'white' }}
            >
              {specificexercises[selectedExercise]?.map((exercise, index) => (
                <Picker.Item key={index} label={exercise} value={exercise} />
              ))}
            </Picker>
            )}
            <TouchableOpacity style={styles.button1} 
            onPress= {() => {
               setSets([]); 
               setSelectedExercise(selectedExercise);
               setStep(prev => prev +1); 
            }}>
              <Text style={{fontSize: 20,color: 'white', fontWeight: '450'}}>Lisää liike</Text>
            </TouchableOpacity>
          </>

        )}
        {step === 1 && (
          <>
            <Text style={styles.text}>Valitse sarjojen määrä:</Text>
            <Picker
              selectedValue={selectedSet}
              onValueChange={(itemValue) => setSelectedSet(itemValue, 10)} // Muunna kokonaisluvuksi
              style={styles.picker}
              itemStyle={{ color: 'white' }}
            >
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4" value="4" />
              <Picker.Item label="5" value="5" />
            </Picker>

            <TouchableOpacity style={styles.button1} 
            onPress= {() => {
               setSelectedSet(selectedSet);
               setStep(prev => prev +1); 
               setMaxSteps(prev => prev + selectedSet); 
            }}>
              <Text style={{color: 'white', fontWeight: '450'}}>Lisää sarjat</Text>
            </TouchableOpacity>
            
          </>
        )}
        {step >= 2 && step < 2 + parseInt(selectedSet, 10)  && (
        
         <> <Set1
          RepsliderValue={RepsliderValue}
          WeightsliderValue={WeightsliderValue}
          onRepChange={setRepSliderValue}
          onWeightChange={setWeightSliderValue}
          index={index}
      
          />
          
          <TouchableOpacity style={styles.button1} 
            onPress= {() => {
              handleAdd(); 
               
            }}>
             <Text style={styles.text}>
              {parseInt(index, 10) === parseInt(selectedSet, 10) ? "lisää liike" : "lisää sarja"} 
             </Text>
          </TouchableOpacity>
          
          </>
        
        )}
        {step === 6 && (
        <>
          <Image
            source={require('../../assets/mostmuscular.png')} // Lisää kuva assets-kansiosta
            style={styles.image}
          />
          <TouchableOpacity style = {styles.image1} onPress={() => {
            setStep(0);
            router.push('/')
            saveData();
            }}> 
        
            <SaveIcon name = "save" size={150} color = 'white'></SaveIcon>
            <Text style = {{color: 'white', fontSize: 20, fontWeight:'bold', position: 'absolute', left: -170, bottom: -35}}>Uusi liike</Text>
              
          </TouchableOpacity>  
          <TouchableOpacity style = {styles.image2} onPress={() => {
            setStep(0);
            }}>
            <AddIcon name = "note-add" size={150} color = 'white'></AddIcon>
            <Text style = {{color: 'white', fontSize: 20, fontWeight:'bold', position: 'absolute', right: -155, bottom: -22}}>Tallenna</Text>
         </TouchableOpacity>  
         
        </>
        )}

         
               
        
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={{right: -150}} 
          onPressIn={() => {
            setShow(true); // Näytä MovementsPage
           
            }
          }  
          
          onPressOut={() => {
            setShow(false); // Piilota MovementsPage
          }    
          }
          >
          <Icon2 name="magnifying-glass" size={50} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity style={{position: 'absolute', left: 15}} onPress={() => 
          handleBackPress()}> 
          <Text style = {{fontSize: 20, color: 'white', fontWeight: 'bold', padding: 12}}> Takaisin </Text>
        </TouchableOpacity>
      </View>
      </SafeAreaView>  
)};   


export default WorkoutPage;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E1E', // Taustaväri
  },
  workoutLog: {
    position: 'absolute',
    backgroundColor: 'white',
    width: '100%',
    alignItems: 'center',
    height: 300,
    top: 20,
  },
  photoContainer: {
    position: 'relative',
    alignItems: 'center',
    width: '100%',
    height: '35%',
    backgroundColor: '#1E1E1E',

  },
  addWorkout: {
    backgroundColor: '#1E1E1E',
    width: '100%',
    alignItems: 'center',
    height: '50%',
  },
  picker: {
    padding: 20,
    height: 50,
    width: '90%',
    color: 'white',
    backgroundColor: '#1E1E1E',
    borderRadius: 5,
  },
  buttonContainer: {
    height: '10%',
    backgroundColor: '#1E1E1E',
    width: '100%',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
  },
  header: {
    alignItems: 'center',
    height: '18%',
    width: '100%',
    backgroundColor: '#1E1E1E',
  },
  slider: {
    width: '80%',
    height: 40,
    marginTop: 20,
  },
  slider2: {
    width: '80%',
    height: 40,
    marginTop: 20,
  },
  image1: {
    position: 'absolute',
    top: 65,
    right: 40,
    width: 140, // Kuvan leveys
    height: 140, // Kuvan korkeus
    marginBottom: 20, // Väli kuvan ja muiden elementtien välillä
  },
  image2: {
    position: 'absolute',
    top: 60,
    left: 10,
    width: 160, // Kuvan leveys
    height: 160, // Kuvan korkeus
    marginBottom: 20, // Väli kuvan ja muiden elementtien välillä
  },
  button1: {
    position: 'absolute', 
    fontSize: 20, right: 130, 
    bottom: 25,
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'grey',
  },
   image: {
    width: 350,
    height: 350,
    position: 'absolute',
    top: -300
  },
});