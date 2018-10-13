import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
//import { Subtotal } from './Components/Subtotal/Subtotal';


export default class EstimatedTotal extends Component{

    render(){

        return(

            <Row className="show-grid">
                <Col id="border" md={6}> <h2 className="estTotal"> Est. Total </h2> </Col>
                <Col md={6}>  <h2 className="estTotal"> {`$ ${this.props.price}`}  </h2> </Col>
            </Row>

        )



    }





}