import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import Scream from '../components/scream/Scream';
import StaticProfile from '../components/profile/StaticProfile';
import Profile from '../components/profile/Profile';

import ScreamSkeleton from '../util/ScreamSkeleton';
import ProfileSkeleton from '../util/ProfileSkeleton';
import NoImg from '../images/no-img.png';

import { connect } from 'react-redux';
import { getUserData } from '../redux/actions/dataActions';
import { followUser, unfollowUser } from '../redux/actions/userActions';

class user extends Component {
  state = {
    profile: null,
    screams: [],
    likes: [],
    comments: [],
    activeTab: 'posts',
    loading: true,
    screamIdParam: null
  };

  componentDidMount() {
    const handle = this.props.match.params.handle;
    const screamId = this.props.match.params.screamId;

    if (screamId) this.setState({ screamIdParam: screamId });

    this.fetchUserData(handle);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.handle !== this.props.match.params.handle) {
      this.fetchUserData(this.props.match.params.handle);
    }

    // Sync any changes (like, unlike, delete) from global Redux store screams into our local states
    if (prevProps.data.screams !== this.props.data.screams) {
      const globalScreams = this.props.data.screams;
      this.setState((prevState) => {
        const isOwnProfile = this.props.user.authenticated && this.props.user.credentials.handle === this.props.match.params.handle;
        
        // Sync screams (posts)
        const updatedScreams = prevState.screams
          .filter((scream) => {
            if (isOwnProfile) {
              return globalScreams.some((gs) => gs.screamId === scream.screamId);
            }
            return true;
          })
          .map((scream) => {
            const match = globalScreams.find((gs) => gs.screamId === scream.screamId);
            return match ? { ...scream, ...match } : scream;
          });

        // Sync likes (liked screams)
        let updatedLikes = prevState.likes.map((scream) => {
          const match = globalScreams.find((gs) => gs.screamId === scream.screamId);
          return match ? { ...scream, ...match } : scream;
        });

        if (isOwnProfile && this.props.user.likes) {
          updatedLikes = updatedLikes.filter((scream) =>
            this.props.user.likes.some((l) => l.screamId === scream.screamId)
          );
        }

        return {
          screams: updatedScreams,
          likes: updatedLikes
        };
      });
    }
  }

  fetchUserData = (handle) => {
    this.setState({ loading: true });
    this.props.getUserData(handle);
    axios
      .get(`/user/${handle}`)
      .then((res) => {
        this.setState({
          profile: res.data.user,
          screams: res.data.screams || [],
          likes: res.data.likes || [],
          comments: res.data.comments || [],
          loading: false
        });
      })
      .catch((err) => {
        console.error(err);
        this.setState({ loading: false });
      });
  };

  handleTabChange = (tab) => {
    this.setState({ activeTab: tab });
  };

  handleFollowToggle = () => {
    const { profile } = this.state;
    const { following = [] } = this.props.user;
    const isFollowing = following && following.includes(profile.handle);

    if (isFollowing) {
      this.props.unfollowUser(profile.handle);
      this.setState((prevState) => ({
        profile: {
          ...prevState.profile,
          followerCount: Math.max(0, (prevState.profile.followerCount || 0) - 1)
        }
      }));
    } else {
      this.props.followUser(profile.handle);
      this.setState((prevState) => ({
        profile: {
          ...prevState.profile,
          followerCount: (prevState.profile.followerCount || 0) + 1
        }
      }));
    }
  };

  render() {
    dayjs.extend(relativeTime);
    const { screamIdParam, activeTab, loading } = this.state;
    const { authenticated, credentials } = this.props.user;
    const isOwnProfile = authenticated && credentials && this.props.match.params.handle === credentials.handle;

    const postsMarkup = loading ? (
      <ScreamSkeleton />
    ) : this.state.screams.length === 0 ? (
      <div style={{ padding: 24, textAlign: 'center', color: '#7A6B65', fontFamily: '"Inter", sans-serif' }}>
        <p>No posts yet</p>
      </div>
    ) : !screamIdParam ? (
      this.state.screams.map((scream) => <Scream key={scream.screamId} scream={scream} />)
    ) : (
      this.state.screams.map((scream) => {
        if (scream.screamId !== screamIdParam)
          return <Scream key={scream.screamId} scream={scream} />;
        else return <Scream key={scream.screamId} scream={scream} openDialog />;
      })
    );

    const likesMarkup = loading ? (
      <ScreamSkeleton />
    ) : this.state.likes.length === 0 ? (
      <div style={{ padding: 24, textAlign: 'center', color: '#7A6B65', fontFamily: '"Inter", sans-serif' }}>
        <p>No liked posts yet</p>
      </div>
    ) : (
      this.state.likes.map((scream) => (
        <Scream key={scream.screamId} scream={scream} />
      ))
    );

    const commentsMarkup = loading ? (
      <ScreamSkeleton />
    ) : this.state.comments.length === 0 ? (
      <div style={{ padding: 24, textAlign: 'center', color: '#7A6B65', fontFamily: '"Inter", sans-serif' }}>
        <p>No comments yet</p>
      </div>
    ) : (
      this.state.comments.map((comment, idx) => {
        const { body, createdAt, screamId, screamUserHandle, screamBody, screamUserName } = comment;
        const profilePic = this.state.profile.imageUrl || NoImg;
        return (
          <div key={createdAt + idx} style={{
            display: 'flex',
            padding: '18px 24px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
            position: 'relative'
          }}>
            <div style={{ width: 48, height: 48, marginRight: 16, flexShrink: 0 }}>
              <img src={profilePic} alt="Profile" style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                objectFit: 'cover'
              }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, fontSize: '0.95rem', color: '#0F1419' }}>
                  {this.state.profile.name || this.state.profile.handle}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#7A6B65' }}>@{this.state.profile.handle}</span>
                <span style={{ fontSize: '0.85rem', color: '#7A6B65' }}>·</span>
                <span style={{ fontSize: '0.85rem', color: '#7A6B65' }}>{dayjs(createdAt).fromNow()}</span>
              </div>
              
              {screamUserHandle && (
                <Link 
                  to={`/users/${screamUserHandle}/scream/${screamId}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div style={{
                    backgroundColor: '#FCFAF8',
                    borderLeft: '3px solid #1D9BF0',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    marginBottom: 8,
                    fontSize: '0.9rem',
                    color: '#7A6B65',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    '&:hover': {
                      backgroundColor: '#F5EDE8'
                    }
                  }}>
                    <span style={{ fontWeight: 600, color: '#0F1419' }}>Commented on {screamUserName || screamUserHandle}'s post: </span>
                    <span style={{ fontStyle: 'italic' }}>"{screamBody}"</span>
                  </div>
                </Link>
              )}

              <div style={{
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.95rem',
                lineHeight: 1.5,
                color: '#0F1419',
                wordBreak: 'break-word'
              }}>
                {body}
              </div>
            </div>
          </div>
        );
      })
    );

    return (
      <div>
        {this.state.profile === null ? (
          <ProfileSkeleton />
        ) : isOwnProfile ? (
          <Profile activeTab={activeTab} onTabChange={this.handleTabChange} />
        ) : (
          <StaticProfile
            profile={this.state.profile}
            activeTab={activeTab}
            onTabChange={this.handleTabChange}
            isFollowing={authenticated && this.props.user.following && this.props.user.following.includes(this.state.profile.handle)}
            onFollowToggle={this.handleFollowToggle}
            authenticated={authenticated}
          />
        )}
        <div>
          {activeTab === 'posts' && postsMarkup}
          {activeTab === 'likes' && likesMarkup}
          {activeTab === 'comments' && commentsMarkup}
        </div>
      </div>
    );
  }
}

user.propTypes = {
  getUserData: PropTypes.func.isRequired,
  followUser: PropTypes.func.isRequired,
  unfollowUser: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  data: state.data,
  user: state.user
});

export default connect(
  mapStateToProps,
  { getUserData, followUser, unfollowUser }
)(user);
