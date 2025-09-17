import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tip } from '../types';
import { formatCurrency, formatDate } from '../lib/utils';
import { Clock, DollarSign } from 'lucide-react';

interface TipListProps {
  tips: Tip[];
  title?: string;
  showDate?: boolean;
}

const TipList: React.FC<TipListProps> = ({ tips, title = "Сегодняшние чаевые", showDate = false }) => {
  const getAmountBadge = (amount: number) => {
    if (amount >= 200) {
      return <Badge variant="gold">Большой</Badge>;
    } else if (amount >= 100) {
      return <Badge variant="emerald">Средний</Badge>;
    } else {
      return <Badge variant="secondary">Малый</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-emerald-500" />
          {title}
        </CardTitle>
        {tips.length > 0 && (
          <div className="text-sm text-muted-foreground">
            Всего: <span className="font-semibold text-emerald-600">
              {formatCurrency(tips.reduce((sum, tip) => sum + tip.amount, 0))}
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {tips.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Пока нет чаевых</p>
            <p className="text-sm">Добавьте первое чаевое!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tips.map((tip) => (
              <div
                key={tip.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-medium">
                      {formatCurrency(tip.amount)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {tip.time}
                      {showDate && (
                        <>
                          <span>•</span>
                          {formatDate(new Date(tip.date))}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {getAmountBadge(tip.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TipList;
