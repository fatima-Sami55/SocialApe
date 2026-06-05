import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';
// MUI stuff
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
// Icons
import NotificationsIcon from '@material-ui/icons/Notifications';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ChatIcon from '@material-ui/icons/Chat';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
// Redux
import { connect } from 'react-redux';
import { markNotificationsRead } from '../../redux/actions/userActions';

class Notifications extends Component {
  state = {
    anchorEl: null
  };
  handleOpen = (event) => {
    this.setState({ anchorEl: event.target });
  };
  handleClose = () => {
    this.setState({ anchorEl: null });
  };
  onMenuOpened = () => {
    let unreadNotificationsIds = this.props.notifications
      .filter((not) => !not.read)
      .map((not) => not.notificationId);
    this.props.markNotificationsRead(unreadNotificationsIds);
  };
  render() {
    const notifications = this.props.notifications;
    const anchorEl = this.state.anchorEl;

    dayjs.extend(relativeTime);

    let notificationsIcon;
    if (notifications && notifications.length > 0) {
      notifications.filter((not) => not.read === false).length > 0
        ? (notificationsIcon = (
            <Badge
              badgeContent={
                notifications.filter((not) => not.read === false).length
              }
              color="secondary"
            >
              <NotificationsIcon />
            </Badge>
          ))
        : (notificationsIcon = <NotificationsIcon />);
    } else {
      notificationsIcon = <NotificationsIcon />;
    }
    let notificationsMarkup =
      notifications && notifications.length > 0 ? (
        notifications.map((not) => {
          const verb =
            not.type === 'like'
              ? 'liked your scream'
              : not.type === 'follow'
              ? 'followed you'
              : 'commented on your scream';
          const time = dayjs(not.createdAt).fromNow();
          const iconColor = not.read ? 'primary' : 'secondary';
          
          let icon;
          if (not.type === 'like') {
            icon = <FavoriteIcon color={iconColor} style={{ marginRight: 10 }} />;
          } else if (not.type === 'follow') {
            icon = <PersonAddIcon color={iconColor} style={{ marginRight: 10 }} />;
          } else {
            icon = <ChatIcon color={iconColor} style={{ marginRight: 10 }} />;
          }

          const linkTo =
            not.type === 'follow'
              ? `/users/${not.sender}`
              : `/users/${not.recipient}/scream/${not.screamId}`;

          return (
            <MenuItem key={not.createdAt} onClick={this.handleClose}>
              {icon}
              <Typography
                component={Link}
                color="default"
                variant="body1"
                to={linkTo}
              >
                {not.sender} {verb} {time}
              </Typography>
            </MenuItem>
          );
        })
      ) : (
        <MenuItem onClick={this.handleClose}>
          You have no notifications yet
        </MenuItem>
      );
    return (
      <Fragment>
        {this.props.isMobile ? (
          <IconButton
            aria-owns={anchorEl ? 'simple-menu' : undefined}
            aria-haspopup="true"
            onClick={this.handleOpen}
            style={{ color: '#0F1419' }}
          >
            {notificationsIcon}
          </IconButton>
        ) : (
          <div className="menu-item" onClick={this.handleOpen}>
            {notificationsIcon}
            <span>Notification</span>
          </div>
        )}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
          onEntered={this.onMenuOpened}
        >
          {notificationsMarkup}
        </Menu>
      </Fragment>
    );
  }
}

Notifications.propTypes = {
  markNotificationsRead: PropTypes.func.isRequired,
  notifications: PropTypes.array.isRequired
};

const mapStateToProps = (state) => ({
  notifications: state.user.notifications
});

export default connect(
  mapStateToProps,
  { markNotificationsRead }
)(Notifications);
