import { Users, UserCheck, UserX, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Stat = {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bg: string;
};

export default function StatCards({
  total,
  aktif,
  expired,
  akanExpired,
}: {
  total: number;
  aktif: number;
  expired: number;
  akanExpired: number;
}) {
  const stats: Stat[] = [
    {
      title: "Total Member",
      value: total,
      icon: <Users className="h-4 w-4" />,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-500/15",
    },
    {
      title: "Member Aktif",
      value: aktif,
      icon: <UserCheck className="h-4 w-4" />,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-500/15",
    },
    {
      title: "Member Expired",
      value: expired,
      icon: <UserX className="h-4 w-4" />,
      color: "text-rose-500 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-500/15",
    },
    {
      title: "Akan Expired",
      value: akanExpired,
      icon: <AlertTriangle className="h-4 w-4" />,
      color: "text-amber-500 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-500/15",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="transition-shadow hover:shadow-lifted"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {stat.title}
            </CardTitle>
            <div className={`rounded-lg p-2 ${stat.bg} ${stat.color}`}>
              {stat.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
