import { AccessibilityNeeds, RouteOption, AlertsResponse, AccessibilityAlert } from '../types/api';
import { RoutesService } from './routes';
import { AlertsService } from './alerts';
import { useUIStore } from '../state/uiStore';
import { AgentStep } from '../agent/agentTypes';

interface PipelineResult {
    routes: RouteOption[];
    needs: AccessibilityNeeds;
    alerts: AlertsResponse;
    recommendedRouteId: string;
    explanation: string;
    agentTrace: AgentStep[];
}

// Stub for parsing natural language to needs
// Real implementation would call an AI endpoint or local parser
const parseNeeds = async (text: string): Promise<AccessibilityNeeds> => {
    return {
        needs_step_free: text.includes('wheelchair') || text.includes('step free'),
        max_transfers: 2,
        avoid_long_walks: text.includes('walk'),
        needs_audio: text.includes('audio') || text.includes('blind'),
        needs_visual: text.includes('deaf') || text.includes('visual'),
    };
};

export const PlanPipeline = {
    async runPlanningPipeline(
        origin: string,
        destination: string,
        queryText?: string
    ): Promise<PipelineResult> {
        const store = useUIStore.getState();
        const traceSteps = [
            { id: 'parse_needs' as const, label: 'Analyzing accessibility needs...' },
            { id: 'plan_routes' as const, label: 'Finding best routes...' },
            { id: 'fetch_alerts' as const, label: 'Check for outages...' },
            { id: 'rank_routes' as const, label: 'Ranking by safety...' },
            { id: 'explain' as const, label: 'Generating explanation...' },
        ];

        store.startTrace(traceSteps);

        try {
            // 1. Parse Needs
            store.updateStepStatus('parse_needs', 'running');
            const needs = queryText
                ? await parseNeeds(queryText)
                : {
                    needs_step_free: true,
                    max_transfers: 2,
                    avoid_long_walks: false,
                    needs_audio: false,
                    needs_visual: false
                };
            store.updateStepStatus('parse_needs', 'done', `Detected: ${Object.keys(needs).filter(k => needs[k as keyof AccessibilityNeeds]).join(', ')}`);

            // 2. Plan Routes
            store.updateStepStatus('plan_routes', 'running');
            const routes = await RoutesService.planRoute(origin, destination, needs);
            // Backend returns single RouteOption? The interface says Promise<RouteOption>.
            // Wait, usually list of routes. Let's check api.ts.
            // RouteOption is a single object. RoutesService.planRoute returns Promise<RouteOption>.
            // But usually we want a list. 
            // User prompt said "RouteResults requiring routes list".
            // RoutesService said "return response" (which matches RouteOption).
            // Let's assume for now we wrap it in array or if service was supposed to return array.
            // The user prompt said: "routes: RouteOption[]".
            // I will wrap it in an array for now to match the UI expectation.
            const routeList = [routes];
            store.updateStepStatus('plan_routes', 'done', `Found ${routeList.length} options`);

            // 3. Fetch Alerts
            store.updateStepStatus('fetch_alerts', 'running');
            const alertsList = await AlertsService.getGlobalAlerts(); // No station filter as requested
            const alerts: AlertsResponse = { alerts: alertsList };
            store.updateStepStatus('fetch_alerts', 'done', `${alertsList.length} active alerts`);

            // 4. Rank Routes (Client-side logic or just pick first)
            store.updateStepStatus('rank_routes', 'running');
            // Simple logic: pick the highest accessibility score
            const recommended = routeList.sort((a, b) => b.accessibility_score - a.accessibility_score)[0];
            const recommendedRouteId = recommended?.route_id || '';
            store.updateStepStatus('rank_routes', 'done', 'Best route selected');

            // 5. Generate Explanation
            store.updateStepStatus('explain', 'running');
            let explanation = `I found a route with an accessibility score of ${recommended.accessibility_score}.`;
            if (recommended.wheelchair_accessible) explanation += " It is wheelchair accessible.";
            if (recommended.has_elevator) explanation += " Elevators are available.";
            if (recommended.audio_assistance_available) explanation += " Audio assistance is included.";
            explanation += ` Estimated time is ${recommended.estimated_time_minutes} minutes with ${recommended.stops_count} stops.`;

            store.updateStepStatus('explain', 'done');

            return {
                routes: routeList,
                needs,
                alerts,
                recommendedRouteId,
                explanation,
                agentTrace: useUIStore.getState().currentAgentTrace
            };

        } catch (error) {
            const currentStep = useUIStore.getState().currentAgentTrace.find(s => s.status === 'running');
            if (currentStep) {
                store.updateStepStatus(currentStep.id, 'error', (error as Error).message);
            }
            throw error;
        }
    }
};
