import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
// MUI
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import EditComment from './EditComment';
import DeleteComment from './DeleteComment';

const styles = (theme) => ({
  ...theme,
  commentImage: {
    maxWidth: '100%',
    height: 100,
    objectFit: 'cover',
    borderRadius: '50%'
  },
  commentData: {
    marginLeft: 20
  }
});

const Comments = ({ classes, user: { credentials: { handle, name } }, scream: { comments = [] } }) => (
  <Grid container>
    {comments.map((comment, index) => {
      const { commentId, body, createdAt, userImage, userHandle, userName } = comment;
      const commenterName = userHandle === handle ? name || handle : userName || userHandle;
      return (
        <React.Fragment key={createdAt + index}>
          <Grid item sm={12}>
            <Grid container alignItems="center">
              <Grid item sm={2}>
                <img
                  src={userImage}
                  alt="comment"
                  className={classes.commentImage}
                />
              </Grid>
              <Grid item sm={8}>
                <div className={classes.commentData}>
                  <Typography
                    variant="h5"
                    component={Link}
                    to={`/users/${userHandle}`}
                    color="primary"
                  >
                    {commenterName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
                  </Typography>
                  <hr className={classes.invisibleSeparator} />
                  <Typography variant="body1">{body}</Typography>
                </div>
              </Grid>
              <Grid item sm={2}>
                {userHandle === handle && commentId && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <EditComment commentId={commentId} commentBody={body} />
                    <DeleteComment commentId={commentId} />
                  </div>
                )}
              </Grid>
            </Grid>
          </Grid>
          {index !== comments.length - 1 && (
            <hr className={classes.visibleSeparator} />
          )}
        </React.Fragment>
      );
    })}
  </Grid>
);

Comments.propTypes = {
  scream: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  scream: state.data.scream,
  user: state.user
});

export default connect(mapStateToProps)(withStyles(styles)(Comments));
