import React from 'react';
import {Button, Form} from "react-bootstrap";

import './Login.css'
import axios from "axios";

export default class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            isLoading: false,
            isLoggedIn: null,
            dSpaceConnected: null,
        };
    }

    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    handleSubmit = event => {
        this.setState({isLoading: true});
        this.testLoginCredentials();


        event.preventDefault();
    };

    testLoginCredentials() {
        axios.post('/api/test_login_credentials', {
            email: this.state.email,
            password: this.state.password
        }).then((response) => {
            this.setState({isLoading: false, dSpaceConnected: true});
            if (response.data === 'True') {
                this.setState({isLoggedIn: true});
                this.props.setEmailAndPassword({email: this.state.email, password: this.state.password});
                setTimeout(() => {
                    this.props.closeModal();
                }, 1000)
            } else if (response.data === 'False') {
                // With Axios, this block is not accessed, as it considers a 401 response to be an error.
                // Instead, it jumps directly to the catch block.
                this.setState({isLoggedIn: false})
            }
        }).catch(error => {
            this.setState({isLoading: null, isLoggedIn: false, dSpaceConnected: false});
        })
    }


    render() {
        let loginMessage;

        if (this.state.dSpaceConnected === false) {
            loginMessage = <p style={{color: 'red'}}>Error: Failed to Connect to Dspace</p>;
        } else if (this.state.isLoggedIn === false) {
            loginMessage = <p style={{color: 'red'}}>Error: Email/password combination are incorrect</p>
        } else if(this.state.isLoggedIn) {
            loginMessage = <p style={{color: 'green'}}>Success! You've been logged in</p>
        } else {
            loginMessage = null;
        }

        return (
            <div className="Login">
                <Form onSubmit={this.handleSubmit}>
                    <div>
                        {loginMessage}
                    </div>
                    <Form.Group controlId="email" bssize="large">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            autoFocus
                            type="email"
                            value={this.state.email}
                            onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="password" bssize="large">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            value={this.state.password}
                            onChange={this.handleChange}
                            type="password"
                        />
                    </Form.Group>
                    <div>
                        <div style={{display: 'inline-block'}}>
                            <Button disabled={this.state.isLoading}
                                    onClick={!this.state.isLoading ? this.handleSubmit : null} type="submit">
                                {this.state.isLoading ? 'Logging in…' : 'Login'}
                            </Button>
                        </div>
                        <div style={{display: 'inline-block', float: 'right'}}>
                            <Button onClick={this.props.closeModal}>Cancel</Button>
                        </div>
                    </div>
                </Form>
            </div>
        );

    }
}