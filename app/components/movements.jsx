import { useRouter, useLocalSearchParams } from 'expo-router';
import { StyleSheet, TouchableOpacity, Text, View, SafeAreaView, PanResponder, FlatList } from 'react-native';


export default function MovementsPage ({workoutData, category}) {

    return (
        <View style={styles.workoutLog}>
          <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}>Treeni: {category}</Text>
        <FlatList
          data={workoutData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: 'grey' }}>
              <Text style={{ color: 'black', fontSize: 16 }}>Liike: {item.exercise}</Text>
              {item.sets.map((set, index) => (
                <Text key={index} style={{ color: 'black', fontSize: 16 }}>
                  Sarja {index + 1}: {set.reps} x {set.weight} kg
                </Text>
              ))}
            </View>
          )}
        />
      </View>

    )
}


const styles = StyleSheet.create({
    workoutLog: {
        position: 'absolute',
        backgroundColor: 'white',
        width: '100%',
        alignItems: 'center',
        height: '60%',
        top: 20,
        zIndex: 10,
      },
})      