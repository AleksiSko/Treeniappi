import React, { useState,useEffect, useRef,useMemo, use  } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StyleSheet, TouchableOpacity, Text, View, SafeAreaView, PanResponder, FlatList, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { handleUrlParams } from 'expo-router/build/fork/getStateFromPath-forks';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

export default function ProgressFilterpage ({ setShowFilter, onHighlightChange, highlight, workoutfilter, exercises }) {

       const [uniqueExercises, setUniqueExercises] = useState([]);
       const [selectedExercise, setSelectedExercise] = useState();
       const [selectedworkout, setSelectedWorkout] = useState();
       const [highlighted, setHighlighted] = useState(false);

    
        const getData = async (category) => {
        try {
          const value = await AsyncStorage.getItem('my-workouts');
          if (value !== null) {
            const ParsedData = JSON.parse(value).flat();
            const workoutData = ParsedData.filter(item => item.category === category);
            const exerciseData = workoutData.flatMap(item =>
            Array.isArray(item.workout)
              ? item.workout.map(w => w.exercise)
              : []
            );
            const uniqueExercises = [...new Set(exerciseData)];
            setUniqueExercises(uniqueExercises);
            }
        } catch (e) {
          console.error('Error reading value:', e);
        }
      };
      // ...existing code...

     useEffect(() => {
    const restoreSelectedExercise = async () => {
      const saved = await AsyncStorage.getItem('selected-exercise');
      if (saved && uniqueExercises.includes(saved)) {
        setSelectedExercise(saved);
      } else if (uniqueExercises.length > 0) {
        setSelectedExercise(uniqueExercises[0]);
      }
    };
    restoreSelectedExercise();
  }, [uniqueExercises]);

  // Tallenna valinta aina kun se muuttuu
  useEffect(() => {
    if (selectedExercise) {
      AsyncStorage.setItem('selected-exercise', selectedExercise);
    }
  }, [selectedExercise]);

  // Palauta viimeisin filter kun komponentti avataan
  useEffect(() => {
    const getFilteredData = async () => {
      try {
        const value = await AsyncStorage.getItem('exercise-filter');
        if (value !== null) {
          const [workout, exercise, highligted] = JSON.parse(value);
          getData(workout);
          setSelectedWorkout(workout);
          if (highligted !== false) {
          setHighlighted(highligted);
          }
        }
      } catch (e) {
        console.error('Error reading value:', e);
      }
    };
    getFilteredData();
  }, []);
  



    return (
        <View style={styles.container}>
          <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}>Suodatin</Text>
          <View style = {styles.topContainer}>
            <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold', alignSelf: 'flex-start', padding: 5}}>Treenit:</Text>

          </View>
          <View style = {styles.exercisefilter}>
            <TouchableOpacity 
               onPress={() => {
                getData('Jalat');
                onHighlightChange(1);
                setHighlighted(1);
                setSelectedWorkout('Jalat');
                
              }}
              style = {[styles.category, {borderColor: highlight ===  1 ? 'red' : 'grey'}]}
            >
              <Text style = {{color: 'grey', fontSize: 10, fontWeight: 'bold', alignSelf: 'center' }}>Jalat</Text> 
            </TouchableOpacity>
            <TouchableOpacity 
               onPress={() => {
                getData('Työntävät');
                onHighlightChange(2);
                setHighlighted(2);
                setSelectedWorkout('Työntävät');
              }}
              style = {[styles.category, {borderColor: highlight ===  2 ? 'red' : 'grey'}]}
            >
              <Text style = {{color: 'grey', fontSize: 10, fontWeight: 'bold', alignSelf: 'center' }}>Työntävät</Text> 
            </TouchableOpacity>
            <TouchableOpacity 
               onPress={() => {
                getData('Vetävät');
                onHighlightChange(3);
                setHighlighted(3);
                setSelectedWorkout('Vetävät');
              }}
              style = {[styles.category, {borderColor: highlight ===  3 ? 'red' : 'grey'}]}
            >
              <Text style = {{color: 'grey', fontSize: 10,fontWeight: 'bold', alignSelf: 'center' }}>Vetävät</Text> 
            </TouchableOpacity>
            <TouchableOpacity 
               onPress={() => {
                getData('Rinta/Hauis');
                onHighlightChange(4);
                setHighlighted(4);
                setSelectedWorkout('Rinta/Hauis');
              }}
              style = {[styles.category, {borderColor: highlight ===  4 ? 'red' : 'grey'}]}
            >
              <Text style = {{color: 'grey', fontSize: 10, fontWeight: 'bold', alignSelf: 'center' }}>Rinta/Hauis</Text> 
            </TouchableOpacity>
            <TouchableOpacity 
               onPress={() => {
                getData('Selkä/Ojentaja');
                onHighlightChange(5);
                setHighlighted(5);
                setSelectedWorkout('Selkä/Ojentaja');
              }}
              style = {[styles.category, {borderColor: highlight ===  5 ? 'red' : 'grey'}]}
            >
              <Text style = {{color: 'grey', fontSize: 9, fontWeight: 'bold', alignSelf: 'center' }}>Selkä/Ojentaja</Text> 
            </TouchableOpacity>
          </View>
          <View style = {styles.workoutfilter}>
            <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold', alignSelf: 'flex-start', padding: 5}}>Tehdyt liikkeet:</Text>
          <Picker
            selectedValue={selectedExercise}
            onValueChange={(itemValue) => {
              setSelectedExercise(itemValue);
            }}
            style={styles.picker}
            itemStyle={{ color: 'black' }}
          >
            {uniqueExercises.map((exercise, index) => (
              <Picker.Item key={index} label={exercise} value={exercise} />
            ))}
          </Picker>
          
          </View>
          <View style = {styles.bottomContainer}>
            <TouchableOpacity
              onPress={() => {
                exercises(selectedworkout, selectedExercise, highlighted);
                setShowFilter(false)
              }}
              style = {styles.close}
            >  
              <Text style = {{fontSize: 18, fontWeight: 'bold', alignSelf: 'center'}}>Tallenna</Text>
            </TouchableOpacity>
          </View>
        </View>
      
      
    )
}


const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        backgroundColor: 'white',
        width: '100%',
        height: '100%',
        right: 0,
        alignItems: 'center',
        height: '100%',
        top: -5,
        zIndex: 10,
      },
      topContainer: {
        alignItems: 'center', 
        width: '100%', 
        height: '15%', 
        backgroundColor: 'white', 
        marginTop: 20,
        borderTopWidth: 2,
        borderTopColor: 'grey',
      },
      bottomContainer: {
        height: '45%',
        width: '100%',
        backgroundColor: 'white',
      },
    exercisefilter: {
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 10,
      backgroundColor: 'white',
      width: '100%',
      height: '15%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      borderBottomWidth: 2,
      borderBottomColor: 'grey',
    },  
    workoutfilter: {
      position: 'relative',
      alignItems: 'center',
      backgroundColor: 'white',
      width: '100%',
      height: '35%',
      borderBottomWidth: 2,
      borderBottomColor: 'grey',
    },  
    category: {
      padding: 5,
      height: 30,
      width: '30%',
      backgroundColor: 'white',
      borderRadius: 10,
      borderWidth: 2,
    }, 
    category2: {
      padding: 5,
      height: 50,
      width: '80%',
      backgroundColor: 'white',
      borderRadius: 10,
      borderWidth: 2,
    }, 
    button: {
      padding: 5,
      height: 35,
      width: 80,
      backgroundColor: 'white',
      borderRadius: 10,
      borderWidth: 2,
    }, 
    
    close: {
      marginTop: 50,
      alignSelf: 'center',
      padding: 5,
      height: 40,
      width: 120,
      backgroundColor: 'grey',
      borderRadius: 8,
    },
    picker: {
    width: 'auto',
    minWidth: '90%',
    color: 'green',
    backgroundColor: 'white',
    borderRadius: 5,
  },
      
})      