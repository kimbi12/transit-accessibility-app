import { api } from './api';
import { RouteOption, AccessibilityNeeds } from '../types/api';

export const RoutesService = {
    /**
     * Plan a route between two locations with accessibility preferences
     */
    async planRoute(
        origin: string,
        destination: string,
        preferences: AccessibilityNeeds
    ): Promise<RouteOption> {
        const { data } = await api.post<RouteOption>('/routes/plan', {
            origin,
            destination,
            preferences,
        });
        return data;
    },

    /**
     * Get alternative routes if the primary route has issues
     */
    async getAlternativeRoutes(
        originalRouteId: string,
        preferences: AccessibilityNeeds
    ): Promise<RouteOption[]> {
        const { data } = await api.post<RouteOption[]>(`/routes/${originalRouteId}/alternatives`, {
            preferences,
        });
        return data;
    },
};
