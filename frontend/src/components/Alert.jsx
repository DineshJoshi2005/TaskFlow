import React from 'react';
import { AlertCircle, RefreshCw, X } from 'lucide-react';

export default function Alert({ message, onRetry, onDismiss }) {
  if (!message) return null;

  return (
    <div className="alert-banner" role="alert">
      <div className="alert-content">
        <AlertCircle className="alert-icon" size={20} />
        <span className="alert-message">{message}</span>
      </div>
      <div className="alert-actions">
        {onRetry && (
          <button onClick={onRetry} className="btn-retry" title="Retry action">
            <RefreshCw size={14} /> Retry
          </button>
        )}
        {onDismiss && (
          <button onClick={onDismiss} className="btn-dismiss" title="Dismiss">
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
