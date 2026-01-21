// Core API Response Wrappers
export interface ApiResponse<T> {
    data: T;
    meta?: {
        total?: number;
        page?: number;
        limit?: number;
    };
}

export interface ErrorResponse {
    message: string;
    code: string;
}

// Backend Response Types

export interface RouteOption {
    route_id: string;
    origin: string;
    destination: string;
    mode: string;
    estimated_time_minutes: number;
    stops_count: number;
    accessibility_score: number;
    has_elevator: boolean;
    wheelchair_accessible: boolean;
    audio_assistance_available: boolean;
}

export interface AccessibilityNeeds {
    needs_step_free: boolean;
    max_transfers: number;
    avoid_long_walks: boolean;
    needs_audio: boolean;
    needs_visual: boolean;
}

export type AccessibilityFeature =
    | 'elevator'
    | 'ramp'
    | 'braille'
    | 'audio_guidance'
    | 'visual_display'
    | 'accessible_restroom'
    | 'level_boarding'
    | string;

export interface StationAccessibilityInfo {
    station_id: string;
    station_name: string;
    features: AccessibilityFeature[];
    wheelchair_accessible: boolean;
    audio_announcements: boolean;
    visual_displays: boolean;
    elevators_working: boolean;
    accessible_restrooms: boolean;
}

export interface AccessibilityAlert {
    alert_id: string;
    station_id: string;
    station_name: string;
    severity: 'low' | 'medium' | 'high';
    message: string;
    affected_accessibility: string;
    estimated_resolution_time: string;
}

export interface AlertsResponse {
    alerts: AccessibilityAlert[];
}
