import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { DailyStats } from '../types';
import { formatCurrency } from '../lib/utils';
import { TrendingUp, BarChart3 } from 'lucide-react';

interface ChartProps {
  data: DailyStats[];
  type?: 'line' | 'bar';
  title?: string;
}

const Chart: React.FC<ChartProps> = ({ data, type = 'line', title = 'Статистика чаевых' }) => {
  const formatXAxisLabel = (tickItem: string) => {
    const date = new Date(tickItem);
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const formatTooltipLabel = (label: string) => {
    const date = new Date(label);
    return date.toLocaleDateString('ru-RU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{formatTooltipLabel(label)}</p>
          <p className="text-emerald-600 font-semibold">
            Сумма: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-muted-foreground text-sm">
            Чаевых: {payload[0].payload.tipCount}
          </p>
        </div>
      );
    }
    return null;
  };

  const totalAmount = data.reduce((sum, item) => sum + item.totalAmount, 0);
  const totalTips = data.reduce((sum, item) => sum + item.tipCount, 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {type === 'line' ? (
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          ) : (
            <BarChart3 className="w-5 h-5 text-emerald-500" />
          )}
          {title}
        </CardTitle>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>Всего: <span className="font-semibold text-emerald-600">{formatCurrency(totalAmount)}</span></span>
          <span>Чаевых: <span className="font-semibold">{totalTips}</span></span>
        </div>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Нет данных для отображения</p>
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {type === 'line' ? (
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatXAxisLabel}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    tickFormatter={(value) => `${value}₽`}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="totalAmount" 
                    stroke="hsl(var(--emerald-500))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--emerald-500))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: 'hsl(var(--emerald-500))', strokeWidth: 2 }}
                  />
                </LineChart>
              ) : (
                <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatXAxisLabel}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    tickFormatter={(value) => `${value}₽`}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="totalAmount" 
                    fill="hsl(var(--emerald-500))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Chart;
