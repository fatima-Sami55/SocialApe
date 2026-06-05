import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import AppIcon from '../images/icon.png';
import { Link } from 'react-router-dom';

// MUI Stuff
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
// Redux stuff
import { connect } from 'react-redux';
import { signupUser } from '../redux/actions/userActions';

const styles = (theme) => ({
  ...theme
});

class signup extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      handle: '',
      errors: {}
    };
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({ errors: nextProps.UI.errors });
    }
  }
  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({
      loading: true
    });
    const newUserData = {
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
      handle: this.state.handle
    };
    this.props.signupUser(newUserData, this.props.history);
  };
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };
  render() {
    const {
      classes,
      UI: { loading }
    } = this.props;
    const { errors } = this.state;

    return (
      <div>
        <img src={AppIcon} alt="monkey" style={{ width: 60, height: 60, marginBottom: 10 }} />
        <Typography variant="h2" className={classes.pageTitle}>
          SignUp
        </Typography>
        <form noValidate onSubmit={this.handleSubmit}>
          <TextField
            id="email"
            name="email"
            type="email"
            label="Email"
            variant="outlined"
            className={classes.textField}
            helperText={errors.email}
            error={errors.email ? true : false}
            value={this.state.email}
            onChange={this.handleChange}
            fullWidth
          />
          <TextField
            id="password"
            name="password"
            type="password"
            label="Password"
            variant="outlined"
            className={classes.textField}
            helperText={errors.password}
            error={errors.password ? true : false}
            value={this.state.password}
            onChange={this.handleChange}
            fullWidth
          />
          <TextField
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            variant="outlined"
            className={classes.textField}
            helperText={errors.confirmPassword}
            error={errors.confirmPassword ? true : false}
            value={this.state.confirmPassword}
            onChange={this.handleChange}
            fullWidth
          />
          <TextField
            id="handle"
            name="handle"
            type="text"
            label="Handle"
            variant="outlined"
            className={classes.textField}
            helperText={errors.handle}
            error={errors.handle ? true : false}
            value={this.state.handle}
            onChange={this.handleChange}
            fullWidth
          />
          {errors.general && (
            <Typography variant="body2" className={classes.customError}>
              {errors.general}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.button}
            disabled={loading}
            fullWidth
          >
            SignUp
            {loading && (
              <CircularProgress size={30} className={classes.progress} />
            )}
          </Button>
          <div style={{ marginTop: 24 }}>
            <small style={{ color: '#7A6B65' }}>
              Already have an account ? Login <Link to="/login" style={{ color: '#1D9BF0', fontWeight: 600 }}>here</Link>
            </small>
          </div>
        </form>
      </div>
    );
  }
}

signup.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
  signupUser: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI
});

export default connect(
  mapStateToProps,
  { signupUser }
)(withStyles(styles)(signup));
