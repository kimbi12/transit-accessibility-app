import { RouteOption, AccessibilityNeeds, AlertsResponse } from '../types/api';

export type HomeStackParamList = {
    ChooseLocation: undefined;
    RouteResults: {
        routes: RouteOption[];
        needs?: AccessibilityNeeds;
        alerts?: AlertsResponse;
        recommendedRouteId: string;
        explanation: string;
    };
    RouteDetails: {
        routeId: string;
    };
    TripStart: {
        routeId: string;
    };
    StepByStep: {
        routeId: string;
    };
    Notifications: undefined;
    StationAccessibility: {
        stationId: string;
    };
};

export type AccountStackParamList = {
    Profile: undefined;
    Settings: undefined;
};
