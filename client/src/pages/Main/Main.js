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
    // List of animals that are randomly selected for guessing
    biodiversity: [],

    // Valid character set
    characSet: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a',
      's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x',
      'c', 'v', 'b', 'n', 'm'],

    // Word that is loaded behind the scenes 
    wordtoguess: "",

    // Word that the user sees on the screen
    displayedword: "",

    // Array of user entries
    userGuesses: [],

    userGuessesString: "",

    // Number of lives
    lives: 9,

    // Number of wins
    wins: 0,

    // Number of losses
    losses: 0,

    
    displayedwordwidth: "md-12",
    wordtoguesswidth: "md-12",

    // Boolean for showing or hiding the word that the user must guess
    showWord: false,
    displayWord: "display:block;",

    // Boolean for declaring the page setup as a mobile layout or a desktop layout.
    isMobile: false,

  };





  //https://stackoverflow.com/questions/10710345/finding-all-indexes-of-a-specified-character-within-a-string

  // creating a keystroke function for keyboards
  _handleKeyDown = (event) => {
    this.readUserKeyInput(event)
  }

  // displaykeyboard
  displayKeyboard = () => {
    this.setState({isMobile:true})
  }

  readUserKeyInput = (event) => {
    let userGuess = event.key.toLowerCase();
    console.log(userGuess);
    let BACKSPACE = 8;
    this.parseUserInput(userGuess);
  }

  readButtonInput = (event) => {
    let userGuess = event.target.value;
    console.log(userGuess);
    this.parseUserInput(userGuess);
  }


  // Parses user guesses, be they button clicks or keyboard strokes.
  parseUserInput = (input) => {
    console.log("Starting input parsing: ")
    let userGuess = input;
    console.log(userGuess)
    if (userGuess.value !== undefined) {
      console.log(userGuess.value)
      userGuess = userGuess.value
    }
    let alreadyGuessed = this.state.userGuesses;
    // This builds the array of userGuesses

    // First option:Check if it was the backspace key pressed
    if (userGuess === 'backspace' /*|| this.state.lives === 0*/) {
      console.log("Invalid character entry!")
      // Second option: has the user already selected this character?
    } else {
      if (alreadyGuessed.indexOf(userGuess) >= 0) {
        console.log("Repeated entry, entry ignored");
        // Third option: is the character valid (in characSet)?
      } else if (this.state.characSet.indexOf(userGuess) === -1) {
        console.log("Invalid character entry!")
        // Fourth option: everything is valid and the character selected gets pushed
        // to an array logging the choice and checking if it is in the wordtoguess.
      } else {
        alreadyGuessed.push(userGuess);
        console.log(alreadyGuessed);
        this.checkAgainstWord(userGuess);
        this.switchOutUnderscores(userGuess);
      }
    }

  }

  checkAgainstWord = (userGuess) => {
    if (this.state.wordtoguess.indexOf(userGuess) == -1) {
      console.log('The selected character "' + userGuess + '" is not in the hidden word!')
    } else {
      console.log('The selected character "' + userGuess + '" *is* in the hidden word!')
    }

    let guessList = this.state.userGuessesString;

    guessList = guessList + userGuess + " ";

    this.setState({ userGuessesString: guessList })
  }

  switchOutUnderscores = (userGuess) => {
    let wordToGuess = this.state.wordtoguess;

    //This checks if the userGuess is found in the word to pick

    //If it isn't, you lose a life:
    if (wordToGuess.indexOf(userGuess) == -1) {
      console.log("Oh shoot, you've lost a life!")
      let livesLeft = this.state.lives;
      livesLeft = livesLeft - 1;

      this.setState({ lives: livesLeft });
      this.checkforLoss(livesLeft);

    }

    //If it is in the word, it will switch out the underscore with the userGuess.
    else {
      let indeces = [];
      for (var i = 0; i < wordToGuess.length; i++) {
        if (wordToGuess[i] === userGuess) {
          indeces.push(i)
        };
      }
      console.log("Indeces of letter picked: " + indeces)

      let tempdisplayedWord = this.state.displayedword

      for (var j = 0; j < indeces.length; j++) {
        tempdisplayedWord.splice(indeces[j], 1, userGuess)
      }

      console.log(tempdisplayedWord);
      this.setState({ displayedword: tempdisplayedWord });

      this.checkForWin(this.state.displayedword);


      // console.log(indeces);

    }
  }

  checkforLoss = (lives) => {
    if (lives === 0) {
      let losses = this.state.losses;

      this.setState({
        losses: losses + 1,
        showWord: true,
        displayedwordwidth: "md-6",
        wordtoguesswidth: "md-6",
      });
      setTimeout(function () { this.resetGame() }.bind(this), 3000);
    }
  }

  checkForWin = (currentDisplay) => {
    if (currentDisplay.indexOf("_") === -1) {
      console.log("You win!")
      this.setState({
        wins: this.state.wins + 1,
        showWord: true,
      });
      setTimeout(function () { this.resetGame() }.bind(this), 3000);
    }
  }

  resetGame = () => {
    this.setState(
      {
        wordtoguess: "",
        displayedword: "",
        userGuesses: [],
        userGuessesString: "",
        lives: 9,
        showWord: false,
        displayedwordwidth: "md-12",
        wordtoguesswidth: "md-12",
      }
    )
    this.loadWordToGuess()
  }

  //==============================================================
  //==============================================================
  // Component Mounting Functions
  //==============================================================


  // This creates the keystroke-logger function which lets the user select letters
  componentWillMount() {
    document.addEventListener(
      "keydown",
      this._handleKeyDown.bind(this)
    )

  // This checks the width of the window and determines whether or not to display a series of 
  // buttons for user input - it's not fool proof - big tablets may fool it, but it's the most
  // reliable method I've found to check for whether or not the user is on a mobile device.
    console.log(window.matchMedia("max-width:780px").matches)
    if (window.matchMedia("(max-width: 780px)").matches) {
      this.setState({isMobile:true})
      console.log("this is a mobile device")
    } else {
      console.log("this isn't a mobile device")
    }
    console.log(this.props.auth);
  }

  // Initial load of saved articles
  componentDidMount() {
    //console.log(this.state.isMobile)
    // From: https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
    // This is a regex I found that seems to be hit-or-miss on detecting whether or not a user
    // is on a mobile device or not.
    window.mobileAndTabletcheck = function () {
      (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw(n|u)|c55\/|capi|ccwa|cdm|cell|chtm|cldc|cmd|co(mp|nd)|craw|da(it|ll|ng)|dbte|dcs|devi|dica|dmob|do(c|p)o|ds(12|d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(|_)|g1 u|g560|gene|gf5|gmo|go(\.w|od)|gr(ad|un)|haie|hcit|hd(m|p|t)|hei|hi(pt|ta)|hp( i|ip)|hsc|ht(c(| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i(20|go|ma)|i230|iac( ||\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|[a-w])|libw|lynx|m1w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|mcr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|([1-8]|c))|phil|pire|pl(ay|uc)|pn2|po(ck|rt|se)|prox|psio|ptg|qaa|qc(07|12|21|32|60|[2-7]|i)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h|oo|p)|sdk\/|se(c(|0|1)|47|mc|nd|ri)|sgh|shar|sie(|m)|sk0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h|v|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl|tdg|tel(i|m)|tim|tmo|to(pl|sh)|ts(70|m|m3|m5)|tx9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas|your|zeto|zte/i.test(a.substr(0, 4))
        ) this.setState({ isMobile: true });
      })
      (navigator.userAgent || navigator.vendor || window.opera);
    };
    this.loadBiodiversity();
    //this.loadWordToGuess();
  };

  // code to get biodiversity list
  loadBiodiversity = () => {
    API.getBiodiversity()
      .then(
      res => {
        //console.log("biodiversity list incoming: " + JSON.stringify(res.data, null, 2))
        let diverlist = res.data;
        let namelist = [];

        for (let n = 0; n < diverlist.length; n++) {
          // && namelist.indexOf(diverlist[n]["Common Name"] >= 0)

          // This pulls all the Animals from the biodiversity list in the database and stores 
          // them in a local array for quicker access.
          if (diverlist[n]["Category"] === "Animal") {
            namelist.push(diverlist[n]["Common Name"].toLowerCase());
          }
        }

        // console.log(namelist.length);
        this.setState({ biodiversity: namelist });
        // console.log("biodiversity list: " + JSON.stringify(this.state.biodiversity, null, 2));
        this.loadWordToGuess();
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

  //loads a random entry from the Biodiversity list that has been stored as an array 
  // in the page's state.
  loadWordToGuess = () => {
    //let words = ["flamingo", "ocelot", "pistol shrimp", "cockatiel"]/*["pistol shrimp"]*/
    let words = this.state.biodiversity
    let word = words[Math.floor(Math.random() * words.length)]
    let wordArray = word.split("");
    console.log(wordArray);
    //declare an empty array for us to push our "_" symbols to
    let currentlyPicked = []

    // fill the currentlyPicked array with either underscores, spaces, or special characters
    for (let i = 0; i < wordArray.length; i++) {
      switch (wordArray[i] !== " " || wordArray[i] !== "-" || wordArray[i] !== "'") {
        case wordArray[i] === "'":
          currentlyPicked.push("'")
          break;

        case wordArray[i] === "-":
          currentlyPicked.push("-")
          break;

        case wordArray[i] === " ":
          currentlyPicked.push(" ")
          break;

        default:
          currentlyPicked.push("_")
      }
    }

    console.log(currentlyPicked)
    //currentlyPicked = wordArray.fill("_");
    this.setState({ wordtoguess: word });
    this.setState({ displayedword: currentlyPicked });
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
            <h1>Hangman</h1>
          </Jumbotron>
        </Row>
        <Row>
          <Col size={this.state.displayedwordwidth}>
            <div className="panel panel-primary">
              <div className="panel-heading">
                <h3 className="panel-title"><strong><i className="fa fa-table"></i>  Word to Guess</strong></h3>
              </div>
              <div className="panel-body" id="well-section">
                <List>
                  <ListItem>
                    <h3>{this.state.displayedword}</h3>
                  </ListItem>
                </List>
              </div>
            </div>
          </Col>
          {this.state.showWord ?
            <Col size={this.state.wordtoguesswidth}>
              <div className="panel panel-primary">
                <div className="panel-heading">
                  <h3 className="panel-title"><strong><i className="fa fa-table"></i>  Word to Guess</strong></h3>
                </div>
                <div className="panel-body" id="well-section">
                  <List>
                    <ListItem>
                      <h3>{this.state.wordtoguess}</h3>
                    </ListItem>
                  </List>
                </div>
              </div>
            </Col>
            :
            null
          }
        </Row>
        <Row>
          <Col size="md-12">
            <div className="panel panel-primary">
              <div className="panel-heading">
                <h3 className="panel-title"><strong><i className="fa fa-table"></i>  Stats </strong></h3>
              </div>
              <div className="panel-body">
                <Row>
                  <Col size="md-6">
                    {/* Hangman Pic Goes Here */}
                    {/* onClick = {console.log(letter)} */}
                    {this.state.isMobile ? (
                      <div>
                        {this.state.characSet.map((letter, index) => (

                          <Button key={letter} value={letter} onClickCapture={this.readButtonInput} >
                            {letter}
                          </Button>
                        ))}
                      </div>
                    ) : (
                        null
                      )}
                    <h2> Hangman Pic Goes here </h2>
                  </Col>
                  <Col size="md-6">
                    <Row>
                      <Col size="md-12">
                        {/* Current Guesses */}
                        <div className="panel panel-secondary">
                          <div className="panel-heading">
                            <h3 className="panel-title">
                              <strong><i className="fa fa-table"></i> List of Current Guesses </strong>
                            </h3>
                          </div>
                          <div className="panel-body">
                            {this.state.userGuesses.length ? (
                              <h4> {this.state.userGuessesString} </h4>
                            ) : (
                                <Button onClickCapture = {this.displayKeyboard}>
                                  <Glyphicon glyph="hand-down" />
                                  <h3>Use Your Keyboard to Enter Guesses!</h3>
                                </Button>
                              )}
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col size="md-12">
                        {/* Lives left */}
                        <h2> Lives left (this round): {this.state.lives} </h2>
                      </Col>
                    </Row>
                    <Row>
                      <Col size="md-12">
                        <Row>
                          <Col size="md-6">
                            {/* Wins */}
                            <h2> Total Wins: {this.state.wins}</h2>
                          </Col>
                          <Col size="md-6">
                            {/* Losses */}
                            <h2> Total Losses: {this.state.losses} </h2>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            </div>

          </Col>
        </Row >
      </Container >
    );
  }
}

export default MainPage;
