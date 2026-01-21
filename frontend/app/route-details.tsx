import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { ThemedText } from '@/components/ThemedText';
import { HomeStackParamList } from '@/src/navigation/types';

export default function RouteDetailsScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const { routeId } = useLocalSearchParams<HomeStackParamList['RouteDetails']>();

    return (
        <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>

            {/* Map Placeholder */}
            <View style={[styles.mapPlaceholder, { backgroundColor: Colors[colorScheme].card }]}>
                <Ionicons name="map" size={48} color={Colors[colorScheme].icon} />
                <ThemedText style={{ color: Colors[colorScheme].icon, marginTop: 10 }}>Map View Placeholder</ThemedText>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.header}>
                    <ThemedText type="title">Route Details</ThemedText>
                    <ThemedText style={{ color: Colors[colorScheme].icon }}>ID: {routeId}</ThemedText>
                </View>

                <View style={[styles.infoCard, { backgroundColor: Colors[colorScheme].card }]}>
                    <View style={styles.row}>
                        <Ionicons name="time-outline" size={24} color={Colors[colorScheme].text} />
                        <View>
                            <ThemedText type="defaultSemiBold">25 min</ThemedText>
                            <ThemedText style={{ fontSize: 12 }}>Total time</ThemedText>
                        </View>
                    </View>
                    <View style={styles.separator} />
                    <View style={styles.row}>
                        <Ionicons name="walk" size={24} color={Colors[colorScheme].text} />
                        <View>
                            <ThemedText type="defaultSemiBold">5 min</ThemedText>
                            <ThemedText style={{ fontSize: 12 }}>Walking</ThemedText>
                        </View>
                    </View>
                </View>

                <ThemedText type="subtitle" style={{ marginVertical: 15 }}>Stops</ThemedText>
                {/* Placeholder Stops List */}
                {[1, 2, 3].map((s) => (
                    <View key={s} style={styles.stopItem}>
                        <View style={[styles.lineDot, { backgroundColor: Colors[colorScheme].primary }]} />
                        <ThemedText style={{ marginLeft: 15 }}>Station {s}</ThemedText>
                    </View>
                ))}

            </ScrollView>

            <View style={[styles.footer, { backgroundColor: Colors[colorScheme].background, borderTopColor: Colors[colorScheme].card }]}>
                <TouchableOpacity
                    style={[styles.startButton, { backgroundColor: Colors[colorScheme].primary }]}
                    onPress={() => router.push({ pathname: '/step-by-step', params: { routeId: routeId! } })}
                >
                    <ThemedText style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Start Trip</ThemedText>
                    <Ionicons name="arrow-forward" size={24} color="#fff" style={{ marginLeft: 10 }} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mapPlaceholder: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    header: {
        marginBottom: 20,
    },
    infoCard: {
        flexDirection: 'row',
        padding: 20,
        borderRadius: 16,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
    },
    separator: {
        width: 1,
        height: '100%',
        backgroundColor: '#ccc',
    },
    stopItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        paddingLeft: 10,
    },
    lineDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
    },
    startButton: {
        flexDirection: 'row',
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
