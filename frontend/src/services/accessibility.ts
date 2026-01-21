import { api } from './api';
import { StationAccessibilityInfo } from '../types/api';

export const AccessibilityService = {
    /**
     * Get detailed accessibility status for a specific station
     */
    async getStationAccessibility(stationId: string): Promise<StationAccessibilityInfo> {
        const { data } = await api.get<StationAccessibilityInfo>(`/stations/${stationId}/accessibility`);
        return data;
    },

    /**
     * Validate if a route is currently accessible based on real-time data
     */
    async validateRouteAccessibility(routeId: string): Promise<{ accessible: boolean; issues: string[] }> {
        const { data } = await api.get<{ accessible: boolean; issues: string[] }>(`/routes/${routeId}/validate`);
        return data;
    },
};
