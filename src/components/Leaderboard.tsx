import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { LeaderboardEntry } from '../types';
import { formatCurrency } from '../lib/utils';
import { Trophy, Medal, Award } from 'lucide-react';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId?: number;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ entries, currentUserId }) => {
  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-5 h-5 text-gold-500" />;
      case 1:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 2:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">
          {index + 1}
        </span>;
    }
  };

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return <Badge variant="gold">🥇 1-е место</Badge>;
      case 1:
        return <Badge variant="secondary">🥈 2-е место</Badge>;
      case 2:
        return <Badge variant="outline">🥉 3-е место</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-gold-500" />
          Таблица лидеров
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {entries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Пока нет данных о чаевых</p>
          </div>
        ) : (
          entries.map((entry, index) => (
            <div
              key={entry.waiterId}
              className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                entry.waiterId === currentUserId
                  ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800'
                  : 'bg-card hover:bg-accent/50'
              }`}
            >
              <div className="flex items-center gap-3">
                {getRankIcon(index)}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {entry.waiterName}
                    </span>
                    {entry.waiterId === currentUserId && (
                      <Badge variant="emerald" className="text-xs">
                        Вы
                      </Badge>
                    )}
                  </div>
                  {entry.waiterUsername && (
                    <p className="text-sm text-muted-foreground">
                      @{entry.waiterUsername}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {entry.tipCount} чаевых
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">
                  {formatCurrency(entry.totalAmount)}
                </div>
                {getRankBadge(index)}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
