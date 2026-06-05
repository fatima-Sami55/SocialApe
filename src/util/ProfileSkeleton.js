import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
// Icons (to match the real profile icons)
import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';

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
  container: {
    backgroundColor: '#ffffff'
  },
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    gap: 16
  },
  headerBackBtnPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    flexShrink: 0
  },
  headerTexts: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6
  },
  headerNamePlaceholder: {
    width: 120,
    height: 16,
    borderRadius: 4
  },
  headerSubPlaceholder: {
    width: 80,
    height: 12,
    borderRadius: 4
  },
  bannerContainer: {
    width: '100%',
    height: 180
  },
  avatarContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: '0 20px',
    marginTop: -50,
    marginBottom: 16,
    position: 'relative',
    zIndex: 10
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: '50%',
    border: '4px solid #ffffff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
  },
  followBtnPlaceholder: {
    width: 90,
    height: 32,
    borderRadius: 9999,
    marginBottom: 6
  },
  detailsContainer: {
    padding: '0 20px',
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 10
  },
  profileNamePlaceholder: {
    width: 180,
    height: 24,
    borderRadius: 4
  },
  profileHandlePlaceholder: {
    width: 100,
    height: 16,
    borderRadius: 4,
    marginBottom: 4
  },
  bioPlaceholderLine1: {
    width: '90%',
    height: 14,
    borderRadius: 4
  },
  bioPlaceholderLine2: {
    width: '70%',
    height: 14,
    borderRadius: 4
  },
  metaInfo: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    color: '#7A6B65',
    fontSize: '0.85rem',
    marginTop: 6,
    marginBottom: 6
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 4
  },
  metaTextPlaceholder: {
    width: 80,
    height: 12,
    borderRadius: 4
  },
  followStats: {
    display: 'flex',
    gap: '20px'
  },
  statPlaceholder: {
    width: 70,
    height: 16,
    borderRadius: 4
  },
  tabsContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    backgroundColor: '#ffffff'
  },
  tab: {
    padding: '16px 0',
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabPlaceholder: {
    width: 50,
    height: 16,
    borderRadius: 4
  }
});

const ProfileSkeleton = (props) => {
  const { classes } = props;
  const pulseClass = classes.pulse;

  return (
    <div className={classes.container}>
      {/* Profile Header */}
      <div className={classes.profileHeader}>
        <div className={`${classes.headerBackBtnPlaceholder} ${pulseClass}`} />
        <div className={classes.headerTexts}>
          <div className={`${classes.headerNamePlaceholder} ${pulseClass}`} />
          <div className={`${classes.headerSubPlaceholder} ${pulseClass}`} />
        </div>
      </div>

      {/* Profile Banner */}
      <div className={`${classes.bannerContainer} ${pulseClass}`} />

      {/* Avatar & Follow Button Row */}
      <div className={classes.avatarContainer}>
        <div className={`${classes.profileAvatar} ${pulseClass}`} />
        <div className={`${classes.followBtnPlaceholder} ${pulseClass}`} />
      </div>

      {/* Profile Details */}
      <div className={classes.detailsContainer}>
        <div className={`${classes.profileNamePlaceholder} ${pulseClass}`} />
        <div className={`${classes.profileHandlePlaceholder} ${pulseClass}`} />
        
        {/* Bio */}
        <div className={`${classes.bioPlaceholderLine1} ${pulseClass}`} />
        <div className={`${classes.bioPlaceholderLine2} ${pulseClass}`} />

        {/* Meta Info */}
        <div className={classes.metaInfo}>
          <div className={classes.metaItem}>
            <LocationOn style={{ fontSize: 16, color: '#CFBDB2' }} />
            <div className={`${classes.metaTextPlaceholder} ${pulseClass}`} />
          </div>
          <div className={classes.metaItem}>
            <LinkIcon style={{ fontSize: 16, color: '#CFBDB2' }} />
            <div className={`${classes.metaTextPlaceholder} ${pulseClass}`} />
          </div>
          <div className={classes.metaItem}>
            <CalendarToday style={{ fontSize: 16, color: '#CFBDB2' }} />
            <div className={`${classes.metaTextPlaceholder} ${pulseClass}`} />
          </div>
        </div>

        {/* Follow Stats */}
        <div className={classes.followStats}>
          <div className={`${classes.statPlaceholder} ${pulseClass}`} />
          <div className={`${classes.statPlaceholder} ${pulseClass}`} />
        </div>
      </div>

      {/* Profile Tabs */}
      <div className={classes.tabsContainer}>
        <div className={classes.tab}>
          <div className={`${classes.tabPlaceholder} ${pulseClass}`} />
        </div>
        <div className={classes.tab}>
          <div className={`${classes.tabPlaceholder} ${pulseClass}`} />
        </div>
        <div className={classes.tab}>
          <div className={`${classes.tabPlaceholder} ${pulseClass}`} />
        </div>
      </div>
    </div>
  );
};

ProfileSkeleton.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProfileSkeleton);
