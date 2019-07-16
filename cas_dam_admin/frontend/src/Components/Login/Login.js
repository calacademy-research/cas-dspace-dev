import React from 'react';
import {Button, Form} from "react-bootstrap";

import './Login.css'

export default class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: ""
        };
    }

    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit = event => {
        event.preventDefault();
    }

    render() {
        return (
            <div className="Login">
                <Form onSubmit={this.handleSubmit}>
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
                            <Button disabled={!this.validateForm()} type="submit">
                                Login
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