import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList,Keyboard, TouchableWithoutFeedback, ScrollView, KeyboardAvoidingView } from 'react-native'
import React, { useState,useEffect, useRef,useMemo  } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons'
import FilterPage from '../components/filterpage';
import Dots from 'react-native-vector-icons/Entypo'
import { Menu, Provider, TextInput } from 'react-native-paper';
import PlusIcon from 'react-native-vector-icons/Entypo'
import { Swipeable } from 'react-native-gesture-handler';
import exercises from '../components/exercises.json';
import specificexercises from '../components/specificexercises.json';
import TrashIcon from 'react-native-vector-icons/EvilIcons'



const historypage = () => {

  const [showFilter, setshowFilter] = useState(false);
  const [filter, setFilter] = useState('Kaikki'); 
  const [highlight, setHighlight] = useState(false);
  const [workoutData, setWorkoutData] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [editText, setEdittext] = useState();
  const [editDate, setEditDate] = useState();
  const [editItem, setEditItem] = useState(null);
  const router = useRouter();
  const data = ['all','legs', 'push', 'chest/bi'];
  const [dates, setDates] = useState([]);
  const [timefilter, setTimeFilter] = useState('1');
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [menuAnchor, setMenuAnchor] = React.useState(null);
  const [addNewset, setAddNewSet] = useState(false);
  const [addNewExercise, setAddnewExercise] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState();
  const [selectedSpecifiedExercise,setSelectedSpecifiedExercise] = useState();
  const [showExerciseList, setShowExerciseList] = useState(true);
  const [showSpecifiedExerciseList, setShowSpecifiedExerciseList] = useState(false)

  



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
const handleDelete = async (value) => {
  try {
  const Data = await AsyncStorage.getItem('my-workouts');
  const ParsedData = JSON.parse(Data).flat()
  const newData = ParsedData.filter(
  item => !(item.id === value.id)
  );
  console.log(newData)
  setWorkoutData(newData);
  await AsyncStorage.setItem('my-workouts', JSON.stringify(newData));
  }
  catch (e) {
    console.error('Error reading filter data:', e);c
  }
};
const handleEdit = async () => {
  try {
  const updatedData = workoutData.map(item => {
    if (item.id === editItem.id) {
      return editItem
    }
    return item;  
  });
  setWorkoutData(updatedData);
  await AsyncStorage.setItem('my-workouts', JSON.stringify(updatedData));
  setEditItem(null);
  } catch (e) {
    console.error(e)
    }
}
const handleaddnewset = (exerciseindex)  => {
  const updateditem = { ... editItem };

  updateditem.workout[exerciseindex].sets.push({
    reps: 0,
    weight: 0

  })
  setEditItem(updateditem)


}
const handleaddnewexercise = (exercise) => {
  const newWorkout = {
    exercise: exercise,
    sets: [
      {reps: 0, weight: 0}
    ]
  };
  setEditItem(prev => ({
    ...prev,
    workout: [...prev.workout, newWorkout]
  }));
  console.log(editItem)

  }

const handleDeleteItem = (exercise) => {
  const updatedWorkout = editItem.workout.filter(item => 
    (item.exercise !== exercise)
  )
  setEditItem(prev => ({
    ...prev,
    workout: updatedWorkout
  }))
}


  return (
  <Provider>
    <SafeAreaView style = {styles.container}>
      {showEdit && ( 
        <View style={styles.editOverlay}></View>
      )}
      <View style = {styles.header}>
        <Text style = {styles.HeaderText}>TreeniHistoria</Text>
      </View>
      <View style = {styles.exerciseContainer}>
        {showEdit && (
          <TouchableWithoutFeedback onPress={() => 
            Keyboard.dismiss()
          }>          
            <KeyboardAvoidingView behavior="position" style={styles.editContainer}>
              {addNewExercise && (      
              <View style = {styles.addNewExerciseContainer}>
                <View style = {styles.addNewExerciseHeaderContainer}>
                <TouchableOpacity
                  onPress={() => setAddnewExercise(false)}>
                  <Text style = {{fontSize: 18, fontStyle: 'bold', alignSelf: 'flex-start', marginHorizontal: 10}}>Peruuta</Text>  
                </TouchableOpacity>  
                </View>
                {showExerciseList && (
                <View style = {{flex: 1}}>  
                <FlatList
                data = {exercises[editItem.category]}
                keyExtractor={( item ) => (item)}
                renderItem={({ item }) => (
                  <TouchableOpacity style = {{width: 400, height: 60, backgroundColor: 'grey', borderWidth: 1, borderColor: 'white'}}
                  onPress = {() => {
                    setShowExerciseList(false)
                    setSelectedExercise(item);
                    setShowSpecifiedExerciseList(true)

                  }}>
                  <Text style = {{fontSize: 20, fontStyle: 'bold', alignSelf: 'center', color: 'white'}}>{item}</Text>  
                  </TouchableOpacity>
                )}    
                >
                </FlatList>
                </View>
                )}
                {showSpecifiedExerciseList && (
                <View style = {{flex: 1}}>
                <FlatList
                data = {specificexercises[selectedExercise].filter
                  (item => !editItem.workout.some((workout) => (
                    item === workout.exercise
                  )))
                  
                }
                keyExtractor={( item ) => (item)}
                renderItem={({ item }) => (
                  <TouchableOpacity style = {{width: 400, height: 60, backgroundColor: 'grey', borderWidth: 1, borderColor: 'white'}}
                  onPress = {() => {
                    setAddnewExercise(false)
                    handleaddnewexercise(item)
                    setShowExerciseList(false)
                    setShowSpecifiedExerciseList(false);
                  }}>
                  <Text style = {{fontSize: 20, fontStyle: 'bold', alignSelf: 'center', color: 'white'}}>{item}</Text>  
                  </TouchableOpacity>
                )}    
                >
                </FlatList>
                </View>
                )}   
              </View>
              )}
              <View style = {styles.editHeaderContainer}>
                <TouchableOpacity onPress={() => setShowEdit(false)}>
                <Text style={{color: 'white', fontSize: 18, fontStyle: 'bold'}}>Sulje</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { 
                  if (editItem.workout.every((workout) => (
                      workout.sets.every((sets) => (
                      sets.weight > 0 && sets.reps > 0
                      ))
                    ))) 
                    {
                    setShowEdit(false)
                    handleEdit()
                    }
                
                  }}>
                <Text style={{color: 'white',fontSize: 18, fontStyle: 'bold'}}>Tallenna</Text>
                </TouchableOpacity>
              </View>
            <ScrollView contentContainerStyle = {{flexGrow: 1}}>
            <View style = {{width: 400, height: 30, backgroundColor: '#1E1E1E', marginTop: 15 }}>
              <Text style = {{fontSize: 22, fontStyle: 'bold', alignSelf: 'center', color: 'white'}}>{editItem.category} - {editItem.date}</Text>

            </View>
            {editItem.workout.map((workout, idx) => (
              <View key = {idx} style = {styles.editItemContainer}>
                <View style = {styles.editItemHeaderContainer}> 
                <Text style = {{fontSize: 20, fontStyle: 'bold'}}>{workout.exercise}</Text>
                {editItem.workout.length > 1 && (
                <TouchableOpacity
                  style = {{position: 'absolute', right: 40}}
                  onPress  = {() => {
                    handleDeleteItem(workout.exercise)
                  }}>
                  <TrashIcon name = "trash" size={35} ></TrashIcon>  
                </TouchableOpacity>
                )}
                </View>
              <View style = {styles.editItemInfo}>
                <Text style = {{marginHorizontal: 10, gap: 20}}>Sarja</Text>
                <Text style = {{marginHorizontal: 30}}>Edellinen</Text>
                <Text style = {{marginHorizontal: 30}}>Toistot</Text>
                <Text style = {{marginHorizontal: 30}}>KG</Text>
              </View> 
              {workout.sets.map((sets, setsindex) => (
                <View key = {setsindex} style = {styles.editSetContainer}>       
                  <Text style = {{color: 'black', fontSize: 20, fontStyle: 'bold', fontFamily: 'futura', marginHorizontal: 10}}>{setsindex+1}</Text> 
                  <Text style = {{color: 'grey', fontSize: 17, marginHorizontal:20}}>{sets.reps} x {sets.weight}kg</Text>
                  <TextInput style = {styles.repsinput}
                    value = {sets.reps.toString()}
                    onChangeText = { (text) => {
                      const updatedItem = {...editItem} ;
                      updatedItem.workout[idx].sets[setsindex].reps = text === '' ? 0 : parseInt(text)
                      setEditItem(updatedItem)
                    }}
                      
                    keyboardType = "numeric"
                    selectTextOnFocus={true}
                    maxLength={4}>
                  </TextInput>
                  <TextInput style = {styles.weightinput}
                    value = {sets.weight.toString()}
                    onChangeText = { (text) => {
                      const updatedItem = {...editItem} ;
                      updatedItem.workout[idx].sets[setsindex].weight = text === '' ? 0 : parseFloat(text)
                      setEditItem(updatedItem)
                    }}
                    keyboardType = "numeric"
                    selectTextOnFocus={true}
                    maxLength={4}>
                  </TextInput>
                </View>
              ))}
              <View style = {{width: 350, height: 100, backgroundColor: 'white', marginHorizontal: 12, gap: 20}}>
                <TouchableOpacity style = {styles.newSetButton}
                  onPress = {() => {
                    handleaddnewset(idx)
                  }}>
                  <PlusIcon name = "plus" size={25} color = 'black'>  </PlusIcon>
                  <Text style = {{fontSize: 18, fontStyle: 'bold'}}>Uusi sarja</Text>
                </TouchableOpacity>
                {idx === editItem.workout.length -1 && (
                <TouchableOpacity style = {styles.newExerciseButton}
                  onPress = {() => {
                    setAddnewExercise(true);
                    setShowExerciseList(true);
                    
                  }}>
                  <PlusIcon name = "plus" size={25} color = 'white'>  </PlusIcon>
                  <Text style = {{fontSize: 18, fontStyle: 'bold', color: 'white'}}>Uusi liike</Text>
                </TouchableOpacity>   
                )}                                     
               </View>   
            </View>              
            ))}  
    <View style = {{width: 400, height: 150, backgroundColor: '#1E1E1E'}}></View>                         
    </ScrollView>
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
         
        )}
        
        <View style = {styles.listContainer}>
        
          <FlatList
            style={{ alignSelf: 'center', width: '80%' }}
            data= {sortedData}
            keyExtractor={(item,index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.defaultItem}>
                  <View style = {{padding: 15, flexDirection: 'row'}}>
                  <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>{item.category} - {item.date}</Text>
                  <Menu
                  visible={menuVisible && menuAnchor === index}
                  onDismiss={() => setMenuVisible(false)}
                  anchor={
                    <TouchableOpacity onPress={() => {
                      setMenuAnchor(index);
                      setMenuVisible(true);
                    }}>
                      <Dots name="dots-three-vertical" color="white" size={20} />
                    </TouchableOpacity>
                  }
                  contentStyle={{ backgroundColor: 'white' }}
                >
                  <Menu.Item onPress={() => {
                     setEditItem(JSON.parse(JSON.stringify(item)));
                     setMenuVisible(false);
                     setShowEdit(true);
                     
                     }} 
                     title="Muokkaa" />
                  <Menu.Item onPress={() => { 
                    handleDelete(item); 
                    setMenuVisible(false);}} 
                    title="Poista" />
                  <Menu.Item onPress={() => setMenuVisible(false)} title="Peruuta" />
                </Menu>
                  

                  </View>
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
  </Provider>  

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
    position: 'relative',
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
  editOverlay: {
  position: 'absolute',
  top: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0)', 
  zIndex: 998, 
  justifyContent: 'center',
  alignItems: 'center',
  },
  editContainer: {
  alignItems: 'flex-start',
  position: 'absolute',
  top: 20,
  backgroundColor: '#1E1E1E',
  height: 700,
  width: 400,
  borderRadius: 20,
  zIndex: 999,
  },
  editHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1E1E1E',
    height: 40,
    width: 400,


  },
  editItemContainer: {
    backgroundColor: 'white',
    width: 400,
    padding: 10,
    flex: 1,
    marginTop: 20,
  },
  editItemHeaderContainer: {
    width: 400,
    height: 30,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',

  },
  editItemInfo: {
    flexDirection: 'row',
    width: 400,
    height: 25,
    backgroundColor: 'white',

  },
  editSetContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    width: 400,
    height: 45,
    padding: 10,
    gap: 18,

  },
   addNewExerciseContainer: {
    position: 'absolute',
    top: 0,
    backgroundColor: 'white',
    width: 400,
    height: 700,
    zIndex: 1000,
    alignItems: 'flex-start'

  },
  addNewExerciseHeaderContainer: {
    height: 40,
    width: 400,
    backgroundColor: 'white'

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
  weightinput: {
    height: 25,
    backgroundColor: 'white',
    borderWidth: 1,
    position: 'absolute',
    right: 45
  
  },
  repsinput: {
    height: 25,
    backgroundColor: 'white',
    borderWidth: 1,
    position: 'absolute',
    right: 135,
  
  
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
  dropdown: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 5,
    padding: 10,
    width: 180,
    backgroundColor: 'white',
  },
  dropdownText: { fontSize: 16 },
  dropdownMenu: { width: 180 },
  selectedText: { marginTop: 20, fontSize: 16, color: 'green' },

  newSetButton: {
    borderRadius: 5,
    backgroundColor: 'grey', 
    width: 350, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 10,
    flexDirection: 'row',
  },
  newExerciseButton: {
    borderRadius: 5,
    backgroundColor: 'blue', 
    width: 350, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 10,
    flexDirection: 'row',
  }
})