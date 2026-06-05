const theme = {
  palette: {
    primary: {
      light: '#7A6B65',
      main: '#0F1419',
      dark: '#000000',
      contrastText: '#ffffff'
    },
    secondary: {
      light: '#6272E5',
      main: '#1D9BF0',
      dark: '#0D8BD0',
      contrastText: '#ffffff'
    },
    background: {
      default: '#E0D5CE',
      paper: '#ffffff'
    }
  },
  typography: {
    useNextVariants: true,
    fontFamily: '"Inter", "Outfit", sans-serif',
    h5: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 700,
      color: '#0F1419'
    },
    h2: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 800,
      color: '#0F1419'
    },
    body1: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.95rem',
      lineHeight: 1.5,
      color: '#0F1419'
    },
    body2: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.85rem',
      color: '#7A6B65'
    }
  },
  form: {
    textAlign: 'center'
  },
  image: {
    margin: '20px auto 20px auto',
    width: 60,
    height: 60
  },
  pageTitle: {
    margin: '10px auto 10px auto',
    fontFamily: '"Outfit", sans-serif',
    fontWeight: 800,
    fontSize: '2rem'
  },
  textField: {
    margin: '12px auto',
    '& label.Mui-focused': {
      color: '#0F1419'
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: 12,
      '&.Mui-focused fieldset': {
        borderColor: '#0F1419'
      }
    }
  },
  button: {
    marginTop: 20,
    position: 'relative',
    borderRadius: 9999,
    padding: '10px 24px',
    fontFamily: '"Outfit", sans-serif',
    fontWeight: 700,
    textTransform: 'none',
    boxShadow: 'none',
    '&:hover': {
      boxShadow: 'none'
    }
  },
  customError: {
    color: '#ff3d00',
    fontSize: '0.8rem',
    marginTop: 10
  },
  progress: {
    position: 'absolute'
  },
  invisibleSeparator: {
    border: 'none',
    margin: 4
  },
  visibleSeparator: {
    width: '100%',
    borderBottom: '1px solid rgba(0,0,0,0.08)',
    marginBottom: 20
  },
  paper: {
    padding: 24,
    borderRadius: 24,
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.03)',
    border: '1px solid rgba(0, 0, 0, 0.04)',
    backgroundColor: '#ffffff'
  },
  profile: {
    '& .image-wrapper': {
      textAlign: 'center',
      position: 'relative',
      '& button': {
        position: 'absolute',
        top: '80%',
        left: '70%'
      }
    },
    '& .profile-image': {
      width: 120,
      height: 120,
      objectFit: 'cover',
      maxWidth: '100%',
      borderRadius: '50%',
      border: '4px solid #ffffff',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    },
    '& .profile-details': {
      textAlign: 'center',
      '& span, svg': {
        verticalAlign: 'middle'
      },
      '& a': {
        color: '#1D9BF0',
        fontWeight: 600
      }
    },
    '& hr': {
      border: 'none',
      margin: '0 0 10px 0'
    },
    '& svg.button': {
      '&:hover': {
        cursor: 'pointer'
      }
    }
  },
  buttons: {
    textAlign: 'center',
    '& a': {
      margin: '20px 10px'
    }
  }
};

export default theme;

