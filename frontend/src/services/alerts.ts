import { api } from './api';
import { AccessibilityAlert, AlertsResponse } from '../types/api';

export const AlertsService = {
    /**
     * Get all active system-wide alerts
     */
    async getGlobalAlerts(): Promise<AccessibilityAlert[]> {
        const { data } = await api.get<AlertsResponse>('/alerts/global');
        return data.alerts;
    },

    /**
     * Get alerts specifically for elevators/escalators
     */
    async getAccessibilityAlerts(): Promise<AccessibilityAlert[]> {
        const { data } = await api.get<AlertsResponse>('/alerts/accessibility');
        return data.alerts;
    },

    /**
     * Subscribe to real-time alerts for a specific route
     */
    async subscribeToRouteAlerts(routeId: string): Promise<AccessibilityAlert[]> {
        const { data } = await api.get<AlertsResponse>(`/routes/${routeId}/alerts`);
        return data.alerts;
    },

    /**
     * Get alerts by station ID
     */
    async getStationAlerts(stationId: string): Promise<AccessibilityAlert[]> {
        const { data } = await api.get<AlertsResponse>(`/stations/${stationId}/alerts`);
        return data.alerts;
    },
};
