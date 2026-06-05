import React, { Component } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import CheckCircle from '@material-ui/icons/CheckCircle';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import Add from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';

// Mock avatars
const elonAvatar = 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&h=80&q=80';
const xAvatar = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=80&h=80&q=80';
const grokAvatar = 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=80&h=80&q=80';

class Sidebar extends Component {
  state = {
    followed: {
      elon: false,
      x: false,
      grok: false
    },
    grokOpen: false,
    messagesOpen: false
  };

  handleFollow = (user) => {
    this.setState((prevState) => ({
      followed: {
        ...prevState.followed,
        [user]: !prevState.followed[user]
      }
    }));
  };

  toggleWidget = (widget) => {
    this.setState((prevState) => ({
      [widget]: !prevState[widget]
    }));
  };

  render() {
    const { followed, grokOpen, messagesOpen } = this.state;

    return (
      <div className="right-sidebar">
        {/* Search Input Container */}
        <div className="search-box-container">
          <SearchIcon className="search-icon" />
          <input
            type="text"
            placeholder="Search anything"
            className="search-input"
          />
        </div>

        {/* You Might Like Widget */}
        <div className="sidebar-card">
          <h3 className="sidebar-card-title">You might like</h3>
          
          {/* Elon Musk */}
          <div className="sidebar-widget-row">
            <div className="widget-row-left">
              <img src={elonAvatar} alt="Elon Musk" className="user-avatar" />
              <div className="widget-row-texts">
                <span className="widget-row-title" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  Elon Musk <CheckCircle style={{ color: '#1D9BF0', fontSize: 16 }} />
                </span>
                <span className="widget-row-subtitle">@elonmusk</span>
              </div>
            </div>
            <Button
              className={`widget-follow-button ${followed.elon ? 'following' : ''}`}
              onClick={() => this.handleFollow('elon')}
            >
              {followed.elon ? 'Following' : 'Follow'}
            </Button>
          </div>

          {/* X */}
          <div className="sidebar-widget-row">
            <div className="widget-row-left">
              <img src={xAvatar} alt="X" className="user-avatar" />
              <div className="widget-row-texts">
                <span className="widget-row-title" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  X <CheckCircle style={{ color: '#FFD700', fontSize: 16 }} />
                </span>
                <span className="widget-row-subtitle">@x</span>
              </div>
            </div>
            <Button
              className={`widget-follow-button ${followed.x ? 'following' : ''}`}
              onClick={() => this.handleFollow('x')}
            >
              {followed.x ? 'Following' : 'Follow'}
            </Button>
          </div>

          {/* Grok */}
          <div className="sidebar-widget-row">
            <div className="widget-row-left">
              <img src={grokAvatar} alt="Grok" className="user-avatar" />
              <div className="widget-row-texts">
                <span className="widget-row-title" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  Grok <CheckCircle style={{ color: '#FFD700', fontSize: 16 }} />
                </span>
                <span className="widget-row-subtitle">@grok</span>
              </div>
            </div>
            <Button
              className={`widget-follow-button ${followed.grok ? 'following' : ''}`}
              onClick={() => this.handleFollow('grok')}
            >
              {followed.grok ? 'Following' : 'Follow'}
            </Button>
          </div>

          <span className="sidebar-show-more">Show more</span>
        </div>

        {/* What's Happening Widget */}
        <div className="sidebar-card">
          <h3 className="sidebar-card-title">What's happening</h3>

          <div className="sidebar-widget-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
            <span className="widget-row-subtitle">Trending in Technology</span>
            <span className="widget-row-title">Galaxy Z Fold7</span>
            <span className="widget-row-subtitle">Can your phone do that?<br/>Promoted by Samsung Mobile UK</span>
          </div>

          <div className="sidebar-widget-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
            <span className="widget-row-subtitle">Politics · Trending</span>
            <span className="widget-row-title">Charlie Kirk</span>
            <span className="widget-row-subtitle">Trending with Colorado, Praying<br/>6.73M Posts</span>
          </div>

          <div className="sidebar-widget-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
            <span className="widget-row-subtitle">Trending in United States</span>
            <span className="widget-row-title">Amanda Dodson</span>
            <span className="widget-row-subtitle">8,369 Posts</span>
          </div>

          <div className="sidebar-widget-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
            <span className="widget-row-subtitle">Austin Slater · Trending</span>
            <span className="widget-row-title">Austin Slater</span>
          </div>

          <span className="sidebar-show-more">Show more</span>
        </div>

        {/* Footer Meta Links */}
        <div style={{ padding: '0 16px', fontSize: '0.75rem', color: '#7A6B65', lineHeight: 1.6 }}>
          <span>Terms of Service | Privacy Policy | Cookie Policy</span>
          <br />
          <span>Accessibility | Ads info | More... | © 2026 X Corp.</span>
        </div>

        {/* Collapsible Grok & Messages Bars */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Grok Tab */}
          <div className="collapsible-footer-bar" onClick={() => this.toggleWidget('grokOpen')}>
            <span>Grok</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 400 }}>Ask anything...</span>
              <KeyboardArrowUp style={{ transform: grokOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </div>
          </div>
          {grokOpen && (
            <div style={{ background: '#ffffff', borderRadius: '0 0 16px 16px', padding: 16, border: '1px solid rgba(0,0,0,0.05)', height: 100, fontSize: '0.85rem' }}>
              Grok is ready. Start asking questions.
            </div>
          )}

          {/* Messages Tab */}
          <div className="collapsible-footer-bar" onClick={() => this.toggleWidget('messagesOpen')}>
            <span>Messages</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Add style={{ fontSize: 18 }} />
              <KeyboardArrowUp style={{ transform: messagesOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </div>
          </div>
          {messagesOpen && (
            <div style={{ background: '#ffffff', borderRadius: '0 0 16px 16px', padding: 16, border: '1px solid rgba(0,0,0,0.05)', height: 150, fontSize: '0.85rem' }}>
              No messages yet. Send a direct message to anyone!
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Sidebar;
