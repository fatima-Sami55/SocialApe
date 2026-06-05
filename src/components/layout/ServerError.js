import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AppIcon from '../../images/icon.png';
import { connect } from 'react-redux';
import { CLEAR_SERVER_ERROR } from '../../redux/types';

const ServerError = ({ clearServerError }) => {
  const handleReset = () => {
    clearServerError();
    window.location.href = '/';
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#E0D5CE',
      width: '100vw',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 9999,
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
        <Button variant="contained" color="primary" onClick={handleReset} style={{
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
};

const mapDispatchToProps = (dispatch) => ({
  clearServerError: () => dispatch({ type: CLEAR_SERVER_ERROR })
});

export default connect(null, mapDispatchToProps)(ServerError);
