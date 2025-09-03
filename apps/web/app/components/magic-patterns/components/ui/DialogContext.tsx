import React, { createContext, useContext, useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@kit/ui/dialog';
import { Button } from '@kit/ui/button';
import { Input } from '@kit/ui/input';

interface DialogOptions {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'alert' | 'confirm' | 'prompt';
  defaultValue?: string;
}

interface DialogContextType {
  alert: (message: string, options?: DialogOptions) => Promise<void>;
  confirm: (message: string, options?: DialogOptions) => Promise<boolean>;
  prompt: (message: string, options?: DialogOptions) => Promise<string | null>;
}

const DialogContext = createContext<DialogContextType | null>(null);

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within DialogProvider');
  }
  return context;
}

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState<DialogOptions & { message: string }>({ message: '' });
  const [resolver, setResolver] = useState<{ resolve: (value: any) => void } | null>(null);
  const [promptValue, setPromptValue] = useState('');

  const alert = useCallback((message: string, options?: DialogOptions) => {
    return new Promise<void>((resolve) => {
      setDialogConfig({ message, ...options, type: 'alert' });
      setResolver({ resolve });
      setIsOpen(true);
    });
  }, []);

  const confirm = useCallback((message: string, options?: DialogOptions) => {
    return new Promise<boolean>((resolve) => {
      setDialogConfig({ message, ...options, type: 'confirm' });
      setResolver({ resolve });
      setIsOpen(true);
    });
  }, []);

  const prompt = useCallback((message: string, options?: DialogOptions) => {
    return new Promise<string | null>((resolve) => {
      setDialogConfig({ message, ...options, type: 'prompt' });
      setPromptValue(options?.defaultValue || '');
      setResolver({ resolve });
      setIsOpen(true);
    });
  }, []);

  const handleClose = useCallback((result?: any) => {
    setIsOpen(false);
    if (resolver) {
      resolver.resolve(result);
      setResolver(null);
    }
    setPromptValue('');
  }, [resolver]);

  return (
    <DialogContext.Provider value={{ alert, confirm, prompt }}>
      {children}
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogConfig.title || 'Notification'}</DialogTitle>
            <DialogDescription>{dialogConfig.message}</DialogDescription>
          </DialogHeader>
          
          {dialogConfig.type === 'prompt' && (
            <Input
              value={promptValue}
              onChange={(e) => setPromptValue(e.target.value)}
              placeholder="Enter your response..."
              className="mt-4"
            />
          )}
          
          <DialogFooter className="mt-4">
            {dialogConfig.type === 'confirm' && (
              <Button variant="outline" onClick={() => handleClose(false)}>
                {dialogConfig.cancelText || 'Cancel'}
              </Button>
            )}
            {dialogConfig.type === 'prompt' && (
              <Button variant="outline" onClick={() => handleClose(null)}>
                {dialogConfig.cancelText || 'Cancel'}
              </Button>
            )}
            <Button onClick={() => {
              if (dialogConfig.type === 'alert') handleClose();
              else if (dialogConfig.type === 'confirm') handleClose(true);
              else if (dialogConfig.type === 'prompt') handleClose(promptValue);
            }}>
              {dialogConfig.confirmText || 'OK'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DialogContext.Provider>
  );
}