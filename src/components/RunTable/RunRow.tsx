import { formatPace, titleForRun, formatRunTime, Activity, RunIds, colorFromType } from '@/utils/utils';
import styles from './style.module.css';

interface IRunRowProperties {
  elementIndex: number;
  locateActivity: (_runIds: RunIds) => void;
  run: Activity;
  runIndex: number;
  setRunIndex: (_ndex: number) => void;
}

const RunRow = ({ elementIndex, locateActivity, run, runIndex, setRunIndex }: IRunRowProperties) => {
  const distance = (run.distance / 1000).toFixed(2);
  const paceParts = run.average_speed ? formatPace(run.average_speed) : null;
  const heartRate = run.average_heartrate ? run.average_heartrate.toFixed(0) : null;
  const runTime = formatRunTime(run.moving_time);
  const elevationGain = run.elevation_gain;
  const isSelected = runIndex === elementIndex;
  const titleClass = styles.runRow;
  const rowStyle = { color: colorFromType(run.type) };

  const handleClick = () => {
    if (isSelected) {
      setRunIndex(-1);
      locateActivity([]);
    } else {
      setRunIndex(elementIndex);
      locateActivity([run.run_id]);
    }
  };

  return (
    <tr
      className={`${titleClass} ${isSelected ? styles.selected : ''}`}
      key={run.start_date_local}
      onClick={handleClick}
      style={rowStyle}
    >
      <td>{titleForRun(run)}</td>
      <td>{distance}</td>
      {paceParts && <td>{paceParts}</td>}
      <td>{elevationGain}</td>
      {heartRate && <td>{heartRate}</td>}
      <td>{runTime}</td>
      <td className={styles.runDate}>{run.start_date_local}</td>
    </tr>
  );
};

export default RunRow;
