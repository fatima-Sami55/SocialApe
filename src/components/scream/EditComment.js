import React, { Component, Fragment } from 'react';
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
import { editComment } from '../../redux/actions/dataActions';

class EditComment extends Component {
  state = {
    open: false,
    body: ''
  };

  componentDidMount() {
    this.setState({ body: this.props.commentBody });
  }

  handleOpen = () => {
    this.setState({ open: true, body: this.props.commentBody });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = () => {
    this.props.editComment(this.props.commentId, this.state.body);
    this.setState({ open: false });
  };

  render() {
    return (
      <Fragment>
        <MyButton
          tip="Edit Comment"
          onClick={this.handleOpen}
        >
          <EditIcon color="primary" />
        </MyButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Edit your comment</DialogTitle>
          <DialogContent>
            <TextField
              name="body"
              type="text"
              multiline
              rows="3"
              placeholder="Edit your comment"
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

EditComment.propTypes = {
  editComment: PropTypes.func.isRequired,
  commentId: PropTypes.string.isRequired,
  commentBody: PropTypes.string.isRequired
};

export default connect(
  null,
  { editComment }
)(EditComment);
