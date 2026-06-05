import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AppIcon from '../../images/icon.png';

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#E0D5CE',
          padding: 24,
          boxSizing: 'border-box'
        }}>
          <div style={{
            maxWidth: 500,
            width: '100%',
            backgroundColor: '#ffffff',
            borderRadius: 32,
            padding: 40,
            textAlign: 'center',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.06)'
          }}>
            <img src={AppIcon} alt="Logo" style={{ width: 80, height: 80, marginBottom: 20 }} />
            <Typography variant="h3" style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: '#0F1419', marginBottom: 16 }}>
              500 - System Error
            </Typography>
            <Typography variant="body1" style={{ color: '#7A6B65', marginBottom: 24 }}>
              Something went wrong on our end. Please try reloading the page or go back to home.
            </Typography>
            <Button variant="contained" color="primary" onClick={this.handleReset} style={{
              backgroundColor: '#000000',
              color: '#ffffff',
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: 9999,
              padding: '12px 24px'
            }}>
              Go back home
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
