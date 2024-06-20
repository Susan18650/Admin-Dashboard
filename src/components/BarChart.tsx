import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";

const BarChart = ({ weeklyOrderStats }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const stats = weeklyOrderStats || [0, 0, 0, 0, 0, 0, 0];

  const data = [
    { day: 'Sunday', orders: isNaN(stats[0]) ? 0 : stats[0] },
    { day: 'Monday', orders: isNaN(stats[1]) ? 0 : stats[1] },
    { day: 'Tuesday', orders: isNaN(stats[2]) ? 0 : stats[2] },
    { day: 'Wednesday', orders: isNaN(stats[3]) ? 0 : stats[3] },
    { day: 'Thursday', orders: isNaN(stats[4]) ? 0 : stats[4] },
    { day: 'Friday', orders: isNaN(stats[5]) ? 0 : stats[5] },
    { day: 'Saturday', orders: isNaN(stats[6]) ? 0 : stats[6] },
  ];

  return (
    <ResponsiveBar
      data={data}
      tooltip={({ id, value, color }) => (
        <div style={{ backgroundColor: 'white', height: "25px", color: 'black', padding: '10px',display: 'flex', alignItems: 'center'}}>
          <div style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: color, marginRight: '10px' }}></div>
          <p>
            {id}: <strong>{value}</strong>
          </p>
        </div>
      )}
      theme={{
        // added
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
      }}
      keys={['orders']}
      indexBy="day"
      margin={{ top: 50, right: 100, bottom: 25, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "nivo" }}
      borderColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      enableLabel={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      role="application"
    />
  );
};

export default BarChart;
