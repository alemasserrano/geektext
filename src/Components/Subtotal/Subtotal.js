import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
//Created a component that serves as subtotal/price of books.
export default class Subtotal extends Component {
    render(){
        return (
            <Row className="show-grid"> 
                <Col md={6}> Subtotal </Col>
                <Col md={6}> {`$ ${this.props.price}`}</Col>

            </Row>
            
        )
    }
}

