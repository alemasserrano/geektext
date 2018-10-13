import React, { Component } from 'react';
import { Col, Row, Button, Collapse, Media, Well, DropdownButton, ModalTitle, MenuItem  } from 'react-bootstrap';


export default class BookDetails extends Component{

    constructor(props){
        super(props);

        this.state ={

            open: false,
        }
    }
    
    render(){
        
        return(


         <div>
           <Button className = "books-btn"
            bsStyle="link" //part of bootstrap btn class
            onClick ={() => this.setState({open: !this.state.open})} //onClick event used to toggle
           > 

           
           {this.state.open === false ? `See` : `Hide `} Book Details
           {this.state.open === false ? `+` : `- `}
                  
                          
           </Button> 
           {/* //two conditions are being used
           //1) if open is false, See should be behind books details and  + should appear after book details
           //2) Similar to 1), if True, Hide appears behing book details and - appears ahead.  */}

           <Collapse in={this.state.open}> 
                <div>
                    <Well> 

                        <Media> 
                            <Media.Left> 
                                <img className="bookImage"
                                src="https://images-na.ssl-images-amazon.com/images/I/61ZpELEZUEL._SX315_BO1,204,203,200_.jpg "/>
                            </Media.Left>
                            <Media.Body>
                            <Row className="show-grid">
                                    <Col md={12}> <p> {`Description: ${this.props.description}`} </p> </Col>
                                
                                </Row>
                                <Row>
                                    <Col md={12}> <h5>{`Author Name: ${this.props.authorName}`} </h5> </Col>
                                
                                </Row>
                                <Row>
                                    <Col md={7}> <h5> <strong>{`Price: ${this.props.price}`} </strong> </h5> </Col>
                                    <Col md={5}> <strong> {`Qty: ${this.props.quantity}`} </strong> </Col>
                                </Row>

                            </Media.Body>
                            <Media.Right>
                                



                            </Media.Right>
                        </Media>

                    </Well>


                </div>
           
           </Collapse>

         </div>

    )}








}