export type AgentStepId =
    | 'parse_needs'
    | 'plan_routes'
    | 'fetch_alerts'
    | 'rank_routes'
    | 'explain';

export type AgentStepStatus = 'queued' | 'running' | 'done' | 'error';

export interface AgentStep {
    id: AgentStepId;
    label: string;
    status: AgentStepStatus;
    detail?: string;
    startedAt?: number;
    finishedAt?: number;
}
