import { View, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { ThemedText } from '@/components/ThemedText';
import { AccessibilityAlert } from '@/src/types/api';

// Create a mock list for the demo since we aren't fetching live in this screen yet (or passed via params)
const MOCK_ALERTS: AccessibilityAlert[] = [
    {
        alert_id: '1',
        station_id: 'st_1',
        station_name: 'Central Station',
        severity: 'high',
        message: 'Elevator 3 at Platform 2 is out of service for maintenance.',
        affected_accessibility: 'wheelchair',
        estimated_resolution_time: '2 hours',
    },
    {
        alert_id: '2',
        station_id: 'st_2',
        station_name: 'North Ave',
        severity: 'medium',
        message: 'Escalator down towards exit.',
        affected_accessibility: 'needs_step_free',
        estimated_resolution_time: '1 day',
    }
];

export default function NotificationsScreen() {
    const colorScheme = useColorScheme() ?? 'light';

    const renderAlert = ({ item }: { item: AccessibilityAlert }) => (
        <View style={[styles.alertCard, { backgroundColor: Colors[colorScheme].card }]}>
            <View style={styles.alertHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Ionicons
                        name="warning"
                        size={24}
                        color={item.severity === 'high' ? Colors[colorScheme].error : '#FFA000'}
                    />
                    <ThemedText type="defaultSemiBold">{item.station_name}</ThemedText>
                </View>
                <ThemedText style={{ fontSize: 12, color: Colors[colorScheme].icon }}>{item.estimated_resolution_time}</ThemedText>
            </View>

            <ThemedText style={{ marginTop: 10 }}>{item.message}</ThemedText>
            <View style={styles.tagContainer}>
                <View style={[styles.tag, { borderColor: Colors[colorScheme].icon }]}>
                    <ThemedText style={{ fontSize: 10, color: Colors[colorScheme].icon }}>{item.affected_accessibility}</ThemedText>
                </View>
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
            <FlatList
                data={MOCK_ALERTS}
                keyExtractor={(item) => item.alert_id}
                renderItem={renderAlert}
                contentContainerStyle={{ padding: 20 }}
                ListHeaderComponent={() => (
                    <View style={{ marginBottom: 20 }}>
                        <ThemedText type="title">Alerts</ThemedText>
                        <ThemedText style={{ color: Colors[colorScheme].icon }}>System Impacts Update</ThemedText>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    alertCard: {
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
    },
    alertHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    tagContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    tag: {
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
    }
});
