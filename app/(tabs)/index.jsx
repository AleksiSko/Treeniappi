import { StyleSheet, Text, View,SafeAreaView, Image, StatusBar, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import WorkoutPage from '../components/workoutpage'; 



const Home = () => {
  const router = useRouter();
  const [selectedValue, setSelectedValue] = useState('Jalat');
  const [showWorkoutPage, setShowWorkoutPage] = useState(false);

  const handlePress = () => {
  showWorkoutPage ? setShowWorkoutPage(false) : setShowWorkoutPage(true);
  };

return (
  <>
    {showWorkoutPage ? (
      <WorkoutPage 
        category={selectedValue} 
        onSavePress={handlePress}
      />
    ) : (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Tervetuloa!</Text>
        </View>
        <View style={styles.photoContainer}>
          <Image
            source={require('../../assets/muscular.png')}
            style={styles.image}
          />
        </View>
        <View style={styles.exerciseContainer}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: 'white' }}>
            Valittu treeni: {selectedValue}
          </Text>
          <Picker
            selectedValue={selectedValue}
            onValueChange={(itemValue) => setSelectedValue(itemValue)}
            style={styles.picker}
            itemStyle={{ color: 'white' }}
          >
            <Picker.Item label="Jalat" value="Jalat" />
            <Picker.Item label="Työntävät" value="Työntävät" />
            <Picker.Item label="Vetävät" value="Vetävät" />
            <Picker.Item label="Rinta/Hauis" value="Rinta/Hauis" />
            <Picker.Item label="Selkä/Ojentajat" value="Selkä/Ojentajat" />
            <Picker.Item label="Kädet" value="Kädet" />
          </Picker>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Lisää treeni</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )}
  </>
);
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  header: {
    backgroundColor: '#1E1E1E',
    width: '100%',
    height: '12%',
    alignItems: 'center',
    justifyContent: 'center',
    
 
  },
  headerText: {
    fontFamily: 'Futura',
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
  photoContainer: {
    width: '100%',
    backgroundColor: '#1E1E1E',
    height: '35%',
    alignItems: 'center',
  },
  image: {
    width: 250,
    height: 250,
  },
  exerciseContainer: {
    height: '40%',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    padding: 20,
  },
  buttonContainer: {
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E1E1E',
  },
  button: {
    backgroundColor: '#1E1E1E',
    width: 200,
    height: 50,
    padding: 2,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'white',
  },
  picker: {
    padding: 20,
    height: 50,
    width: 250,
    color: 'white',
    backgroundColor: '#1E1E1E',
  },
});
