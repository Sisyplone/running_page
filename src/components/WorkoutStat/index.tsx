import React from 'react';
import { intComma } from '@/utils/utils';
import { MAIN_COLOR } from '@/utils/const';


interface WorkoutStatProps {
  value: string;
  description: string;
  pace?: string;
  className?: string;
  distance?: string;
  onClick?: () => void;
  color?: string;
}

const WorkoutStat: React.FC<WorkoutStatProps> = ({
  value,
  description,
  pace,
  className = '',
  distance,
  onClick,
  color = MAIN_COLOR,
}) => (
  <div
    className={`${className} pb-2 w-100`}
    onClick={onClick}
    style={{ color }}
  >
    <span className="text-5xl font-bold italic">{intComma(value)}</span>
    <span className="text-2xl font-semibold italic">{description}</span>
    {pace && (
      <>
        <span className="text-5xl font-bold italic"> {pace}</span>
        <span className="text-2xl font-semibold italic"> Pace</span>
      </>
    )}
    {distance && (
      <>
        <span className="text-5xl font-bold italic"> {distance}</span>
        <span className="text-2xl font-semibold italic"> KM</span>
      </>
    )}
  </div>
);

export default WorkoutStat;
