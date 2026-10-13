import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { fmtShort, fromISO, toISO } from '../../utils/dates';

const TICK = { fontSize: 9, fill: '#66768c', fontFamily: 'Inter, system-ui, sans-serif' };

// Evenly spaced dates along the time axis (like Sep 01 · Sep 08 · Sep 15 · Sep 22 in the design).
function pickTicks(points, count = 4) {
  const min = points[0].t;
  const max = points[points.length - 1].t;
  if (min === max) return [min];
  return Array.from({ length: count }, (_, i) => Math.round(min + (i * (max - min)) / (count - 1)));
}

function Tip({ active, payload, unit }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="charttip">
      <strong>
        {p.value}
        {unit}
      </strong>
      <span>{fmtShort(p.date)}</span>
    </div>
  );
}

/** Small dated line graph (0 – 60 %). The last point gets the yellow "current" dot. */
export default function TrendChart({ data: rows, label, unit = '%' }) {
  const data = rows.map((r) => ({ ...r, t: fromISO(r.date).getTime() }));
  const last = data.length - 1;
  return (
    <div className="chart" role="img" aria-label={`${label} trend, ${data.length} photos. Latest ${data[last]?.value}${unit}.`}>
      <ResponsiveContainer width="100%" height={110}>
        <LineChart data={data} margin={{ top: 8, right: 10, left: -14, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#dce6f1" />
          <YAxis domain={[0, 60]} ticks={[0, 30, 60]} tick={TICK} axisLine={false} tickLine={false} width={34} />
          <XAxis
            dataKey="t"
            type="number"
            scale="time"
            domain={['dataMin', 'dataMax']}
            ticks={pickTicks(data)}
            tickFormatter={(t) => fmtShort(toISO(new Date(t)))}
            tick={TICK}
            axisLine={false}
            tickLine={false}
            padding={{ left: 6, right: 6 }}
          />
          <Tooltip content={<Tip unit={unit} />} cursor={{ stroke: '#bed4ec' }} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#172b53"
            strokeWidth={2}
            animationDuration={900}
            dot={(p) =>
              p.index === last ? (
                <circle key="last" cx={p.cx} cy={p.cy} r={4} fill="#f8de88" stroke="#172b53" strokeWidth={1.6} />
              ) : (
                <g key={p.index} />
              )
            }
            activeDot={{ r: 4, fill: '#172b53' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
