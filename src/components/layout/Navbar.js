import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import PostScream from '../scream/PostScream';
import Notifications from './Notifications';

// MUI components
import IconButton from '@material-ui/core/IconButton';

// Icons
import HomeIcon from '@material-ui/icons/Home';
import OfflineBoltIcon from '@material-ui/icons/OfflineBolt';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';

// Actions
import { logoutUser } from '../../redux/actions/userActions';

// Placeholder avatar image
import AppLogo from '../../images/icon.png';
import NoImg from '../../images/no-img.png';

class Navbar extends Component {
  handleLogout = () => {
    this.props.logoutUser();
    this.props.history.push('/');
  };

  render() {
    const {
      authenticated,
      user: {
        credentials: { handle, imageUrl, name }
      },
      location: { pathname }
    } = this.props;

    const currentHandle = handle || 'username';
    const profilePic = imageUrl || NoImg;

    // Custom App Logo
    const logoImg = (
      <img src={AppLogo} alt="SocialApe Logo" className="navbar-logo" />
    );

    // Desktop Left Menu Sidebar Markup
    const desktopSidebarMarkup = authenticated ? (
      <aside className="desktop-sidebar left-sidebar">
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <div className="logo-container">
            <Link to="/">{logoImg}</Link>
          </div>

          <nav className="menu-items">
            <Link to="/" className={`menu-item ${pathname === '/' ? 'active' : ''}`}>
              <HomeIcon />
              <span>Home</span>
            </Link>

            <Notifications isMobile={false} />

            <Link to={`/users/${currentHandle}`} className={`menu-item ${pathname === `/users/${currentHandle}` ? 'active' : ''}`}>
              <PersonOutlineIcon />
              <span>Profile</span>
            </Link>

            <PostScream isSidebar={true} />
          </nav>
        </div>

        {/* User Card at bottom of Left Sidebar */}
        <div className="sidebar-user-widget">
          <div className="user-info-wrapper" onClick={() => this.props.history.push(`/users/${currentHandle}`)}>
            <img src={profilePic} alt="User profile" className="user-avatar" />
            <div className="user-text-details">
              <span className="user-display-name">{name || handle}</span>
              <span className="user-handle-name">@{currentHandle}</span>
            </div>
          </div>
          <IconButton className="logout-icon-button" onClick={this.handleLogout} title="Logout">
            <KeyboardReturnIcon />
          </IconButton>
        </div>
      </aside>
    ) : (
      <aside className="desktop-sidebar left-sidebar">
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <div className="logo-container">
            <Link to="/">{logoImg}</Link>
          </div>

          <nav className="menu-items">
            <Link to="/" className={`menu-item ${pathname === '/' ? 'active' : ''}`}>
              <HomeIcon />
              <span>Home</span>
            </Link>

            <Link to="/login" className={`menu-item ${pathname === '/login' ? 'active' : ''}`}>
              <PersonOutlineIcon />
              <span>Login</span>
            </Link>

            <Link to="/signup" className={`menu-item ${pathname === '/signup' ? 'active' : ''}`}>
              <OfflineBoltIcon />
              <span>Signup</span>
            </Link>
          </nav>
        </div>
      </aside>
    );

    // Mobile Bottom Navigation Bar Markup
    const mobileBottomNavMarkup = authenticated ? (
      <nav className="mobile-bottom-nav left-sidebar">
        <div className="menu-items">
          <Link to="/" className={`menu-item ${pathname === '/' ? 'active' : ''}`}>
            <HomeIcon />
          </Link>

          <Notifications isMobile={true} />

          <Link to={`/users/${currentHandle}`} className={`menu-item ${pathname === `/users/${currentHandle}` ? 'active' : ''}`}>
            <PersonOutlineIcon />
          </Link>

          <div className="menu-item" onClick={this.handleLogout} title="Logout">
            <KeyboardReturnIcon />
          </div>
        </div>

        {/* Floating post trigger for Mobile */}
        <PostScream isMobileFAB={true} />
      </nav>
    ) : (
      <nav className="mobile-bottom-nav left-sidebar">
        <div className="menu-items">
          <Link to="/" className={`menu-item ${pathname === '/' ? 'active' : ''}`}>
            <HomeIcon />
          </Link>

          <Link to="/login" className={`menu-item ${pathname === '/login' ? 'active' : ''}`}>
            <PersonOutlineIcon />
          </Link>

          <Link to="/signup" className={`menu-item ${pathname === '/signup' ? 'active' : ''}`}>
            <OfflineBoltIcon />
          </Link>
        </div>
      </nav>
    );

    // Render layout dynamically. CSS manages hidden/display behaviors, but we render both components
    // so we don't have hydration or sizing timing issues.
    return (
      <Fragment>
        {desktopSidebarMarkup}
        {mobileBottomNavMarkup}
      </Fragment>
    );
  }
}

Navbar.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
  user: state.user
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(withRouter(Navbar));
