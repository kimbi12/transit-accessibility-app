import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { ThemedText } from '@/components/ThemedText';
import { useUIStore } from '@/src/state/uiStore';
import { VoiceAssistantOverlay } from '@/components/VoiceAssistantOverlay';

export default function ChooseLocationScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const setVoiceOverlayOpen = useUIStore((state) => state.setVoiceOverlayOpen);

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <View style={styles.header}>
        <ThemedText type="title">Where to?</ThemedText>
        <ThemedText style={{ color: Colors[colorScheme].icon }}>Plan your accessible journey</ThemedText>
      </View>

      <TouchableOpacity
        style={[styles.searchButton, { backgroundColor: Colors[colorScheme].card }]}
        onPress={() => setVoiceOverlayOpen(true)}
      >
        <Ionicons name="search" size={20} color={Colors[colorScheme].icon} style={{ marginRight: 10 }} />
        <ThemedText style={{ color: Colors[colorScheme].icon }}>Search destination...</ThemedText>
        <View style={[styles.micIcon, { backgroundColor: Colors[colorScheme].primary }]}>
          <Ionicons name="mic" size={20} color="#fff" />
        </View>
      </TouchableOpacity>

      <View style={styles.recentSection}>
        <ThemedText type="subtitle" style={{ marginBottom: 15 }}>Recent Places</ThemedText>
        {/* Placeholder for recent places */}
        <TouchableOpacity style={[styles.placeItem, { borderBottomColor: Colors[colorScheme].card }]}>
          <View style={[styles.placeIcon, { backgroundColor: Colors[colorScheme].card }]}>
            <Ionicons name="time" size={20} color={Colors[colorScheme].text} />
          </View>
          <View>
            <ThemedText type="defaultSemiBold">Central Station</ThemedText>
            <ThemedText style={{ fontSize: 12, color: Colors[colorScheme].icon }}>Via accessible entrance</ThemedText>
          </View>
        </TouchableOpacity>
      </View>

      <VoiceAssistantOverlay />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 30,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    marginBottom: 40,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  micIcon: {
    marginLeft: 'auto',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentSection: {
    flex: 1,
  },
  placeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    gap: 15,
  },
  placeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
