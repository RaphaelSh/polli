import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Menu, Dropdown } from 'semantic-ui-react';
import { withRouter } from "react-router-dom";

const { bool, string, func } = PropTypes;

class NavigationBar extends React.Component {
    
    state = { activeItem: 'home' }

    logout (e) {
         e.preventDefault();
         this.props.logout();
         if(/access_token|id_token|error/.test(this.props.location.hash)) {
            this.props.history.push('/'); 
         }
    }
    
    handleItemClick = (e, { name }) => {

        this.setState({ activeItem: name });
        let link;
        switch (name) {
          case 'home': link = '/'; break;
          case 'signup': link = '/signup/1'; break;
          case 'login': link = '/signup/0'; break;
          default: link = '/'; 
        }
        this.props.history.push(link);
    }
    
    
    handleChange = (e, {value}) => { 
        this.setState({activeItem: value});
        this.props.history.push(`/${value}`);
    }
    
    mouseEnter = () => {
        this.props.opacityAnim('MOUSE_ENTER_NAVBAR');
    }
    
    mouseLeave = () => {
        this.props.opacityAnim('MOUSE_LEAVE_NAVBAR');
    }
    render(){
        
        const { activeItem } = this.state, { isAuthenticated, username, login, navbar_opacity } = this.props;
        
        const guestLinks = (
            <Menu.Menu position='right' color='grey' inverted>
                <Menu.Item name='login' active={ activeItem === 'login' } onClick={ this.handleItemClick }>
                    Login
                </Menu.Item>
                <Menu.Item name='signup' active={ activeItem === 'signup' } onClick={ this.handleItemClick }>
                    Sign Up
                </Menu.Item>
            </Menu.Menu>
        );
        
        
        
        const options = [   { text : 'Add a new poll', value : 'newpoll', key:1 },
                            { text : 'My polls', value : 'mypolls', key:2 },
                            { text : 'My profile', value : 'profile', key:3 }
                        ]
        
        const memberLinks = (
            <Menu.Menu position='right' color='grey' inverted>
                <Dropdown floated text={ username } 
                                    simple item 
                                    onChange={ this.handleChange.bind(this) }  
                                    options = { options }
                                    className='right'
                                    value = { activeItem }
                />
                <Menu.Item onClick = { this.logout.bind(this) }>Logout</Menu.Item>

            </Menu.Menu>
        );
        
        
        return(
            <div  className = 'navbar' style = {{ opacity: navbar_opacity }} 
                    onMouseEnter = {this.mouseEnter} 
                    onMouseLeave = {this.mouseLeave}
            >
            <Menu className = 'navbar'>
                    <Menu.Item name='home' active={activeItem === 'home'} onClick={this.handleItemClick}>
                        Home
                    </Menu.Item>
                { login? <div/>: (isAuthenticated ? memberLinks: guestLinks) }
            </Menu>
            </div>
        );
    }
}


NavigationBar.propTypes = {
    isAuthenticated: bool.isRequired,
    username: string,
    logout: func.isRequired
};

const mapStateToProps = ({ auth, navbar_opacity },props) => {
    return {
        isAuthenticated : auth.isAuthenticated,
        username : auth.user.name,
        navbar_opacity,
        login: /^\/sign/g.test(window.location.pathname)
    };
};

const mapDispatchToProps = dispatch => ({
    logout : () => dispatch ({ type: 'LOGOUT' }),
    opacityAnim: type => dispatch({type})
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps )(NavigationBar));

