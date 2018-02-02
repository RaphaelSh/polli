import React from 'react';
import { connect } from 'react-redux';
import { logout } from '../actions/signup';
import PropTypes from 'prop-types';
import { Menu, Dropdown } from 'semantic-ui-react';
import { withRouter } from "react-router-dom";

const { bool, string, func } = PropTypes;

class NavigationBar extends React.Component {
    state = { activeItem: 'home' }

    logout (e) {
         e.preventDefault();
         this.props.logout();
    }
    
    handleItemClick = (e, { name }) => {
        this.setState({ activeItem: name })
        let link = name==='home'?'/':'/'+name;
        this.props.history.push(link);
    }
    
    
    handleChange = (e, {value}) => { 
        this.setState({activeItem: value});
        this.props.history.push(`/${value}`);
    }
    
    render(){
        const { activeItem } = this.state, { isAuthenticated, username } = this.props;
        const guestLinks = (
            <Menu.Menu position='right' color='grey' inverted>
                <Menu.Item name='login' active={activeItem === 'login'} onClick={this.handleItemClick}>
                    Login
                </Menu.Item>
                <Menu.Item name='signup' active={activeItem === 'signup'} onClick={this.handleItemClick}>
                    Sign Up
                </Menu.Item>
            </Menu.Menu>
        );
        
        
        
        const options = [{text:'Add a new poll', value:'newpoll',key:1},{text:'My polls', value:'mypolls',key:2},{text:'My profile', value:'profile',key:3}]
        
        const memberLinks = (
            <Menu.Menu position='right' color='grey' inverted>
                <Dropdown floated text={ username } 
                                    simple item 
                                    onChange={this.handleChange.bind(this)}  
                                    options = {options}
                                    className='right'
                                    value = { activeItem }
                />
                <Menu.Item onClick={this.logout.bind(this)}>Logout</Menu.Item>

            </Menu.Menu>
        );
        
        
        return(
            <Menu color='grey' inverted className = 'menu'>
                    <Menu.Item name='home' active={activeItem === 'home'} onClick={this.handleItemClick}>
                        Home
                    </Menu.Item>
                { isAuthenticated ? memberLinks: guestLinks }
            </Menu>
        );
    }
}


NavigationBar.propTypes = {
    isAuthenticated: bool.isRequired,
    username: string,
    logout: func.isRequired
};

const mapStateToProps = ({ auth }) => ({
    isAuthenticated : auth.isAuthenticated,
    username: auth.user.username
});

export default connect(mapStateToProps,{ logout })(withRouter(NavigationBar));

