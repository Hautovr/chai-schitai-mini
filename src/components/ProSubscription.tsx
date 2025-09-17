import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Crown, Star, Zap, BarChart3, Trophy, Shield } from 'lucide-react';
import { showTelegramAlert } from '../lib/utils';

interface ProSubscriptionProps {
  onSubscribe?: () => void;
}

const ProSubscription: React.FC<ProSubscriptionProps> = ({ onSubscribe }) => {
  const handleSubscribe = () => {
    // Simulate Telegram Stars payment
    showTelegramAlert('Функция оплаты через Telegram Stars будет доступна в полной версии приложения!');
    
    if (onSubscribe) {
      onSubscribe();
    }
  };

  const features = [
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: "Расширенная аналитика",
      description: "Детальная статистика по месяцам и годам"
    },
    {
      icon: <Trophy className="w-5 h-5" />,
      title: "История лидеров",
      description: "Архив всех таблиц лидеров"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Экспорт данных",
      description: "Выгрузка статистики в Excel/PDF"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Приоритетная поддержка",
      description: "Быстрые ответы на вопросы"
    }
  ];

  return (
    <Card className="w-full border-gold-200 bg-gradient-to-br from-gold-50 to-emerald-50 dark:from-gold-950/20 dark:to-emerald-950/20">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <Crown className="w-8 h-8 text-gold-500" />
        </div>
        <CardTitle className="flex items-center justify-center gap-2">
          <span>PRO подписка</span>
          <Badge variant="gold">NEW</Badge>
        </CardTitle>
        <div className="flex items-center justify-center gap-1 text-2xl font-bold text-gold-600">
          <Star className="w-6 h-6 fill-current" />
          <span>99</span>
          <span className="text-sm text-muted-foreground">/месяц</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gold-100 dark:bg-gold-900/20 flex items-center justify-center text-gold-600">
                {feature.icon}
              </div>
              <div>
                <h4 className="font-medium">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="pt-4 border-t">
          <Button 
            onClick={handleSubscribe}
            variant="gold" 
            size="xl" 
            className="w-full"
          >
            <Star className="w-5 h-5 mr-2" />
            Подписаться за 99 Stars
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-2">
            Оплата через Telegram Stars • Отмена в любое время
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProSubscription;
