import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { ThemedText } from '@/components/ThemedText';
import { HomeStackParamList } from '@/src/navigation/types';

export default function RouteResultsScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    // Safe cast for complex params
    const params = useLocalSearchParams() as unknown as HomeStackParamList['RouteResults'];

    const { routes = [], needs, alerts, recommendedRouteId, explanation } = params;
    const [whyExpanded, setWhyExpanded] = useState(true);

    // If passed as JSON strings via URL (common in Expo Router if not using state store), parsing might be needed.
    // But assumming we used router.push({ params: object }), Expo Router serializes.
    // If array arrives as string, we parse. 
    const safeRoutes = typeof routes === 'string' ? JSON.parse(routes) : routes;
    const safeNeeds = typeof needs === 'string' ? JSON.parse(needs) : needs;

    const renderRouteItem = ({ item }: { item: any }) => {
        const isRecommended = item.route_id === recommendedRouteId;
        return (
            <TouchableOpacity
                style={[styles.card, { backgroundColor: Colors[colorScheme].card, borderColor: isRecommended ? Colors[colorScheme].primary : 'transparent', borderWidth: 2 }]}
                onPress={() => router.push({ pathname: '/route-details', params: { routeId: item.route_id } })}
            >
                <View style={styles.routeHeader}>
                    <View style={styles.routeInfo}>
                        <ThemedText type="defaultSemiBold">{item.estimated_time_minutes} min</ThemedText>
                        <ThemedText style={{ color: Colors[colorScheme].icon }}>• {item.stops_count} stops</ThemedText>
                    </View>
                    {isRecommended && (
                        <View style={[styles.badge, { backgroundColor: Colors[colorScheme].primary }]}>
                            <ThemedText style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>BEST CHOICE</ThemedText>
                        </View>
                    )}
                </View>

                <View style={styles.accessIcons}>
                    {item.wheelchair_accessible && <Ionicons name="body" size={16} color={Colors[colorScheme].text} style={{ marginRight: 8 }} />}
                    {item.has_elevator && <View style={styles.iconBadge}><ThemedText style={{ fontSize: 10 }}>ELV</ThemedText></View>}
                    {item.audio_assistance_available && <Ionicons name="volume-high" size={16} color={Colors[colorScheme].text} />}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
            <View style={styles.header}>
                <ThemedText type="title">Suggested Routes</ThemedText>
                <ThemedText style={{ color: Colors[colorScheme].icon }}>Based on your needs</ThemedText>
            </View>

            {/* Why Accordion */}
            <View style={[styles.accordion, { backgroundColor: Colors[colorScheme].card }]}>
                <TouchableOpacity
                    style={styles.accordionHeader}
                    onPress={() => setWhyExpanded(!whyExpanded)}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="sparkles" size={18} color={Colors[colorScheme].primary} style={{ marginRight: 8 }} />
                        <ThemedText type="defaultSemiBold">Why this route?</ThemedText>
                    </View>
                    <Ionicons name={whyExpanded ? "chevron-up" : "chevron-down"} size={20} color={Colors[colorScheme].icon} />
                </TouchableOpacity>

                {whyExpanded && (
                    <View style={styles.accordionContent}>
                        <ThemedText>{explanation}</ThemedText>
                    </View>
                )}
            </View>

            <ThemedText type="subtitle" style={{ marginVertical: 15 }}>Options</ThemedText>

            {/* List of Routes */}
            {/* Using map instead of FlatList since inside ScrollView */}
            {Array.isArray(safeRoutes) && safeRoutes.map((route: any) => (
                <View key={route.route_id} style={{ marginBottom: 15 }}>
                    {renderRouteItem({ item: route })}
                </View>
            ))}

            {(!safeRoutes || safeRoutes.length === 0) && (
                <ThemedText style={{ color: Colors[colorScheme].Error }}>No routes found.</ThemedText>
            )}

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        marginBottom: 20,
    },
    accordion: {
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
    },
    accordionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    accordionContent: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: 'rgba(150,150,150,0.1)',
    },
    card: {
        padding: 15,
        borderRadius: 12,
    },
    routeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    routeInfo: {
        flexDirection: 'row',
        gap: 5,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    accessIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    iconBadge: {
        borderWidth: 1,
        borderColor: '#888',
        borderRadius: 4,
        paddingHorizontal: 4,
    }
});
