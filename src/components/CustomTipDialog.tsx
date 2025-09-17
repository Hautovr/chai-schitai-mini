import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { DollarSign } from 'lucide-react';

interface CustomTipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTip: (amount: number) => void;
}

const CustomTipDialog: React.FC<CustomTipDialogProps> = ({ open, onOpenChange, onAddTip }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);
    
    if (!amount || isNaN(numAmount)) {
      setError('Введите корректную сумму');
      return;
    }
    
    if (numAmount <= 0) {
      setError('Сумма должна быть больше 0');
      return;
    }
    
    if (numAmount > 10000) {
      setError('Сумма не может быть больше 10,000₽');
      return;
    }
    
    setError('');
    onAddTip(numAmount);
    setAmount('');
    onOpenChange(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const quickAmounts = [50, 100, 200, 500, 1000];

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Если пытаются закрыть диалог, сбрасываем изменения
      setAmount('');
      setError('');
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-500" />
            Добавить чаевые
          </DialogTitle>
          <DialogDescription>
            Введите сумму чаевых или выберите из быстрых вариантов
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Quick amounts */}
          <div>
            <label className="text-sm font-medium mb-2 block">Быстрые суммы:</label>
            <div className="grid grid-cols-5 gap-2">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(quickAmount.toString())}
                  className="text-xs"
                >
                  {quickAmount}₽
                </Button>
              ))}
            </div>
          </div>

          {/* Custom input */}
          <div>
            <label htmlFor="amount" className="text-sm font-medium mb-2 block">
              Своя сумма:
            </label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError('');
                }}
                onKeyPress={handleKeyPress}
                className="pr-8"
                min="1"
                max="10000"
                step="1"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
                ₽
              </span>
            </div>
            {error && (
              <p className="text-sm text-destructive mt-1">{error}</p>
            )}
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setAmount('');
              setError('');
            }}
          >
            Отмена
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!amount || parseFloat(amount) <= 0}
            className="flex-1"
          >
            Добавить {amount ? `${parseFloat(amount)}₽` : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomTipDialog;
