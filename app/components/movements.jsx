import { useRouter, useLocalSearchParams } from 'expo-router';
import { StyleSheet, TouchableOpacity, Text, View, SafeAreaView, PanResponder, FlatList, ScrollView } from 'react-native';


export default function MovementsPage ({workoutData, category}) {

    return (
        <View style={styles.workoutLog}>
          <Text style={{ color: 'white', fontSize: 30, fontWeight: 'bold' }}>Treeni: {category}</Text>
          <FlatList
            data={workoutData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: 'grey' }}>
                <Text style={{ color: 'white', fontSize: 18 }}>Liike: {item.exercise}</Text>
                {item.sets.map((set, index) => (
                  <Text key={index} style={{ color: 'white', fontSize: 18, fontWeight: 200 }}>
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
        backgroundColor: '#1E1E1E',
        width: '100%',
        alignItems: 'center',
        height: 400,
        top: -40,
        zIndex: 0
      },
})      