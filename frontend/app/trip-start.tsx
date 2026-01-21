import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { HomeStackParamList } from '../src/navigation/types';

export default function TripStartScreen() {
    const { routeId } = useLocalSearchParams<HomeStackParamList['TripStart']>();

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Trip Start: {routeId}</Text>
        </View>
    );
}
