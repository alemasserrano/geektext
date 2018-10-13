import React, { Component } from 'react';
import { Grid } from 'react-bootstrap';
import Subtotal from './Components/Subtotal/Subtotal';
import Taxes from './Components/Taxes/Taxes';
import EstimatedTotal from './Components/EstimatedTotal/EstimatedTotal';
import BookDetails from './Components/BookDetails/BookDetails';



import './App.css';

class App extends Component {
  constructor(props){//constuctor that is 
    super(props);

      this.state ={ //giving attribute name to a variable and which values it is holding. 
        total: 100, //this is a structure that holds these elements.
        tax: 0,
        EstTotal: 0,
        bookPrice: 15,
        Quantity: 2
      };
}

  componentDidMount = () => {
      this.setState({

        tax: (this.state.total) * 0.07

      },
      function(){

        this.setState({
          EstTotal: this.state.total + this.state.tax,

          bookPrice: (this.state.Quantity) * (this.state.bookPrice)
        })

      }
      
      
      )
  }
  
  
  
  
  render() {
    return (
      <div className="container">
      
  
        <Grid className="purchase"> 

            <Subtotal price={this.state.total.toFixed(2)} />
            <Taxes taxes={this.state.tax.toFixed(2)} />
            <hr className="line-break" />
            <EstimatedTotal price={this.state.EstTotal.toFixed(2)} />
            <BookDetails price={this.state.bookPrice.toFixed(2)} quantity={this.state.Quantity}/>


        </Grid>
      
      
      
      </div>
    );
  }
}

export default App;
