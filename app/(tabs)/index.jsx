import { StyleSheet, TouchableOpacity, Text, SafeAreaView, View, Image, StatusBar } from 'react-native';
import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Entypo';
import { useRouter } from 'expo-router';


const Home = () => {
  const router = useRouter();
  const [selectedValue, setSelectedValue] = useState('Jalat');
  
  return (
    <>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light" backgroundColor="#1E1E1E" />
        <View style={styles.header}>
          <Text style={styles.headerText}>Tervetuloa!</Text>
        </View>
        <View style={styles.photoContainer}>
          <Image
            source={require('../../assets/muscular.png')} // Lisää kuva assets-kansiosta
            style={styles.image}
          />
        </View>
        <View style={styles.exerciseContainer}>
          <Text style={{fontSize: 16, fontWeight: '600', color: 'white'}}>Valittu treeni: {selectedValue}</Text>
          <Picker
            selectedValue={selectedValue}
            onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
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
        <View style = {styles.buttonContainer}>
          <TouchableOpacity style={styles.button1} onPress={() => 
            router.push('/historypage')}>
            <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white', padding: 15}}>Treenihistoria</Text>
          </TouchableOpacity>  
          <TouchableOpacity style={styles.button} onPress={() => 
            router.push({
              pathname: '/workoutpage',
              params: { category: selectedValue }, // Lähetetään valittu kategoria
            })}>
            <Icon name="arrow-right" size={60} color="white" />
          </TouchableOpacity>

        </View>
      </SafeAreaView>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({

  container: {
    backgroundColor: '#1E1E1E',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  header: {
    backgroundColor: '#1E1E1E',
    padding: 15,
    width: '100%',
    height: '15%',
    alignItems: 'center',
  },
  headerText: {
    fontFamily: 'Futura',
    color: 'white',
    marginTop: 50,
    fontSize: 25,
    fontWeight: 'bold',


  },
  photoContainer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
  },
  image: {
    width: 250,
    height: 250,
    marginTop: 40,
  },
  exerciseContainer: {
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    height: '47%',
    width: '100%',
    padding: 20,
  },
  picker: {
    padding: 20,
    height: 50,
    width: 250,
    color: 'white',
    backgroundColor: '#1E1E1E',
  },
  buttonContainer: {
    height: 130,
    flexDirection: 'row',
    gap: '150',
    backgroundColor: '#1E1E1E',
    width: '100%',
    borderTopWidth: 2,
    borderTopColor: 'grey',
  },
  button1: {
    backgroundColor: '#1E1E1E',
    width: 170,
    height: 60,
    paddingHorizontal: 2,

  }
  
}); 

