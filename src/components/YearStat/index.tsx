import { lazy, Suspense } from 'react';
import Stat from '@/components/Stat';
import useActivities from '@/hooks/useActivities';
import { formatPace, colorFromType } from '@/utils/utils';
import useHover from '@/hooks/useHover';
import { yearStats } from '@assets/index';
import { loadSvgComponent } from '@/utils/svgUtils';
import WorkoutStat from '@/components/WorkoutStat';

const YearStat = ({ year, onClick, onClickTypeInYear }: { year: string, onClick: (_year: string) => void, onClickTypeInYear:(_year:string, _type: string) => void }) => {
  let { activities: runs, years } = useActivities();
  // for hover
  const [hovered, eventHandlers] = useHover();
  // lazy Component
  const YearSVG = lazy(() => loadSvgComponent(yearStats, `./year_${year}.svg`));

  if (years.includes(year)) {
    runs = runs.filter((run) => run.start_date_local.slice(0, 4) === year);
  }

  const cumulativeDataMap = {};

  let sumDistance = 0;
  let sumElevationGain = 0;
  let streak = 0;
  let pace = 0; // eslint-disable-line no-unused-vars
  let paceNullCount = 0; // eslint-disable-line no-unused-vars
  let heartRate = 0;
  let heartRateNullCount = 0;

  runs.forEach((run) => {
    sumDistance += run.distance || 0;
    sumElevationGain += run.elevation_high || 0;
    if (run.average_speed) {
      if(cumulativeDataMap[run.type]){
        var [oriCount, oriSecondsAvail, oriMetersAvail] = cumulativeDataMap[run.type]
        cumulativeDataMap[run.type] = [oriCount + 1, oriSecondsAvail + (run.distance || 0) / run.average_speed, oriMetersAvail + (run.distance || 0)]
      }else{
        cumulativeDataMap[run.type] = [1, (run.distance || 0) / run.average_speed, run.distance]
      }
    }
    if (run.average_heartrate) {
      heartRate += run.average_heartrate;
    } else {
      heartRateNullCount++;
    }
    if (run.streak) {
      streak = Math.max(streak, run.streak);
    }
  });
  const hasHeartRate = !(heartRate === 0);
  const avgHeartRate = (heartRate / (runs.length - heartRateNullCount)).toFixed(0);

  const workoutsArr = Object.entries(cumulativeDataMap);
  workoutsArr.sort((a, b) => {
    return b[1][0] - a[1][0];
  })
  return (
    <div
      className="cursor-pointer"
      onClick={() => onClick(year)}
      {...eventHandlers}
    >
      <section>
        <Stat value={year} description=" Journey" />
        { sumDistance > 0 &&
          <WorkoutStat
            key='total'
            value={runs.length}
            description={" Total"}
            distance={(sumDistance/1000.0).toFixed(0)}
          />
        }
        { workoutsArr.map(([type, count]) => (
          <WorkoutStat
            key={type}
            value={count[0]}
            description={`${type}`+"s"}
            distance={(count[2]/1000.0).toFixed(0)}
            color={colorFromType(type)}
            onClick={(e: Event) => {
              onClickTypeInYear(year, type);
              e.stopPropagation();
            }}
          />
        ))}
        { sumElevationGain > 0 &&
          <Stat value={sumElevationGain.toFixed(0)} description="M Elevation Gain" className="pb-2"/>
        }
        <Stat value={`${streak} day`} description=" Streak" />
        {hasHeartRate && (
          <Stat value={avgHeartRate} description=" Avg Heart Rate" />
        )}
      </section>
      {year !== 'Total' && hovered && (
        <Suspense fallback="loading...">
          <YearSVG className="my-4 h-4/6 w-4/6 border-0 p-0" />
        </Suspense>
      )}
      <hr color="red" />
    </div>
  );
};

export default YearStat;
