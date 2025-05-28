import React, { useEffect, useState } from 'react';
import { View, Modal,Text, StyleSheet, SafeAreaView, TouchableOpacity,Pressable, StatusBar } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import lodash from 'lodash';
import Icon from 'react-native-vector-icons/Ionicons'
import ProgressFilterpage from './assets/progressfilterpage';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Arrow from 'react-native-vector-icons/Entypo'
import Home from 'react-native-vector-icons/Entypo'
import Infomark from 'react-native-vector-icons/FontAwesome5'


const screenWidth = Dimensions.get('window').width;

const ProgressPage = () => {
    const router = useRouter();
    const [dates, setDates] = useState([]);
    const [showFilter, setshowFilter] = useState(false);
    const [highlight, setHighlight] = useState(false);
    const [datapoints1 , setDatapoint1] = useState([]);
    const [datapoints2 , setDatapoint2] = useState([]);
    const [datapoints3 , setDatapoint3] = useState([]);
    const [datapoints4 , setDatapoint4] = useState([]);
    const [datapoints5 , setDatapoint5] = useState([]);
    const [setlabel1, setSetLabel1] = useState([]);
    const [setlabel2, setSetLabel2] = useState([]);
    const [setlabel3, setSetLabel3] = useState([]);
    const [setlabel4, setSetLabel4] = useState([]);
    const [setlabel5, setSetLabel5] = useState([]);
    const [exerciseFilter, setExerciseFilter] = useState();
    const [workoutFilter, setWorkoutFilter] = useState();
    const [infoVisible, setInfoVisible] = useState(false);

    const datasets = [];
      if (setlabel1 && setlabel1.length > 0) {
        datasets.push({ data: setlabel1, color: () => 'red' });
      }
      if (setlabel2 && setlabel2.length > 0) {
        datasets.push({ data: setlabel2, color: () => 'blue' });
      }
      if (setlabel3 && setlabel3.length > 0) {
        datasets.push({ data: setlabel3, color: () => 'green' });
      }
       if (setlabel4 && setlabel4.length > 0) {
        datasets.push({ data: setlabel4, color: () => 'yellow' });
      }
       if (setlabel5 && setlabel5.length > 0) {
        datasets.push({ data: setlabel5, color: () => 'orange' });
      }

    function samepoint(index) {
      const sets = [setlabel1, setlabel2, setlabel3, setlabel4, setlabel5];
      for (let i = 0; i < sets.length; i++) {
        for (let j = i + 1; j < sets.length; j++) {
          if (
            sets[i][index] !== undefined &&
            sets[j][index] !== undefined &&
            sets[i][index] === sets[j][index]
          ) {
            return true;
          }
        }
      }
      return false;
    }


  const getSetData = async (selectedWorkout, selectedExercise) => {
    try {
    const value = await AsyncStorage.getItem('my-workouts');
    if (value !== null) {
      const ParsedData = JSON.parse(value).flat();
      console.log(selectedWorkout);  
      const getWorkouts = ParsedData.filter(item => item.category === selectedWorkout);
      const dates = getWorkouts.map(item => {
        const [day, month] = item.date.split('.');
        return `${day}.${month}`;
      });
      setDates(dates);
      const set1 = [];
      const set2 = [];
      const set3 = [];
      const set4 = [];
      const set5 = [];

      getWorkouts.forEach(item => {
        const exercise = item.workout.find(w=> w.exercise === selectedExercise);
        if (exercise && exercise.sets && exercise.sets.length > 0) {
          if(exercise.sets[0]) {
            set1.push({reps: exercise.sets[0].reps, weight: exercise.sets[0].weight});
            setDatapoint1(set1);
          }
          if (exercise.sets[1]) {
            set2.push({reps: exercise.sets[1].reps, weight: exercise.sets[1].weight});
            setDatapoint2(set2);
          }

          if (exercise.sets[2]) {
            set3.push({reps: exercise.sets[2].reps, weight: exercise.sets[2].weight});
            setDatapoint3(set3);
          }
          if (exercise.sets[3]) {
            set4.push({reps: exercise.sets[3].reps, weight: exercise.sets[3].weight});
            setDatapoint4(set4);
          }
          if (exercise.sets[4]) {
            set5.push({reps: exercise.sets[4].reps, weight: exercise.sets[4].weight});
            setDatapoint5(set5);
          }
        }
      });
      
      const oneRM1 = set1.map(set => oneRepmax(set.weight, set.reps));
      const oneRM2 = set2.map(set => oneRepmax(set.weight, set.reps));
      const oneRM3 = set3.map(set => oneRepmax(set.weight, set.reps));
      const oneRM4 = set4.map(set => oneRepmax(set.weight, set.reps));
      const oneRM5 = set5.map(set => oneRepmax(set.weight, set.reps));

      const firstOneRM1 = oneRM1[0];
      const firstOneRM2 = oneRM2[0];
      const firstOneRM3 = oneRM3[0];
      const firstOneRM4 = oneRM4[0];
      const firstOneRM5 = oneRM5[0];

      const percent1 = transferToPercent(oneRM1, firstOneRM1);
      const percent2 = transferToPercent(oneRM2, firstOneRM2);
      const percent3 = transferToPercent(oneRM3, firstOneRM3);
      const percent4 = transferToPercent(oneRM4, firstOneRM4);
      const percent5 = transferToPercent(oneRM5, firstOneRM5);

      setSetLabel1(percent1);
      setSetLabel2(percent2);
      setSetLabel3(percent3);
      setSetLabel4(percent4);
      setSetLabel5(percent5);

  
      }
  } catch (e) {
    console.error('Error reading value:', e);
  }
};

const saveFilteredData = async (workout, exercise, highligted) => { 
  try { 
      const value = [workout, exercise, highligted];
      await AsyncStorage.setItem('exercise-filter', JSON.stringify(value));
  }
  catch (e) {
    console.error('Error saving filter:', e);
  }
  }
  
const getFilteredData = async () => {
  try {
    const value = await AsyncStorage.getItem('exercise-filter');
    if (value !== null) {
      const [workout, exercise, highligted] = JSON.parse(value);
      setExerciseFilter(exercise);
      setWorkoutFilter(workout);
      setHighlight(highligted);
      getSetData(workout, exercise);
    }
  } catch (e) {
    console.error('Error reading filter:', e);
  }
}
useEffect(() => {
  getFilteredData();
}, []);



const oneRepmax = (weight, reps) => {
  const oneRM = weight * (1 + reps / 30);
  return oneRM;
}

const transferToPercent = (oneRM, firstOneRM) => {
  const dataPercent = [];
  for (let i = 0; i < oneRM.length; i++) {
    dataPercent.push(Math.round(((oneRM[i] - firstOneRM) / firstOneRM * 100) * 10) / 10);
  }
  return dataPercent;
}


const handleHighlightChange = (value) => {
  setHighlight(value);
  saveFilteredData(workoutFilter, exerciseFilter, value);
};


const handleExerciseChange = (workout, exercise, highligted) => { 
  setExerciseFilter(exercise);
  setWorkoutFilter(workout);
  getSetData(workout, exercise);
  saveFilteredData(workout, exercise, highligted);
}




  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light" backgroundColor="#1E1E1E" />
      <View style={styles.header}>
        <TouchableOpacity style = {{marginTop: 30}}
          onPress={() => setInfoVisible(true)}>
          <Infomark name = "info-circle" size={40} color = 'white'></Infomark>
        </TouchableOpacity>

        <Text style={{ color: 'white', fontSize: 30, fontWeight: 'bold', marginTop: 30, }}>Edistyminen</Text>
      </View>  
      <View style = {styles.info}>
        <Modal
        visible={infoVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setInfoVisible(false)}
      >
       <Pressable style={styles.modalOverlay} onPress={() => setInfoVisible(false)}>
          <View style={styles.infoBox}>
            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Tietoa edistymisestä</Text>
            <Text style={{fontSize: 16, color: '#333', marginBottom: 20}}>
              Täällä näet treeniesi kehityksen. Voit painaa datapistettä nähdäksesi tarkemmat tiedot sarjoista.
              Edistyminen on laskettu prosentteina verrattuna ensimmäiseen treenipäivään, hypoteettisen ykkösmaksimin
              avulla.
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setInfoVisible(false)}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>Sulje</Text>
            </TouchableOpacity>
          </View>
        </Pressable>  
        </Modal>

        {exerciseFilter && workoutFilter ? (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style = {{color: 'white', fontSize: 24, fontWeight: 'bold'}}>{workoutFilter} : </Text>
        <Text style = {{color: 'grey', fontSize: 24, fontWeight: 'bold'}}>{exerciseFilter}</Text>
        </View>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Text style = {{color: 'white', fontSize: 24, fontWeight: 'bold',}}>Valitse liike</Text>
          <Arrow
            name = "arrow-long-right" size={40} color = 'white'>
          </Arrow>
          </View>
        )}
       <View style = {{flexDirection: 'row', alignItems: 'center', position: 'absolute', right: 10}}> 
        <TouchableOpacity
            onPress={() => setshowFilter(true)}>
            <Icon name = "options" size={40} color = 'white'></Icon>  
          </TouchableOpacity>
      </View> 
      </View>
      <View style = {styles.chart}>
      <ScrollView horizontal>
        <LineChart
          data={{
            labels: dates,
            datasets: [
                {
                  ...(setlabel1 && setlabel1.length > 0
                    ? { data: setlabel1, color: () => 'red' }
                    : { data: [0], color: () => 'grey' }
                  )
                },
                {
                  ...(setlabel2 && setlabel2.length > 0
                    ? { data: setlabel2, color: () => 'blue' }
                    : { data: [0], color: () => 'red' }
                  )
                },
                {
                  ...(setlabel3 && setlabel3.length > 0
                    ? { data: setlabel3, color: () => 'green' }
                    : { data: [0], color: () => 'red' }
                  )
                },
                {
                  ...(setlabel4 && setlabel4.length > 0
                    ? { data: setlabel4, color: () => 'yellow' }
                    : { data: [0], color: () => 'red' }
                  )
                },
                {
                  ...(setlabel5 && setlabel5.length > 0
                    ? { data: setlabel5, color: () => 'orange' }
                    : { data: [0], color: () => 'red' }
                  )
                },
              ],
            legend: datasets.map((_, i) => `Sarja ${i + 1}`),  
          }}
          width={Math.max(screenWidth, dates.length * 60)} // Leveys kasvaa datan mukaan
          height={420}
          yAxisSuffix="%"
          chartConfig={{
            backgroundColor: '#1E1E1E',
            backgroundGradientFrom: '#232526',
            backgroundGradientTo: '#1E1E1E',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
            onDataPointClick={({ value, index }) => {
              const percentSets = [setlabel1, setlabel2, setlabel3, setlabel4, setlabel5];
              const datapoints = [datapoints1, datapoints2, datapoints3, datapoints4, datapoints5];
              const sameseries = [];
              for (let i = 0; i < percentSets.length; i++) {
                if (percentSets[i][index] === value) {
                  sameseries.push(i + 1);
                }
              }
              let msg = 'Päivämäärä: ' + dates[index] + '\n';  
              sameseries.forEach((seriesNum) => {
                const dp = datapoints[seriesNum - 1][index];
                if (dp) {
                  msg += `Sarja ${seriesNum}: ${dp.reps} x ${dp.weight} kg\n`;
                }
              });
              if (sameseries.length === 0) {
                msg += `Sarja: ${value}%`;
              }
              msg += 'Edistys: ' + value + '%';
              alert(msg);
     
           
    }}
        />
      </ScrollView>
      </View>
     
    {showFilter === true ?
      <ProgressFilterpage
      setShowFilter = {setshowFilter}
      onHighlightChange={handleHighlightChange}
      highlight={highlight}
      exercises={handleExerciseChange}
      >
              
      </ProgressFilterpage>
        : null}  

      <View style = {styles.buttonContainer}>
        <TouchableOpacity style = {{padding: 20}} onPress={() => 
          router.push('./historypage')}>    
          <Text style = {{fontSize: 25, color: 'white', fontWeight: 'bold'}}>Takaisin</Text>
        </TouchableOpacity>

        <TouchableOpacity style = {{padding: 20,}} onPress={() => 
          router.push('/')}>    
          <Home name = "home" size={50} color = 'white'></Home>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default ProgressPage;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    gap: 60,
    backgroundColor: '#1E1E1E',
    width: '100%',
    height: '15%',
    padding: 20,
    alignItems: 'center',
  },
  info: {
    backgroundColor: '#1E1E1E',
    flexDirection: 'row',
    height: '14%',
    width: '100%',
    alignSelf: 'flex-start',
  },
  buttonContainer: {
  height: '15%',
  width: '100%',
  backgroundColor: '#1E1E1E',
  alignItems: 'center',
  flexDirection: 'row',
  justifyContent: 'space-between',

  },
  chart: {
    backgroundColor: '#1E1E1E',
    padding: 20,
    width: '100%'
  },
    modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBox: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: 300,
    alignItems: 'center',
    elevation: 5,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#1E1E1E',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
});