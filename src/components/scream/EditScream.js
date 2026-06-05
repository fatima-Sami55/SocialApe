import React, { Component, Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import MyButton from '../../util/MyButton';

// MUI Stuff
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import EditIcon from '@material-ui/icons/Edit';

import { connect } from 'react-redux';
import { editScream } from '../../redux/actions/dataActions';

const styles = {
  editButton: {}
};

class EditScream extends Component {
  state = {
    open: false,
    body: ''
  };

  componentDidMount() {
    this.setState({ body: this.props.screamBody });
  }

  handleOpen = () => {
    this.setState({ open: true, body: this.props.screamBody });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = () => {
    this.props.editScream(this.props.screamId, this.state.body);
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;

    return (
      <Fragment>
        <MyButton
          tip="Edit Scream"
          onClick={this.handleOpen}
          btnClassName={classes.editButton}
        >
          <EditIcon color="primary" />
        </MyButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Edit your scream</DialogTitle>
          <DialogContent>
            <TextField
              name="body"
              type="text"
              multiline
              rows="3"
              placeholder="Edit your scream"
              value={this.state.body}
              onChange={this.handleChange}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

EditScream.propTypes = {
  editScream: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  screamId: PropTypes.string.isRequired,
  screamBody: PropTypes.string.isRequired
};

export default connect(
  null,
  { editScream }
)(withStyles(styles)(EditScream));
