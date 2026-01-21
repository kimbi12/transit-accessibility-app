import { create } from 'zustand';
import { AgentStep, AgentStepId, AgentStepStatus } from '../agent/agentTypes';

interface UIState {
    voiceOverlayOpen: boolean;
    agentTraceOpen: boolean;
    currentAgentTrace: AgentStep[];

    setVoiceOverlayOpen: (open: boolean) => void;
    setAgentTraceOpen: (open: boolean) => void;

    startTrace: (steps: { id: AgentStepId; label: string }[]) => void;
    updateStepStatus: (stepId: AgentStepId, status: AgentStepStatus, detail?: string) => void;
    clearTrace: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    voiceOverlayOpen: false,
    agentTraceOpen: false,
    currentAgentTrace: [],

    setVoiceOverlayOpen: (open) => set({ voiceOverlayOpen: open }),
    setAgentTraceOpen: (open) => set({ agentTraceOpen: open }),

    startTrace: (initialSteps) => set({
        currentAgentTrace: initialSteps.map(step => ({
            ...step,
            status: 'queued'
        })),
        agentTraceOpen: true
    }),

    updateStepStatus: (stepId, status, detail) => set((state) => ({
        currentAgentTrace: state.currentAgentTrace.map((step) =>
            step.id === stepId
                ? {
                    ...step,
                    status,
                    detail,
                    startedAt: status === 'running' ? Date.now() : step.startedAt,
                    finishedAt: status === 'done' || status === 'error' ? Date.now() : step.finishedAt
                }
                : step
        )
    })),

    clearTrace: () => set({ currentAgentTrace: [], agentTraceOpen: false }),
}));
