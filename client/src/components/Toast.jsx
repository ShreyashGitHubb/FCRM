import React from 'react';

const Toast = ({ toasts }) => {
  return (
    <div className="toast-container" style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1000,
    }}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast ${toast.variant === 'destructive' ? 'toast-error' : 'toast-success'}`}
          style={{
            background: toast.variant === 'destructive' ? '#ef4444' : '#10b981',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '6px',
            marginBottom: '8px',
            minWidth: '300px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
            {toast.title}
          </div>
          <div style={{ fontSize: '14px' }}>
            {toast.description}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Toast;
