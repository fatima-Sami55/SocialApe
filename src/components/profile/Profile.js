import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import EditDetails from './EditDetails';
import ProfileSkeleton from '../../util/ProfileSkeleton';
// MUI stuff
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import NoImg from '../../images/no-img.png';
// Icons
import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';
import EditIcon from '@material-ui/icons/Edit';
//Redux
import { connect } from 'react-redux';
import { logoutUser, uploadImage, uploadBannerImage } from '../../redux/actions/userActions';

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
    position: 'relative',
    '&:hover .banner-edit-overlay': {
      opacity: 1
    }
  },
  bannerEditOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: '50%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
    transition: 'opacity 0.2s ease',
    cursor: 'pointer',
    color: '#ffffff',
    zIndex: 10
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
  profileAvatarWrapper: {
    position: 'relative',
    width: 100,
    height: 100,
    '&:hover .avatar-edit-overlay': {
      opacity: 1
    }
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: '50%',
    border: '4px solid #ffffff',
    objectFit: 'cover',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
  },
  avatarEditOverlay: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: 92,
    height: 92,
    borderRadius: '50%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
    transition: 'opacity 0.2s ease',
    cursor: 'pointer',
    color: '#ffffff'
  },
  actionButtonsWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6
  },
  editProfileBtn: {
    border: '1px solid #CFD9DE !important',
    borderRadius: '9999px !important',
    textTransform: 'none !important',
    fontWeight: '700 !important',
    fontFamily: '"Outfit", sans-serif !important',
    padding: '6px 16px !important',
    fontSize: '0.85rem !important',
    color: '#0F1419 !important',
    '&:hover': {
      backgroundColor: 'rgba(15, 20, 25, 0.04) !important'
    }
  },
  verifyBtn: {
    border: '1px solid #CFD9DE !important',
    borderRadius: '9999px !important',
    textTransform: 'none !important',
    fontWeight: '700 !important',
    fontFamily: '"Outfit", sans-serif !important',
    padding: '6px 16px !important',
    fontSize: '0.85rem !important',
    color: '#1D9BF0 !important',
    '&:hover': {
      backgroundColor: 'rgba(29, 155, 240, 0.04) !important'
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

class Profile extends Component {
  handleImageChange = (event) => {
    const image = event.target.files[0];
    const formData = new FormData();
    formData.append('image', image, image.name);
    this.props.uploadImage(formData);
  };

  handleEditPicture = () => {
    const fileInput = document.getElementById('imageInput');
    if (fileInput) fileInput.click();
  };

  handleBannerChange = (event) => {
    const image = event.target.files[0];
    const formData = new FormData();
    formData.append('image', image, image.name);
    this.props.uploadBannerImage(formData);
  };

  handleEditBanner = () => {
    const fileInput = document.getElementById('bannerInput');
    if (fileInput) fileInput.click();
  };

  handleLogout = () => {
    this.props.logoutUser();
  };

  changeTab = (tab) => {
    if (this.props.onTabChange) {
      this.props.onTabChange(tab);
    }
  };

  render() {
    const {
      classes,
      activeTab,
      user: {
        credentials: { handle, createdAt, imageUrl, bio, website, location, name, bannerImageUrl, followingCount, followerCount },
        loading,
        authenticated
      }
    } = this.props;

    if (loading) {
      return <ProfileSkeleton />;
    }

    if (!authenticated) {
      return (
        <div style={{ padding: 24, textAlign: 'center' }}>
          <Typography variant="body1">No profile found, please login again</Typography>
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center', gap: 16 }}>
            <Button variant="contained" color="primary" component={Link} to="/login" className="widget-follow-button">
              Login
            </Button>
            <Button variant="outlined" color="primary" component={Link} to="/signup" className="widget-follow-button following">
              Signup
            </Button>
          </div>
        </div>
      );
    }

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
        >
          <input
            type="file"
            id="bannerInput"
            hidden="hidden"
            onChange={this.handleBannerChange}
          />
          <div className={`banner-edit-overlay ${classes.bannerEditOverlay}`} onClick={this.handleEditBanner}>
            <EditIcon style={{ color: '#ffffff' }} />
          </div>
        </div>

        {/* Avatar & Action Buttons Row */}
        <div className={classes.avatarContainer}>
          <div className={classes.profileAvatarWrapper}>
            <img src={imageUrl || NoImg} alt="profile" className={classes.profileAvatar} />
            <input
              type="file"
              id="imageInput"
              hidden="hidden"
              onChange={this.handleImageChange}
            />
            <div className={`avatar-edit-overlay ${classes.avatarEditOverlay}`} onClick={this.handleEditPicture}>
              <EditIcon style={{ color: '#ffffff' }} />
            </div>
          </div>

          <div className={classes.actionButtonsWrapper}>
            <EditDetails />
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

const mapStateToProps = (state) => ({
  user: state.user
});

const mapActionsToProps = { logoutUser, uploadImage, uploadBannerImage };

Profile.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
  uploadBannerImage: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(Profile));
