import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Navbar from './Navbar';
import ServerError from './ServerError';

const AppLayout = ({ children, location, serverError }) => {
  if (serverError) {
    return <ServerError />;
  }

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  if (isAuthPage) {
    return (
      <div className="auth-layout-container">
        <div className="auth-card">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="grid-layout">
      <Navbar />
      <div className="middle-column">
        {children}
      </div>
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
  serverError: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
  serverError: state.UI.serverError
});

export default connect(mapStateToProps)(withRouter(AppLayout));

