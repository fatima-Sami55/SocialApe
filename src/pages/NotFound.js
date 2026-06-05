import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AppIcon from '../images/icon.png';

const NotFound = () => {
  return (
    <div style={{ padding: 40, textAlign: 'center', backgroundColor: '#ffffff', borderRadius: 32, margin: '40px auto', maxWidth: 500 }}>
      <img src={AppIcon} alt="Logo" style={{ width: 80, height: 80, marginBottom: 20 }} />
      <Typography variant="h3" style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: '#0F1419', marginBottom: 16 }}>
        404 - Page Not Found
      </Typography>
      <Typography variant="body1" style={{ color: '#7A6B65', marginBottom: 24 }}>
        The page you are looking for doesn't exist or has been moved.
      </Typography>
      <Button variant="contained" color="primary" component={Link} to="/" className="sidebar-post-button" style={{ width: 'auto', display: 'inline-flex' }}>
        Go back home
      </Button>
    </div>
  );
};

export default NotFound;
