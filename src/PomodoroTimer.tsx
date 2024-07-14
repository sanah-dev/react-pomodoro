import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { initialTimerState, timerState, TimerState, MAX_ROUNDS, MAX_GOALS } from "./atoms";
import styled from "styled-components";
import { motion } from "framer-motion";
import { SVGAttributes } from "react";

interface Props {}

export function PauseIcon(props: SVGAttributes<SVGElement>) {
  return (
    <svg data-slot='icon' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg' aria-hidden='true' {...props}>
      <path d='M5.75 3a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3.75A.75.75 0 0 0 7.25 3h-1.5ZM12.75 3a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3.75a.75.75 0 0 0-.75-.75h-1.5Z'></path>
    </svg>
  );
}
export function PlayIcon(props: SVGAttributes<SVGElement>) {
  return (
    <svg data-slot='icon' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg' aria-hidden='true' {...props}>
      <path d='M6.3 2.84A1.5 1.5 0 0 0 4 4.11v11.78a1.5 1.5 0 0 0 2.3 1.27l9.344-5.891a1.5 1.5 0 0 0 0-2.538L6.3 2.841Z'></path>
    </svg>
  );
}

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 60px;
`;

const Timer = styled(motion.div)`
  padding: 0;
  font-size: 120px;
  font-weight: 700;
`;

const Button = styled(motion.button)`
  position: relative;
  width: 200px;
  height: 200px;
  border: none;
  border-radius: 100%;
  overflow: hidden;
  background: none;
  color: azure;
  cursor: pointer;

  svg {
    width: 120px;
  }

  &::after {
    z-index: -1;
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    display: block;
    width: 200px;
    height: 200px;
    border-radius: 100%;
    background-color: brown;
  }
`;

const ResultBox = styled.div`
  display: flex;
  gap: 100px;
`;
const Result = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  span {
    line-height: 1.5;
    font-size: 20px;
    font-weight: 700;
    text-transform: uppercase;

    &:first-of-type {
      font-size: 24px;
      opacity: 0.5;
    }
  }
`;

const PomodoroTimer: React.FC<Props> = () => {
  const [timer, setTimer] = useRecoilState<TimerState>(timerState);
  const [animationKey, setAnimationKey] = useState(0);

  // mm:ss
  const formatTime = (seconds: number): string => {
    const mm = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const ss = (seconds % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  };

  // 타이머 토글 버튼
  const handleToggleTimer = () => {
    if (timer.isRunning) {
      setTimer({ ...timer, isRunning: false });
    } else {
      setTimer({ ...timer, isRunning: true });
    }
  };

  // 타이머 종료
  const handleTimerCompletion = () => {
    if (timer.roundsCompleted === MAX_ROUNDS - 1) {
      setTimer({ ...initialTimerState, roundsCompleted: 0, goalsCompleted: timer.goalsCompleted + 1 });
    } else {
      setTimer({ ...initialTimerState, roundsCompleted: timer.roundsCompleted + 1 });
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    // 타이머 실행중
    if (timer.isRunning && timer.time > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => ({ ...prevTimer, time: prevTimer.time - 1 }));
      }, 1000);
    } else if (timer.time === 0) {
      // 타이머 종료시
      setTimer({ ...initialTimerState, roundsCompleted: timer.roundsCompleted + 1 });
      handleTimerCompletion(); // 4초과시 -> 0으로 초기화하고 goals +1
    }
    return () => clearInterval(interval);
  }, [timer, setTimer]);

  useEffect(() => {
    setAnimationKey(animationKey + 1);
  }, [timer.time]);

  return (
    <Content>
      <Timer key={animationKey} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        {formatTime(timer.time)}
      </Timer>

      <Button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }} onClick={handleToggleTimer}>
        {timer.isRunning ? <PauseIcon /> : <PlayIcon />}
      </Button>

      <ResultBox>
        <Result>
          <span>
            {timer.roundsCompleted}/{MAX_ROUNDS}
          </span>
          <span>round</span>
        </Result>

        <Result>
          <span>
            {timer.goalsCompleted}/{MAX_GOALS}
          </span>
          <span>goal</span>
        </Result>
      </ResultBox>
    </Content>
  );
};

export default PomodoroTimer;
