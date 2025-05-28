import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList } from 'react-native'
import React, { useState,useEffect, useRef,useMemo  } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SectionList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ModalDropdown from 'react-native-modal-dropdown';
import Icon from 'react-native-vector-icons/Ionicons'
import FilterPage from './assets/filterpage';



const historypage = () => {

  const [showFilter, setshowFilter] = useState(false);
  const [filter, setFilter] = useState('Kaikki'); 
  const [highlight, setHighlight] = useState(false);
  const [workoutData, setWorkoutData] = useState([]);
  const router = useRouter();
  const data = ['all','legs', 'push', 'chest/bi'];
  const [dates, setDates] = useState([]);
  const [timefilter, setTimeFilter] = useState('1'); // Oletuksena uusin ensin

  const filteredData = filter === 'Kaikki' ?
  [...workoutData] : 
  workoutData.filter(item => item.category === filter);

  const sortedData = timefilter === '1' ? 
  filteredData.slice().reverse() : 
  filteredData;
  


const clearStorage = async () => {
  try {
    await AsyncStorage.removeItem('my-workouts');
    setWorkoutData([]); // Tyhjennä myös näkymä
    console.log('AsyncStorage key removed successfully');
  } catch (e) {
    console.error('Error clearing AsyncStorage:', e);
  }
};


  const getData = async () => {
  try {
    const value = await AsyncStorage.getItem('my-workouts');
    if (value !== null) {
      const ParsedData = JSON.parse(value).flat();
      setWorkoutData(ParsedData);
      const uniqueDates = ParsedData.map(item => item.date);
      setDates(uniqueDates);
      }
  } catch (e) {
    console.error('Error reading value:', e);
  }
};

useEffect(() => {
  getData();
}, []);

const getFilterData = async () => {
  try {
    const value = await AsyncStorage.getItem('filterData');
    if (value !== null) {
      const [time, workout, highlighted] = JSON.parse(value);
      setTimeFilter(time);
      setFilter(workout);
      setHighlight(highlighted);
    }
  } catch (e) {
    console.error('Error reading filter data:', e);
  }
}
useEffect(() => {
  getFilterData();
}, []);

const saveFilterData = async (time, workout, highlighted) => {
  try {
    const filterData = [time, workout, highlighted];
    await AsyncStorage.setItem('filterData', JSON.stringify(filterData));
  } catch (e) {
    console.error('Error saving filter data:', e);
  }
}


const handleHighlightChange = (value) => {
  setHighlight(value);
  saveFilterData(timefilter, filter, value);
}
const handleFilterChange = (time, workout, highlighted) => {
  setTimeFilter(time);
  setFilter(workout);
  saveFilterData(time, workout, highlighted);
}


  return (
    <SafeAreaView style = {styles.container}>
      <View style = {styles.header}>
        <Text style = {styles.HeaderText}>TreeniHistoria</Text>
      </View>
      <View style = {styles.exerciseContainer}>
        <View style = {styles.listContainer}>
          <FlatList
            style={{ alignSelf: 'center', width: '80%' }}
            data= {sortedData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.defaultItem}>
                  <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>{item.category} - {item.date}</Text>
                {Array.isArray(item.workout) && item.workout.map((workout, workoutIndex) => (
                  <View key={workoutIndex}>
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: '400' }}>
                  Liike: {workout.exercise}
                  </Text>
                  {Array.isArray(workout.sets) && 
                  workout.sets.map((set, setIndex) => (  
                    <Text key={setIndex} style={
                      setIndex === workout.sets.length -1 ? styles.lastText : styles.defaultText}>
                      Sarja {setIndex + 1}: {set.reps} x {set.weight} kg
                    </Text>
                  ))}
                  </View> 
                ))}
              
              </View>
              )}
          />
        </View>  
        {showFilter === true ?
        <FilterPage 
          setShowFilter = {setshowFilter}
          onHighlightChange={handleHighlightChange}
          highlight={highlight}
          filter={handleFilterChange}>
          

        </FilterPage>
        : null}    
        <TouchableOpacity 
          style = {{padding: 20, position: 'absolute', top: 10, right: 10}}
          onPress = {() =>
          setshowFilter(true)}
        >
          <Icon name = "options" size={50} color = 'white'></Icon>
        </TouchableOpacity> 
        <TouchableOpacity style = {{position: 'absolute', right: 5, top: 300}} onPress={clearStorage}>
            <Text style = {{ color : 'white', fontSize: '20', marginTop: 20}}>Tyhjennä historia</Text>
        </TouchableOpacity>      
      </View>

      <View style = {styles.buttonContainer}>
        <TouchableOpacity style = {{padding: 10}} onPress={() => 
            router.push('/')}>    
            <Text style = {styles.text}>Takaisin</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style = {{padding: 10}}
          onPress = {() =>
          router.push({
          pathname: '/progresspage',
          params: {dates: dates},
          })}
        >
          <Text style = {styles.text}>Edistyminen</Text>
        </TouchableOpacity>     
        
      

      </View>

    </SafeAreaView>

  );
}

export default historypage;

const styles = StyleSheet.create({

  container: {
    position: 'relative',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },

  header: {
    position: 'relative',
    backgroundColor: '#1E1E1E',
    padding: 20,
    width: '100%',
    height: '18%',
    alignItems: 'center',
  },
  HeaderText: {
    marginTop: 30,
    color: 'white', 
    fontSize: 30, 
    fontWeight: 'bold',
  },
  exerciseContainer: {
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    height: '80%',
    width: '100%',
    padding: 20,
    

  },
  listContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#1E1E1E',
    height: '100%',
    width: '60%',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
  },  

  filterContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    height: '60%',
    width: '40%',
    top: 20,
    right: 0,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 110,
    width: '100%',
    backgroundColor: '#1E1E1E',
  },


  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },

  defaultItem: {
    padding: 5,
  },

  defaultText: {
    color: 'white', 
    fontSize: 16, 
    fontWeight: '200',
  },
    picker: {
    height: 50,
    width: 10,
    width: '80%',
    color: 'white',
    backgroundColor: 'white',
    borderRadius: 5,
  },
  lastText: {
    color: 'white', 
    fontSize: 16, 
    fontWeight: '200',
    borderBottomWidth: 1,
    borderBottomColor: 'grey',

  },

  lastItem: {
    padding: 2,  borderBottomWidth: 1, borderBottomColor: 'grey'
  },
});