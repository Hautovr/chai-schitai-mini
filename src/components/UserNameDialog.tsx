import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { User } from 'lucide-react';

interface UserNameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveName: (name: string) => void;
  currentName?: string;
}

const UserNameDialog: React.FC<UserNameDialogProps> = ({ open, onOpenChange, onSaveName, currentName = '' }) => {
  const [name, setName] = useState(currentName);
  const [error, setError] = useState('');

  // Обновляем name при изменении currentName
  useEffect(() => {
    setName(currentName);
  }, [currentName]);

  const handleSubmit = () => {
    const trimmedName = name.trim();
    
    if (!trimmedName) {
      setError('Введите ваше имя');
      return;
    }
    
    if (trimmedName.length < 2) {
      setError('Имя должно содержать минимум 2 символа');
      return;
    }
    
    if (trimmedName.length > 20) {
      setError('Имя не может быть длиннее 20 символов');
      return;
    }
    
    setError('');
    console.log('Saving name:', trimmedName);
    onSaveName(trimmedName);
    console.log('Calling onOpenChange(false)');
    onOpenChange(false); // Закрываем диалог после сохранения
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Если есть несохраненные изменения, спрашиваем подтверждение
      if (name.trim() && name.trim() !== currentName) {
        const shouldClose = confirm('У вас есть несохраненные изменения. Закрыть без сохранения?');
        if (!shouldClose) {
          return; // Не закрываем диалог
        }
      }
      // Сбрасываем изменения
      setName(currentName);
      setError('');
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-500" />
            Ваше имя
          </DialogTitle>
          <DialogDescription>
            Введите ваше имя для персонализации приложения
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="userName" className="text-sm font-medium mb-2 block">
              Имя:
            </label>
            <Input
              id="userName"
              type="text"
              placeholder="Введите ваше имя"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              onKeyPress={handleKeyPress}
              maxLength={20}
              autoFocus
            />
            {error && (
              <p className="text-sm text-destructive mt-1">{error}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {name.length}/20 символов
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setName(currentName);
              setError('');
            }}
          >
            Отмена
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim() || name.trim().length < 2}
            className="flex-1"
          >
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserNameDialog;
