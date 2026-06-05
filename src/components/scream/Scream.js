import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';
import DeleteScream from './DeleteScream';
import EditScream from './EditScream';
import ScreamDialog from './ScreamDialog';
import LikeButton from './LikeButton';
// Redux
import { connect } from 'react-redux';
import NoImg from '../../images/no-img.png';


const styles = {
  card: {
    display: 'flex',
    padding: '18px 24px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    position: 'relative',
    transition: 'background-color 0.2s ease',
    textDecoration: 'none',
    color: 'inherit',
    '&:hover': {
      backgroundColor: '#FCFAF8',
      cursor: 'pointer'
    }
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    marginRight: 16,
    objectFit: 'cover',
    flexShrink: 0
  },
  contentWrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    minWidth: 0
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
    flexWrap: 'wrap'
  },
  userHandle: {
    fontFamily: '"Outfit", sans-serif',
    fontWeight: 700,
    fontSize: '0.95rem',
    color: '#0F1419',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  userHandleText: {
    fontSize: '0.85rem',
    color: '#7A6B65'
  },
  createdAt: {
    fontSize: '0.85rem',
    color: '#7A6B65'
  },
  body: {
    fontFamily: '"Inter", sans-serif',
    fontSize: '0.95rem',
    lineHeight: 1.5,
    color: '#0F1419',
    marginBottom: 12,
    wordBreak: 'break-word'
  },
  actionButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
    color: '#7A6B65',
    marginTop: 4
  },
  actionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.85rem',
    fontWeight: 500,
    cursor: 'pointer',
    color: '#7A6B65',
    transition: 'color 0.2s ease',
    '&:hover': {
      color: '#1D9BF0'
    }
  },
  deleteButtonWrapper: {
    position: 'absolute',
    top: 10,
    right: 10,
    display: 'flex',
    alignItems: 'center',
    gap: 4
  }
};

class Scream extends Component {
  render() {
    dayjs.extend(relativeTime);
    const {
      classes,
      scream: {
        body,
        createdAt,
        userImage,
        userHandle,
        userName,
        screamId,
        likeCount,
        commentCount
      },
      user: {
        authenticated,
        credentials: { handle }
      }
    } = this.props;

    const ownScreamActions =
      authenticated && userHandle === handle ? (
        <div className={classes.deleteButtonWrapper}>
          <EditScream screamId={screamId} screamBody={body} />
          <DeleteScream screamId={screamId} />
        </div>
      ) : null;

    const userProfilePic =
      userHandle === handle
        ? this.props.user.credentials.imageUrl || NoImg
        : userImage || NoImg;

    const userProfileName =
      userHandle === handle
        ? this.props.user.credentials.name || handle
        : userName || userHandle;

    return (
      <div className={classes.card}>
        <img src={userProfilePic} alt="Profile" className={classes.avatar} />
        <div className={classes.contentWrapper}>
          <div className={classes.header}>
            <Link to={`/users/${userHandle}`} className={classes.userHandle}>
              {userProfileName}
            </Link>
            <span className={classes.userHandleText}>@{userHandle}</span>
            <span className={classes.userHandleText}>·</span>
            <span className={classes.createdAt}>{dayjs(createdAt).fromNow()}</span>
          </div>
          
          {ownScreamActions}

          <div className={classes.body}>
            {body}
          </div>

          <div className={classes.actionButtons}>
            <div className={classes.actionItem}>
              <LikeButton screamId={screamId} />
              <span>{likeCount} Likes</span>
            </div>

            <div className={classes.actionItem}>
              <ScreamDialog
                screamId={screamId}
                userHandle={userHandle}
                openDialog={this.props.openDialog}
              />
              <span>{commentCount} comments</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Scream.propTypes = {
  user: PropTypes.object.isRequired,
  scream: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  openDialog: PropTypes.bool
};

const mapStateToProps = (state) => ({
  user: state.user
});

export default connect(mapStateToProps)(withStyles(styles)(Scream));

