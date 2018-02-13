import React, { Component } from "react";
import Jumbotron from "../../components/Jumbotron";
import API from "../../utils/API";
import DeleteBtn from "../../components/DeleteBtn";
import { Button, Glyphicon, Navbar } from "react-bootstrap";
import { Col, Row, Container } from "../../components/Grid";
import { List, ListItem } from "../../components/List";
import Nav2 from "../../components/Nav2";
//import { Input, TextArea, FormBtn } from "../../components/Form";

class MainPage extends Component {
  state = {
    names: [],
    firstName: ""
  };


  //==============================================================
  //==============================================================
  // Component Mounting Functions
  //==============================================================

  // This creates the keystroke-logger function which lets the user select letters
  // document.addEventListener(
  //   "keydown",
  //   this._handleKeyDown.bind(this)
  // )
  componentWillMount() {
    console.log(this.props.auth);
  }

  // Initial load of saved articles
  componentDidMount() {
    //this.loadBiodiversity();
    //this.loadWordToGuess();
    this.loadTestData();
  };

  // code to get biodiversity list
  loadTestData = () => {
    API.getTestData()
      .then(
      res => {
        console.log("test data: " + JSON.stringify(res.data, null, 2))
        console.log("First name in list: " + res.data[0]["name"])
        this.setState({
          names: res.data,
          firstName: res.data[0]["name"]
        })
        console.log("names state: " + JSON.stringify(this.state.names, null, 2) )
      })
      // console.log(res.data.response.docs);
      .catch(err => console.log(err));
  };

// This is a leftover from my template file but would like to leave it here in case I add 
// an entry form for feedback in the future

  // handle form input
  handleInputChange = event => {
    // Destructure the name and value properties off of event.target
    // Update the appropriate state
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
    this.readUserInput(event)
  };

  // This is the function that renders the page in the client's window.
  render() {

    return (
      <Container fluid>
         <Row>
          <Nav2 auth = {this.props.auth}/> 
        </Row> 
        <Row>
          <Jumbotron>
            <h1>Hello {this.state.firstName}: Time to Get Coding!!</h1>
            {/* <h1>Hello : Time to Get Coding!!</h1> */}
          </Jumbotron>
        </Row>
      </Container >
    );
  }
}

export default MainPage;
