import React from 'react';
import { intComma } from '@/utils/utils';
import { MAIN_COLOR } from '@/utils/const';


interface WorkoutStatProps {
  value: string;
  description: string;
  pace?: string;
  className?: string;
  distance?: string;
  elevationGain?: string;
  avgHeartRate?: string;
  onClick?: () => void;
  color?: string;
}

const WorkoutStat: React.FC<WorkoutStatProps> = ({
  value,
  description,
  pace,
  className = '',
  distance,
  elevationGain,
  avgHeartRate,
  onClick,
  color = MAIN_COLOR,
}) => (
  <div
    className={`${className} pb-2 w-100`}
    onClick={onClick}
    style={{ color: color }}
  >
    <span className="text-5xl font-bold italic">{intComma(value)}</span>
    <span className="text-2xl font-semibold italic">{description}</span>
    {distance && (
        <>
          <span className="text-5xl font-bold italic"> {distance}</span>
          <span className="text-2xl font-semibold italic"> KM</span>
        </>
      )}
    <div
    >
      {pace && (
        <>
          <span className="text-3xl font-bold italic"> {pace}</span>
          <span className="text-2xl font-semibold italic"> Pace</span>
        </>
      )}
      {elevationGain && (
        <>
          <span className="text-2xl font-bold italic"> {elevationGain}</span>
          <span className="text-xs font-semibold italic"> M ElevationGain</span>
        </>
      )}
      {avgHeartRate && (
        <>
          <span className="text-2xl font-bold italic"> {avgHeartRate}</span>
          <span className="text-xs font-semibold italic"> Avg Heart Rate</span>
        </>
      )}
    </div>
  </div>
);

export default WorkoutStat;
