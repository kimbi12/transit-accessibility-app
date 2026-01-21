import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { ThemedText } from '@/components/ThemedText';
import { HomeStackParamList } from '@/src/navigation/types';

export default function StepByStepScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const { routeId } = useLocalSearchParams<HomeStackParamList['StepByStep']>();

    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        { id: 1, type: 'walk', instruction: 'Walk 2 mins to Entrance A', note: 'Use ramp on left side' },
        { id: 2, type: 'wait', instruction: 'Wait for Line 1 Train', note: 'Next train in 4 mins' },
        { id: 3, type: 'ride', instruction: 'Ride 3 stops to Central', note: 'Audio announcement available' },
        { id: 4, type: 'exit', instruction: 'Exit at Central Station', note: 'Elevator near car 3' },
    ];

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            router.back(); // End trip
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
            <View style={styles.header}>
                <ThemedText type="title">Navigation</ThemedText>
                <ThemedText style={{ color: Colors[colorScheme].primary, fontWeight: 'bold' }}>Live Guidance</ThemedText>
            </View>

            <ScrollView style={styles.stepsContainer}>
                {steps.map((step, index) => {
                    const isActive = index === currentStep;
                    const isDone = index < currentStep;

                    return (
                        <View key={step.id} style={styles.stepRow}>
                            <View style={styles.timeline}>
                                <View style={[
                                    styles.dot,
                                    {
                                        backgroundColor: isActive ? Colors[colorScheme].primary : isDone ? Colors[colorScheme].text : '#ccc',
                                        width: isActive ? 16 : 12,
                                        height: isActive ? 16 : 12,
                                        borderRadius: isActive ? 8 : 6
                                    }
                                ]} />
                                {index < steps.length - 1 && <View style={[styles.line, { backgroundColor: isDone ? Colors[colorScheme].text : '#ccc' }]} />}
                            </View>

                            <View style={[styles.stepCard, isActive && { backgroundColor: Colors[colorScheme].card, elevation: 2 }]}>
                                <ThemedText type={isActive ? 'defaultSemiBold' : 'default'} style={{ opacity: isDone ? 0.5 : 1 }}>
                                    {step.instruction}
                                </ThemedText>
                                {step.note && (
                                    <View style={styles.noteContainer}>
                                        <Ionicons name="information-circle-outline" size={14} color={Colors[colorScheme].icon} />
                                        <ThemedText style={{ fontSize: 12, color: Colors[colorScheme].icon }}>{step.note}</ThemedText>
                                    </View>
                                )}
                            </View>
                        </View>
                    );
                })}
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: Colors[colorScheme].primary }]}
                    onPress={handleNext}
                >
                    <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>
                        {currentStep < steps.length - 1 ? 'Next Step' : 'Finish Trip'}
                    </ThemedText>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 15,
    },
    stepsContainer: {
        flex: 1,
    },
    stepRow: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    timeline: {
        alignItems: 'center',
        width: 30,
        marginRight: 10,
    },
    dot: {
        marginTop: 4,
    },
    line: {
        width: 2,
        flex: 1,
        marginTop: 4,
    },
    stepCard: {
        flex: 1,
        padding: 15,
        borderRadius: 12,
    },
    noteContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginTop: 5,
    },
    footer: {
        marginTop: 20,
    },
    button: {
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
