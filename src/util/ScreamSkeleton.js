import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = (theme) => ({
  '@keyframes pulse': {
    '0%': {
      backgroundColor: '#E5D6CD',
      opacity: 0.6
    },
    '50%': {
      backgroundColor: '#CFBDB2',
      opacity: 1
    },
    '100%': {
      backgroundColor: '#E5D6CD',
      opacity: 0.6
    }
  },
  pulse: {
    animation: '$pulse 1.5s infinite ease-in-out'
  },
  card: {
    display: 'flex',
    padding: '18px 24px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    marginRight: 16,
    flexShrink: 0
  },
  contentWrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    minWidth: 0,
    gap: 8
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4
  },
  namePlaceholder: {
    width: 100,
    height: 16,
    borderRadius: 4
  },
  handlePlaceholder: {
    width: 70,
    height: 14,
    borderRadius: 4
  },
  datePlaceholder: {
    width: 50,
    height: 14,
    borderRadius: 4
  },
  bodyLineFull: {
    height: 14,
    width: '90%',
    borderRadius: 4
  },
  bodyLineHalf: {
    height: 14,
    width: '50%',
    borderRadius: 4
  },
  actionButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
    marginTop: 4
  },
  actionPlaceholder: {
    width: 60,
    height: 16,
    borderRadius: 4
  }
});

const ScreamSkeleton = (props) => {
  const { classes } = props;
  const pulseClass = classes.pulse;

  const content = Array.from({ length: 4 }).map((_, index) => (
    <div className={classes.card} key={index}>
      <div className={`${classes.avatar} ${pulseClass}`} />
      <div className={classes.contentWrapper}>
        <div className={classes.header}>
          <div className={`${classes.namePlaceholder} ${pulseClass}`} />
          <div className={`${classes.handlePlaceholder} ${pulseClass}`} />
          <span style={{ color: '#CFBDB2', fontSize: '0.85rem' }}>·</span>
          <div className={`${classes.datePlaceholder} ${pulseClass}`} />
        </div>
        
        {/* Body lines */}
        <div className={`${classes.bodyLineFull} ${pulseClass}`} />
        <div className={`${classes.bodyLineFull} ${pulseClass}`} />
        <div className={`${classes.bodyLineHalf} ${pulseClass}`} />

        {/* Action placeholders */}
        <div className={classes.actionButtons}>
          <div className={`${classes.actionPlaceholder} ${pulseClass}`} />
          <div className={`${classes.actionPlaceholder} ${pulseClass}`} />
        </div>
      </div>
    </div>
  ));

  return <Fragment>{content}</Fragment>;
};

ScreamSkeleton.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ScreamSkeleton);
