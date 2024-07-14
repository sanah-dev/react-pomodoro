import { atom } from "recoil";

export interface TimerState {
  time: number;
  roundsCompleted: number;
  goalsCompleted: number;
  isRunning: boolean;
}

export const initialTimerState: TimerState = {
  // time: 3,
  time: 25 * 60, // 초 단위로 설정 (25분)
  roundsCompleted: 0,
  goalsCompleted: 0,
  isRunning: false,
};

export const MAX_ROUNDS = 4;
export const MAX_GOALS = 12;

export const timerState = atom<TimerState>({
  key: "timerState",
  default: initialTimerState,
});
