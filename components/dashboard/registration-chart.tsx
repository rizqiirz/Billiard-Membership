import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type RegistrationDatum = {
  bulan: string;
  jumlah: number;
};

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

const WIDTH = 600;
const HEIGHT = 180;
const PAD_X = 28;
const PAD_Y = 20;
const BOTTOM_LABEL_SPACE = 28;

export default function RegistrationChart({
  data,
}: {
  data: RegistrationDatum[];
}) {
  const max = Math.max(...data.map((d) => d.jumlah), 1);
  const n = data.length;

  const chartW = WIDTH - PAD_X * 2;
  const chartH = HEIGHT - PAD_Y * 2 - BOTTOM_LABEL_SPACE;

  // Koordinat tiap titik data
  const points = data.map((d, i) => {
    const x = n <= 1 ? PAD_X + chartW / 2 : PAD_X + (i / (n - 1)) * chartW;
    const y = PAD_Y + chartH - (d.jumlah / max) * chartH;
    return { x, y, ...d };
  });

  // Path garis lurus antar titik
  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  // Path area di bawah garis (gradient lembut)
  const areaPath =
    n === 0
      ? ""
      : `${linePath} L ${points[n - 1]!.x} ${PAD_Y + chartH} L ${
          points[0]!.x
        } ${PAD_Y + chartH} Z`;

  // Garis bantu horizontal (2 level: max & tengah)
  const gridLines = [0, 0.5, 1].map((ratio) => ({
    y: PAD_Y + chartH - ratio * chartH,
    label: Math.round(max * ratio),
  }));

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Grafik Pendaftar</CardTitle>
        <CardDescription>
          Jumlah member baru per bulan (6 bulan terakhir)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="mx-auto block w-full min-w-[420px] max-w-2xl"
            role="img"
            aria-label="Grafik jumlah member baru per bulan"
          >
            <defs>
              <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--chart-stop)"
                  stopOpacity="0.25"
                />
                <stop
                  offset="100%"
                  stopColor="var(--chart-stop)"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>

            {/* Garis bantu horizontal */}
            {gridLines.map((g, idx) => (
              <g key={idx}>
                <line
                  x1={PAD_X}
                  y1={g.y}
                  x2={WIDTH - PAD_X}
                  y2={g.y}
                  className="stroke-slate-200 dark:stroke-slate-800"
                  strokeWidth="1"
                  strokeDasharray={idx === 0 ? undefined : "4 4"}
                />
                <text
                  x={PAD_X - 8}
                  y={g.y + 4}
                  textAnchor="end"
                  className="fill-slate-400 text-[10px] dark:fill-slate-500"
                >
                  {g.label}
                </text>
              </g>
            ))}

            {/* Area di bawah garis */}
            {areaPath && <path d={areaPath} fill="url(#chartFill)" />}

            {/* Garis utama */}
            {linePath && (
              <path
                d={linePath}
                fill="none"
                className="stroke-primary"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Titik data + label jumlah */}
            {points.map((p) => (
              <g key={p.bulan}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="3.5"
                  className="fill-primary stroke-white dark:stroke-slate-900"
                  strokeWidth="1.5"
                />
                <text
                  x={p.x}
                  y={p.y - 10}
                  textAnchor="middle"
                  className="fill-slate-500 text-[10px] font-medium dark:fill-slate-400"
                >
                  {p.jumlah}
                </text>
              </g>
            ))}

            {/* Label bulan */}
            {points.map((p) => {
              const monthIndex = Number(p.bulan) - 1;
              const label = MONTH_NAMES[monthIndex] ?? p.bulan;
              return (
                <text
                  key={`label-${p.bulan}`}
                  x={p.x}
                  y={HEIGHT - 8}
                  textAnchor="middle"
                  className="fill-slate-400 text-[10px] dark:fill-slate-500"
                >
                  {label}
                </text>
              );
            })}
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
