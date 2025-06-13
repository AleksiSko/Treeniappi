import React from 'react';
import Slider from '@react-native-community/slider';
import { Text, View, StyleSheet,TouchableOpacity } from 'react-native';
import PlusIcon from 'react-native-vector-icons/Entypo'
import MinusIcon from 'react-native-vector-icons/Entypo'


export default function Set1 ({ RepsliderValue, WeightsliderValue, onRepChange, onWeightChange, index } ) {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20 }}>Sarja {index}:</Text>
      <Text style={styles.text}>Toistot: {RepsliderValue}</Text>
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={25}
        step={1}
        value={RepsliderValue}
        onValueChange={onRepChange}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
      />
      <Text style={styles.text}>Painot: {WeightsliderValue} kg</Text>
      <Slider
        style={styles.slider2}
        minimumValue={1}
        maximumValue={200}
        step={0.5}
        value={WeightsliderValue}
        onValueChange={onWeightChange}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
      />
      <View style = {styles.iconContainer}>
        <TouchableOpacity
          style = {{alignSelf: 'flex-start'}}
          onPress = {() => {
            onWeightChange(Math.max(1, WeightsliderValue - 0.5))      

          }}>
          <MinusIcon name = "minus" color = {'white'} size = {40} ></MinusIcon>  

        </TouchableOpacity>
        <TouchableOpacity
          style = {{alignSelf: 'flex-end'}}
          onPress = {() => {
            onWeightChange(Math.min(200, WeightsliderValue + 0.5))      

          }}>
          <PlusIcon name = "plus" color = {'white'} size = {40}></PlusIcon>  

        </TouchableOpacity>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    alignItems: 'center',
  },
  iconContainer: {
    position: 'relative',
    justifyContent: 'space-between',
    height: '15%',
    backgroundColor: '#1E1E1E',
    width: 400,
    flexDirection: 'row',
     paddingHorizontal: 20,

  },
  text: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
  },
  slider: {
    width: 350,
    height: 40,
    marginTop: 10,
  },
  slider2: {
    width: 350,
    height: 40,
    marginTop: 10,
  },
});

