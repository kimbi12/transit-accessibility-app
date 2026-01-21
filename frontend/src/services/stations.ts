import { api } from './api';
import { StationAccessibilityInfo } from '../types/api';

export const StationsService = {
    /**
     * Find stations near a specific location
     */
    async getNearbyStations(latitude: number, longitude: number, radiusMeters: number = 1000): Promise<StationAccessibilityInfo[]> {
        const { data } = await api.get<StationAccessibilityInfo[]>(`/stations/nearby?lat=${latitude}&long=${longitude}&radius=${radiusMeters}`);
        return data;
    },

    /**
     * Get full details for a specific station
     */
    async getStationDetails(stationId: string): Promise<StationAccessibilityInfo> {
        const { data } = await api.get<StationAccessibilityInfo>(`/stations/${stationId}`);
        return data;
    },

    /**
     * Search stations by name or line
     */
    async searchStations(query: string): Promise<StationAccessibilityInfo[]> {
        const { data } = await api.get<StationAccessibilityInfo[]>(`/stations/search?q=${encodeURIComponent(query)}`);
        return data;
    },
};
