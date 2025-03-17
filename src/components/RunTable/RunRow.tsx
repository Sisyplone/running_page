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
  const distance = (run.distance / 1000.0).toFixed(2);
  const paceParts = run.average_speed ? formatPace(run.average_speed) : null;
  const heartRate = run.average_heartrate;
  const runTime = formatRunTime(run.moving_time);
  const elevHigh = run.elevation_high;

  let titleClass = styles.runColor;
  switch (run.type) {
    case "Run":
      titleClass = styles.runColor;
      break;
    case "Ride":
      titleClass = styles.rideColor;
      break;
    case "Hike":
      titleClass = styles.hikeColor;
      break;
    case "Trail Run":
      titleClass = styles.trailRunColor;
      break;
    default:
      titleClass = styles.runColor;
      break;
  }

  const handleClick = () => {
    if (runIndex === elementIndex) {
      setRunIndex(-1);
      locateActivity([]);
      return
    };
    setRunIndex(elementIndex);
    locateActivity([run.run_id]);
  };

  return (
    <tr
      className={`${styles.runRow} ${runIndex === elementIndex ? styles.selected : ''} ${titleClass}`}
      key={run.start_date_local}
      onClick={handleClick}
      style={{'color': colorFromType(run.type)}}
    >
      <td>{titleForRun(run)}</td>
      <td>{distance}</td>
      {paceParts && <td>{paceParts}</td>}
      <td>{elevHigh}</td>
      <td>{heartRate && heartRate.toFixed(0)}</td>
      <td>{runTime}</td>
      <td className={styles.runDate}>{run.start_date_local}</td>
    </tr>
  );
};

export default RunRow;
