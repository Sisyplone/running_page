import React, { lazy, Suspense } from 'react';
import Stat from '@/components/Stat';
import useActivities from '@/hooks/useActivities';
import { colorFromType } from '@/utils/utils';
import useHover from '@/hooks/useHover';
import { yearStats } from '@assets/index';
import { loadSvgComponent } from '@/utils/svgUtils';
import WorkoutStat from '@/components/WorkoutStat';
import { ACTIVITY_ORDER } from '@/utils/const';

// 类型定义
interface YearStatProps {
  year: string;
  onClick: (_year: string) => void;
  onClickTypeInYear: (_year: string, _type: string) => void;
}

const YearStat: React.FC<YearStatProps> = ({ year, onClick, onClickTypeInYear }) => {
  const { activities: runs, years } = useActivities();
  const [hovered, eventHandlers] = useHover();
  const YearSVG = lazy(() => loadSvgComponent(yearStats, `./year_${year}.svg`));

  // 过滤符合年份的活动
  const filteredRuns = years.includes(year)
    ? runs.filter((run) => run.start_date_local.startsWith(year))
    : runs;

  // 计算统计数据
  const {
    sumDistance,
    sumElevationGain,
    streak,
    cumulativeDataMap,
    heartRateTotal,
    heartRateCount,
  } = filteredRuns.reduce(
    (acc, run) => {
      const { distance = 0, elevation_high = 0, average_speed, type, average_heartrate, streak } = run;

      acc.sumDistance += distance;
      acc.sumElevationGain += elevation_high;
      if (streak) acc.streak = Math.max(acc.streak, streak);

      if (average_speed) {
        const [count, totalSeconds, totalMeters, totalElevationGain, totalHeartRate, heartRateCount] = acc.cumulativeDataMap[type] || [0, 0, 0, 0, 0, 0];
        acc.cumulativeDataMap[type] = [
          count + 1,
          totalSeconds + distance / average_speed,
          totalMeters + distance,
          totalElevationGain + elevation_high,
          totalHeartRate + (average_heartrate || 0),
          heartRateCount + (average_heartrate ? 1 : 0)
        ];
      }

      if (average_heartrate) {
        acc.heartRateTotal += average_heartrate;
        acc.heartRateCount++;
      }

      return acc;
    },
    {
      sumDistance: 0,
      sumElevationGain: 0,
      streak: 0,
      cumulativeDataMap: {} as Record<string, [number, number, number, number, number, number]>,
      heartRateTotal: 0,
      heartRateCount: 0,
    }
  );

  const hasHeartRate = heartRateTotal > 0;
  const avgHeartRate = hasHeartRate
    ? (heartRateTotal / heartRateCount).toFixed(0)
    : 0;

  // 生成运动类型统计数据
  const workoutsArr = Object.entries(cumulativeDataMap).sort(([typeA], [typeB]) => {
    const indexA = ACTIVITY_ORDER.indexOf(typeA);
    const indexB = ACTIVITY_ORDER.indexOf(typeB);

    // 如果类型在 desiredOrder 中未找到，则将其放在最后
    const orderA = indexA === -1 ? ACTIVITY_ORDER.length : indexA;
    const orderB = indexB === -1 ? ACTIVITY_ORDER.length : indexB;

    return orderA - orderB;
  });

  // 渲染心率统计
  const renderHeartRate = () =>
    hasHeartRate && <Stat value={avgHeartRate} description=" Avg Heart Rate" />;

  // 渲染不同类型的运动数据
  const renderWorkouts = () =>
    workoutsArr.map(([type, [count, , totalMeters, totalElevationGain, totalHeartRate, heartRateCount]]) => (
      <WorkoutStat
        key={type}
        value={count.toString()}
        description={`${type}s`}
        distance={(totalMeters / 1000).toFixed(0)}
        elevationGain={totalElevationGain.toFixed(0)}
        avgHeartRate={(totalHeartRate/heartRateCount).toFixed(0)}
        color={colorFromType(type)}
        onClick={(e:Event) => {
          onClickTypeInYear(year, type);
          e.stopPropagation();
        }}
      />
    ));

  return (
    <div className="cursor-pointer" onClick={() => onClick(year)} {...eventHandlers}>
      <section>
        <Stat value={year} description=" Journey" />
        {sumDistance > 0 && (
          <WorkoutStat
            key="total"
            value={filteredRuns.length.toString()}
            description=" Total"
            distance={(sumDistance / 1000).toFixed(0)}
          />
        )}
        {renderWorkouts()}
        {/*{sumElevationGain > 0 && (*/}
        {/*  <Stat value={sumElevationGain.toFixed(0)} description="M Elevation Gain" className="pb-2" />*/}
        {/*)}*/}
        {/*<Stat value={`${streak} day`} description=" Streak" />*/}
        {/*{renderHeartRate()}*/}
      </section>
      {year !== "Total" && hovered && (
        <Suspense fallback="loading...">
          <YearSVG className="my-4 h-4/6 w-4/6 border-0 p-0" />
        </Suspense>
      )}
      <hr color="red" />
    </div>
  );
};

export default YearStat;
