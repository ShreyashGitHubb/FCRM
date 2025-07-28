import React, { useEffect } from 'react';

const Dialog = ({ open, onOpenChange, children }) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ children, className }) => {
  return (
    <div className={`p-6 ${className || ''}`}>
      {children}
    </div>
  );
};

const DialogHeader = ({ children, className }) => {
  return (
    <div className={`mb-4 ${className || ''}`}>
      {children}
    </div>
  );
};

const DialogTitle = ({ children, className }) => {
  return (
    <h2 className={`text-lg font-semibold ${className || ''}`}>
      {children}
    </h2>
  );
};

const DialogTrigger = ({ children, asChild }) => {
  return children;
};

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger };
