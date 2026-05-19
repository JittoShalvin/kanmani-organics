import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, HelpCircle, CheckCircle2, Info, X } from 'lucide-react';

interface DialogOptions {
  title?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'confirm' | 'alert' | 'success' | 'error' | 'info';
}

interface ConfirmContextType {
  confirm: (message: string, options?: DialogOptions) => Promise<boolean>;
  alert: (message: string, options?: DialogOptions) => Promise<void>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
};

export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [options, setOptions] = useState<DialogOptions>({});
  const [resolveFn, setResolveFn] = useState<((value: boolean) => void) | null>(null);

  const showDialog = useCallback((msg: string, opts: DialogOptions = {}) => {
    setMessage(msg);
    setOptions(opts);
    setIsOpen(true);
    return new Promise<boolean>((resolve) => {
      setResolveFn(() => resolve);
    });
  }, []);

  const confirm = useCallback((msg: string, opts: DialogOptions = {}) => {
    return showDialog(msg, { type: 'confirm', title: 'Confirm Action', confirmText: 'Yes, Proceed', cancelText: 'Cancel', ...opts });
  }, [showDialog]);

  const alert = useCallback(async (msg: string, opts: DialogOptions = {}) => {
    await showDialog(msg, { type: 'info', title: 'Notification', confirmText: 'OK', ...opts });
  }, [showDialog]);

  const handleConfirm = () => {
    setIsOpen(false);
    if (resolveFn) resolveFn(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
    if (resolveFn) resolveFn(false);
  };

  // Get Icon based on dialog type
  const getIcon = () => {
    const type = options.type || 'confirm';
    switch (type) {
      case 'confirm':
        return <HelpCircle className="w-8 h-8 text-primary" />;
      case 'success':
        return <CheckCircle2 className="w-8 h-8 text-primary" />;
      case 'error':
        return <AlertTriangle className="w-8 h-8 text-destructive" />;
      case 'info':
      default:
        return <Info className="w-8 h-8 text-blue-500" />;
    }
  };

  // Get Brand Gradient class based on dialog type
  const getIconBg = () => {
    const type = options.type || 'confirm';
    switch (type) {
      case 'confirm':
      case 'success':
        return 'bg-primary/10 border border-primary/20';
      case 'error':
        return 'bg-destructive/10 border border-destructive/20';
      case 'info':
      default:
        return 'bg-blue-500/10 border border-blue-500/20';
    }
  };

  return (
    <ConfirmContext.Provider value={{ confirm, alert }}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-6">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancel}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md bg-white/95 backdrop-blur-md rounded-[2.5rem] p-10 border border-white/40 shadow-depth z-10 text-center flex flex-col items-center gap-6"
            >
              {/* Close icon */}
              {options.type === 'confirm' && (
                <button
                  onClick={handleCancel}
                  className="absolute top-6 right-6 p-2 rounded-full text-muted-foreground hover:bg-muted/50 transition-colors"
                >
                  <X size={18} />
                </button>
              )}

              {/* Icon Container */}
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${getIconBg()}`}>
                {getIcon()}
              </div>

              {/* Title and Message */}
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-foreground tracking-tight">
                  {options.title}
                </h3>
                <p className="text-muted-foreground font-medium text-base leading-relaxed px-2">
                  {message}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 w-full mt-2">
                {options.type === 'confirm' && (
                  <button
                    onClick={handleCancel}
                    className="flex-1 py-4 px-6 rounded-2xl font-black text-muted-foreground hover:bg-muted/50 transition-colors border border-border/80"
                  >
                    {options.cancelText || 'Cancel'}
                  </button>
                )}
                <button
                  onClick={handleConfirm}
                  className={`flex-1 py-4 px-6 rounded-2xl font-black text-white shadow-lg active:scale-95 transition-all ${
                    options.type === 'error'
                      ? 'bg-destructive hover:bg-destructive/95'
                      : 'bg-primary hover:bg-primary/95'
                  }`}
                >
                  {options.confirmText || 'OK'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ConfirmContext.Provider>
  );
};
