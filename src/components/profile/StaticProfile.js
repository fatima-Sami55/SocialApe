import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import dayjs from 'dayjs';
import NoImg from '../../images/no-img.png';

// MUI
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

// Icons
import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';

const styles = (theme) => ({
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    gap: 16
  },
  headerTexts: {
    display: 'flex',
    flexDirection: 'column'
  },
  headerName: {
    fontFamily: '"Outfit", sans-serif',
    fontWeight: 800,
    fontSize: '1.2rem',
    color: '#0F1419'
  },
  headerSub: {
    fontSize: '0.8rem',
    color: '#7A6B65'
  },
  bannerContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#E5D6CD',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative'
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
    objectFit: 'cover',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
  },
  actionButtonsWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6
  },
  followBtn: {
    backgroundColor: '#000000 !important',
    color: '#ffffff !important',
    borderRadius: '9999px !important',
    textTransform: 'none !important',
    fontWeight: '700 !important',
    fontFamily: '"Outfit", sans-serif !important',
    padding: '6px 20px !important',
    fontSize: '0.85rem !important',
    boxShadow: 'none !important',
    '&:hover': {
      backgroundColor: '#222222 !important'
    }
  },
  followingBtn: {
    backgroundColor: 'transparent !important',
    color: '#0F1419 !important',
    border: '1px solid #CFD9DE !important',
    borderRadius: '9999px !important',
    textTransform: 'none !important',
    fontWeight: '700 !important',
    fontFamily: '"Outfit", sans-serif !important',
    padding: '6px 20px !important',
    fontSize: '0.85rem !important',
    boxShadow: 'none !important',
    '&:hover': {
      backgroundColor: 'rgba(15, 20, 25, 0.04) !important'
    }
  },
  detailsContainer: {
    padding: '0 20px',
    marginBottom: 20
  },
  profileName: {
    fontFamily: '"Outfit", sans-serif',
    fontWeight: 800,
    fontSize: '1.35rem',
    color: '#0F1419',
    display: 'flex',
    alignItems: 'center',
    gap: 6
  },
  profileHandle: {
    fontSize: '0.9rem',
    color: '#7A6B65',
    marginBottom: 12
  },
  bio: {
    fontFamily: '"Inter", sans-serif',
    fontSize: '0.95rem',
    lineHeight: 1.5,
    color: '#0F1419',
    marginBottom: 12
  },
  metaInfo: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    color: '#7A6B65',
    fontSize: '0.85rem',
    marginBottom: 16
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 4
  },
  followStats: {
    display: 'flex',
    gap: '20px',
    fontSize: '0.9rem',
    color: '#7A6B65'
  },
  statNumber: {
    color: '#0F1419',
    fontWeight: 700
  },
  tabsContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    backgroundColor: '#ffffff'
  },
  tab: {
    padding: '16px 0',
    fontFamily: '"Outfit", sans-serif',
    fontWeight: 600,
    fontSize: '0.95rem',
    color: '#7A6B65',
    cursor: 'pointer',
    position: 'relative',
    textAlign: 'center',
    flex: 1,
    transition: 'color 0.2s ease',
    '&:hover': {
      color: '#0F1419'
    }
  },
  activeTab: {
    color: '#0F1419',
    fontWeight: 700,
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: '25%',
      right: '25%',
      height: 3,
      backgroundColor: '#1D9BF0',
      borderRadius: '2px 2px 0 0'
    }
  }
});

class StaticProfile extends Component {
  handleFollow = () => {
    if (this.props.onFollowToggle) {
      this.props.onFollowToggle();
    }
  };

  changeTab = (tab) => {
    if (this.props.onTabChange) {
      this.props.onTabChange(tab);
    }
  };

  render() {
    const {
      classes,
      profile: { handle, createdAt, imageUrl, bio, website, location, name, bannerImageUrl, followingCount, followerCount },
      activeTab,
      isFollowing,
      authenticated
    } = this.props;

    return (
      <div style={{ backgroundColor: '#ffffff' }}>
        {/* Profile Header */}
        <div className={classes.profileHeader}>
          <IconButton onClick={() => window.history.back()} style={{ color: '#0F1419', padding: 8 }}>
            <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 20, height: 20, fill: '#0F1419' }}>
              <path d="M7.414 13l5.293 5.293-1.414 1.414L3.586 12 11.293 4.293l1.414 1.414L7.414 11H21v2H7.414z" />
            </svg>
          </IconButton>
          <div className={classes.headerTexts}>
            <span className={classes.headerName}>@{handle}</span>
            <span className={classes.headerSub}>Joined {dayjs(createdAt).format('MMM YYYY')}</span>
          </div>
        </div>

        {/* Profile Banner */}
        <div 
          className={classes.bannerContainer} 
          style={{ 
            backgroundImage: bannerImageUrl ? `url(${bannerImageUrl})` : 'url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&h=300&q=80")' 
          }}
        />

        {/* Avatar & Action Button Row */}
        <div className={classes.avatarContainer}>
          <img src={imageUrl || NoImg} alt="profile" className={classes.profileAvatar} />

          <div className={classes.actionButtonsWrapper}>
            {authenticated && (
              <Button
                className={isFollowing ? classes.followingBtn : classes.followBtn}
                onClick={this.handleFollow}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div className={classes.detailsContainer}>
          <div className={classes.profileName}>
            {name || handle}
          </div>
          <div className={classes.profileHandle}>@{handle}</div>

          {bio && <div className={classes.bio}>{bio}</div>}

          <div className={classes.metaInfo}>
            {location && (
              <div className={classes.metaItem}>
                <LocationOn style={{ fontSize: 16 }} />
                <span>{location}</span>
              </div>
            )}
            {website && (
              <div className={classes.metaItem}>
                <LinkIcon style={{ fontSize: 16 }} />
                <a href={website} target="_blank" rel="noopener noreferrer">
                  {website}
                </a>
              </div>
            )}
            <div className={classes.metaItem}>
              <CalendarToday style={{ fontSize: 16 }} />
              <span>Joined {dayjs(createdAt).format('MMM YYYY')}</span>
            </div>
          </div>

          <div className={classes.followStats}>
            <span>
              <strong className={classes.statNumber}>{followingCount || 0}</strong> Following
            </span>
            <span>
              <strong className={classes.statNumber}>{followerCount || 0}</strong> Followers
            </span>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className={classes.tabsContainer}>
          <div className={`${classes.tab} ${activeTab === 'posts' ? classes.activeTab : ''}`} onClick={() => this.changeTab('posts')}>
            Posts
          </div>
          <div className={`${classes.tab} ${activeTab === 'comments' ? classes.activeTab : ''}`} onClick={() => this.changeTab('comments')}>
            Comments
          </div>
          <div className={`${classes.tab} ${activeTab === 'likes' ? classes.activeTab : ''}`} onClick={() => this.changeTab('likes')}>
            Likes
          </div>
        </div>
      </div>
    );
  }
}

StaticProfile.propTypes = {
  profile: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(StaticProfile);

