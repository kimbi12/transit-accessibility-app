import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { ThemedText } from '@/components/ThemedText';
import { HomeStackParamList } from '@/src/navigation/types';

export default function StationAccessibilityScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const { stationId } = useLocalSearchParams<HomeStackParamList['StationAccessibility']>();

    // Mock data for demo
    const features = [
        { id: '1', name: 'Elevator to Platform', status: 'operational', icon: 'arrow-up-circle' },
        { id: '2', name: 'Accessible Restroom', status: 'operational', icon: 'man' },
        { id: '3', name: 'Tactile Paving', status: 'operational', icon: 'footsteps' },
        { id: '4', name: 'Audio Announcements', status: 'maintenance', icon: 'volume-high' },
    ];

    return (
        <ScrollView style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
            <View style={styles.header}>
                <View style={styles.stationIcon}>
                    <Ionicons name="train" size={32} color="#fff" />
                </View>
                <View>
                    <ThemedText type="title">Station {stationId}</ThemedText>
                    <ThemedText style={{ color: Colors[colorScheme].icon }}>Accessibility Profile</ThemedText>
                </View>
            </View>

            <View style={styles.grid}>
                {features.map((feature) => (
                    <View key={feature.id} style={[styles.featureCard, { backgroundColor: Colors[colorScheme].card }]}>
                        <View style={styles.iconRow}>
                            <Ionicons name={feature.icon as any} size={24} color={Colors[colorScheme].text} />
                            <View style={[styles.statusDot, { backgroundColor: feature.status === 'operational' ? 'green' : 'orange' }]} />
                        </View>
                        <ThemedText type="defaultSemiBold" style={{ marginTop: 10 }}>{feature.name}</ThemedText>
                        <ThemedText style={{ fontSize: 12, color: Colors[colorScheme].icon, textTransform: 'capitalize' }}>{feature.status}</ThemedText>
                    </View>
                ))}
            </View>

            <TouchableOpacity style={[styles.reportButton, { borderColor: Colors[colorScheme].error }]}>
                <Ionicons name="alert-circle" size={20} color={Colors[colorScheme].error} />
                <ThemedText style={{ color: Colors[colorScheme].error, fontWeight: 'bold' }}>Report Issue</ThemedText>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        gap: 15,
    },
    stationIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#0a7ea4',
        justifyContent: 'center',
        alignItems: 'center',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 15,
    },
    featureCard: {
        width: '47%',
        padding: 15,
        borderRadius: 16,
        marginBottom: 0,
    },
    iconRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    reportButton: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        borderRadius: 12,
        borderWidth: 2,
        gap: 10,
        marginBottom: 40,
    }
});
