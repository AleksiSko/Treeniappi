import React, { useState,useEffect, useRef,useMemo, use  } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StyleSheet, TouchableOpacity, Text, View, SafeAreaView, PanResponder, FlatList } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';




  const options = [
      { label: 'Uusin ensin', value: '1' },  
      { label: 'Vanhin ensin', value: '2' },
    ]

export default function FilterPage ({ setShowFilter, onHighlightChange, highlight, filter }) {
  

  const [timefilter, setTimeFilter] = useState();
  const [selectedWorkout, setSelectedWorkout] = useState();
  const [highlighted, setHighlighted] = useState(false);

  const getFilterData = async () => {
    try { 
      const value = await AsyncStorage.getItem('filterData'); 
      console.log('Raw value from AsyncStorage:', value);
      if (value !== null) {
        const [time, workout, highlighted] = JSON.parse(value);
        setTimeFilter(time);
        setSelectedWorkout(workout);
        setHighlighted(highlighted);
        console.log('Filter data loaded:', { time, workout, highlighted });
        
      }

    }
    catch (e) {
      console.error('Error reading filter data:', e);
    }
  }
  
  useEffect(() => {
    getFilterData();
  }
  , []);



    return (
        <View style={styles.container}>
          <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}>Suodatin</Text>
          <View style = {styles.topContainer}>
            <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold', alignSelf: 'flex-start', padding: 5}}>Treenit:</Text>
          <TouchableOpacity 
              onPress={() => {
                onHighlightChange(6)
                setHighlighted(6)
                setSelectedWorkout('Kaikki')
              }}
              style = {[styles.button, {borderColor: highlight ===  6 ? 'red' : 'grey'}]}
            >
              <Text style = {{color: 'grey', fontSize: 12, fontWeight: 'bold', alignSelf: 'center', marginTop: 4, }}>kaikki</Text> 
            </TouchableOpacity>

          </View>
          <View style = {styles.exercisefilter}>
            <TouchableOpacity 
              onPress={() => {
                onHighlightChange(1)
                setHighlighted(1)
                setSelectedWorkout('Jalat')
              
              }}
              style = {[styles.category, {borderColor: highlight ===  1 ? 'red' : 'grey'}]}
            >
              <Text style = {{color: 'grey', fontSize: 10, fontWeight: 'bold', alignSelf: 'center' }}>Jalat</Text> 
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => {
                onHighlightChange(2)
                setHighlighted(2)
                setSelectedWorkout('Työntävät')
              }}
              style = {[styles.category, {borderColor: highlight ===  2 ? 'red' : 'grey'}]}
            >
              <Text style = {{color: 'grey', fontSize: 10, fontWeight: 'bold', alignSelf: 'center' }}>Työntävät</Text> 
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => {
                onHighlightChange(3)
                setHighlighted(3)
                setSelectedWorkout('Vetävät')
              }}
              style = {[styles.category, {borderColor: highlight ===  3 ? 'red' : 'grey'}]}
            >
              <Text style = {{color: 'grey', fontSize: 10,fontWeight: 'bold', alignSelf: 'center' }}>Vetävät</Text> 
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => {
                onHighlightChange(4)
                setHighlighted(4)
                setSelectedWorkout('Rinta/Hauis')
              }}
              style = {[styles.category, {borderColor: highlight ===  4 ? 'red' : 'grey'}]}
            >
              <Text style = {{color: 'grey', fontSize: 10, fontWeight: 'bold', alignSelf: 'center' }}>Rinta/Hauis</Text> 
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => {
                onHighlightChange(5)
                setHighlighted(5)
                setSelectedWorkout('Selkä/Ojentaja')
              }}
              style = {[styles.category, {borderColor: highlight ===  5 ? 'red' : 'grey'}]}
            >
              <Text style = {{color: 'grey', fontSize: 9, fontWeight: 'bold', alignSelf: 'center' }}>Selkä/Ojentaja</Text> 
            </TouchableOpacity>
          </View>
          <View style = {styles.datefilter}>
            <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold', alignSelf: 'flex-start', padding: 5}}>Aika:</Text>
            <Dropdown
              style={{ height: 30, width: '80%', borderColor: 'grey', borderWidth: 1, borderRadius: 8, marginTop: 10, alignSelf: 'center' }}
              labelField="label"
              valueField="value"
              selectedTextStyle={{ color: 'black', fontSize: 16, fontWeight: 'bold' }}
              placeholder = "Valitse suodatin"
              data={options}
              value = {timefilter}
              onChange={item => setTimeFilter(item.value)}

              />
             
          </View>
          <View style = {styles.bottomContainer} >
            <TouchableOpacity
              onPress={() => {
                setShowFilter(false)
                filter(timefilter, selectedWorkout, highlighted)
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
        width: 390,
        height: '100%',
        right: 0,
        alignItems: 'center',
        height: '100%',
        top: -85,
        zIndex: 10,
      },
      topContainer: {
        alignItems: 'center', 
        width: '100%', 
        height: '20%', 
        backgroundColor: 'white', 
        marginTop: 20,
        borderTopWidth: 2,
        borderTopColor: 'grey',
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
    category: {
      padding: 5,
      height: 30,
      width: '30%',
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
    datefilter: {
      width: '100%',
      height: '40%',
      backgroundColor: 'white',
      borderBottomWidth: 2,
      borderBottomColor: 'grey',
    },
    bottomContainer: {
        height: '55%',
        width: '100%',
        backgroundColor: 'white',
      },
      
})      