import React from 'react';
import Pokemons2 from './assets/img/2Squirtles.png';
import Squirtles5 from './assets/img/5Squirtles.png';
import logo from './assets/img/icon_small.png';
import text from './assets/img/logo.png';
import ChessPieces from './assets/img/ChessPieces.png';
import puzzle from './assets/img/puzzle.png';
import card from './assets/img/card.png';
import dice from './assets/img/dice.png';
import simple from './assets/img/simple.png';
import hate from './assets/img/comp3121.png';
import memory from './assets/img/memory.jpg';
import simulation from './assets/img/simulation.jpg';
import drafting from './assets/img/drafting.png';
import cooperative from './assets/img/cooperative.jpg';
import short from './assets/img/short.png';
import long from './assets/img/long.png';
import { Typography, Button, Box, Modal, Slider } from '@material-ui/core';
import { useQuiz } from '../context/QuizContext';
import './assets/scss/SignupQuiz.scss';
import { useAlert } from '../context/AlertContext';

const SignupQuiz = () => {
  const {
    open,
    handleClose,
    quizPage,
    setQuizPage,
    handleQuestionClick,
    questionsComplete,
    q1,
    q2,
    q3,
    q4,
    q5,
    submitQuiz,
    displayQuizRecommendedItems,
  } = useQuiz();

  const { loading2, DisplayLoadingScreen } = useAlert();

  const marks = [
    {
      value: 1,
      label: 'Q1',
    },
    {
      value: 2,
      label: 'Q2',
    },
    {
      value: 3,
      label: 'Q3',
    },
    {
      value: 4,
      label: 'Q4',
    },
    {
      value: 5,
      label: 'Q5',
    },
  ];

  const quizView = () => {
    if (quizPage === 1) {
      return (
        <div className="QuestionQuiz">
          <Typography id="quizMainQuestion">
            Do you like playing in a small group or large group?
          </Typography>
          <div className="TwoOptionsQuiz">
            <div className="TwoOptionsImg1">
              <a href="/#" onClick={() => handleQuestionClick('small', 'q1')}>
                <img
                  id="imgQuiz"
                  src={Pokemons2}
                  alt="no frens"
                  style={{
                    border: q1 === 'small' ? '5px solid #9ddfd5' : 'None',
                  }}
                />
                <h2>
                  <span>Small Group</span>
                </h2>
              </a>
            </div>
            <div className="TwoOptionsImg2">
              <a href="/#" onClick={() => handleQuestionClick('large', 'q1')}>
                <img
                  id="imgQuiz"
                  src={Squirtles5}
                  alt="lots of frens"
                  style={{
                    border: q1 === 'large' ? '5px solid #9ddfd5' : 'None',
                  }}
                />
                <h2>
                  <span>Large Group</span>
                </h2>
              </a>
            </div>
          </div>
        </div>
      );
    } else if (quizPage === 2) {
      return (
        <div className="QuestionQuiz">
          <div className="QuestionQuiz">
            <Typography id="quizMainQuestion">
              Which category do you like the most?
            </Typography>
            <div className="FourOptionsQuiz">
              <div className="FourOptionsQuizR1">
                <div className="FourOptionsImg1">
                  <a
                    href="/#"
                    onClick={() => handleQuestionClick('dice', 'q2')}
                  >
                    <img
                      id="imgQuiz2"
                      src={dice}
                      alt="dice"
                      style={{
                        border: q2 === 'dice' ? '5px solid #9ddfd5' : 'None',
                      }}
                    />
                    <h2>
                      <span>Dice</span>
                    </h2>
                  </a>
                </div>
                <div className="FourOptionsImg2">
                  <a
                    href="/#"
                    onClick={() => handleQuestionClick('card', 'q2')}
                  >
                    <img
                      id="imgQuiz2"
                      src={card}
                      alt="card"
                      style={{
                        border: q2 === 'card' ? '5px solid #9ddfd5' : 'None',
                      }}
                    />
                    <h2>
                      <span>Card</span>
                    </h2>
                  </a>
                </div>
              </div>
              <div className="FourOptionsQuizR2">
                <div className="FourOptionsImg3">
                  <a
                    href="/#"
                    onClick={() => handleQuestionClick('strategy', 'q2')}
                  >
                    <img
                      id="imgQuiz2"
                      src={ChessPieces}
                      alt="strategy"
                      style={{
                        border:
                          q2 === 'strategy' ? '5px solid #9ddfd5' : 'None',
                      }}
                    />
                    <h2>
                      <span>Strategy</span>
                    </h2>
                  </a>
                </div>
                <div className="FourOptionsImg4">
                  <a
                    href="/#"
                    onClick={() => handleQuestionClick('puzzle', 'q2')}
                  >
                    <img
                      id="imgQuiz2"
                      src={puzzle}
                      alt="puzzle"
                      style={{
                        border: q2 === 'puzzle' ? '5px solid #9ddfd5' : 'None',
                      }}
                    />
                    <h2>
                      <span>Puzzle</span>
                    </h2>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <Button
            sx={{ right: '372px', bottom: '520px', backgroundColor: '#485B73' }}
            variant="contained"
            size="small"
            onClick={() => setQuizPage(1)}
          >
            Prev
          </Button>
        </div>
      );
    } else if (quizPage === 3) {
      return (
        <div className="QuestionQuiz">
          <div className="QuestionQuiz">
            <Typography id="quizMainQuestion">
              Do you prefer simple or complex games?
            </Typography>
            <div className="TwoOptionsQuiz">
              <div className="TwoOptionsImg1">
                <a
                  href="/#"
                  onClick={() => handleQuestionClick('simple', 'q3')}
                >
                  <img
                    id="imgQuiz"
                    src={simple}
                    alt="simple"
                    style={{
                      border: q3 === 'simple' ? '5px solid #9ddfd5' : 'None',
                    }}
                  />
                  <h2>
                    <span>Simple</span>
                  </h2>
                </a>
              </div>
              <div className="TwoOptionsImg2">
                <a
                  href="/#"
                  onClick={() => handleQuestionClick('complex', 'q3')}
                >
                  <img
                    id="imgQuiz"
                    src={hate}
                    alt="complex"
                    style={{
                      border: q3 === 'complex' ? '5px solid #9ddfd5' : 'None',
                    }}
                  />
                  <h2>
                    <span>Complex</span>
                  </h2>
                </a>
              </div>
            </div>
          </div>
          <Button
            sx={{ right: '372px', bottom: '465px', backgroundColor: '#485B73' }}
            variant="contained"
            size="small"
            onClick={() => setQuizPage(2)}
          >
            Prev
          </Button>
        </div>
      );
    } else if (quizPage === 4) {
      return (
        <div className="QuestionQuiz">
          <div className="QuestionQuiz">
            <div className="QuestionQuiz">
              <Typography id="quizMainQuestion">
                Which playstyle interests you the most?
              </Typography>
              <div className="FourOptionsQuiz">
                <div className="FourOptionsQuizR1">
                  <div className="FourOptionsImg1">
                    <a
                      href="/#"
                      onClick={() => handleQuestionClick('cooperative', 'q4')}
                    >
                      <img
                        id="imgQuiz2"
                        src={cooperative}
                        alt="cooperative"
                        style={{
                          border:
                            q4 === 'cooperative' ? '5px solid #9ddfd5' : 'None',
                        }}
                      />
                      <h2 id="cooperativeH2">
                        <span>Cooperative</span>
                      </h2>
                    </a>
                  </div>
                  <div className="FourOptionsImg2">
                    <a
                      href="/#"
                      onClick={() => handleQuestionClick('simulation', 'q4')}
                    >
                      <img
                        id="imgQuiz2"
                        src={simulation}
                        alt="simulation"
                        style={{
                          border:
                            q4 === 'simulation' ? '5px solid #9ddfd5' : 'None',
                        }}
                      />
                      <h2 id="simulationH2">
                        <span>Simulation</span>
                      </h2>
                    </a>
                  </div>
                </div>
                <div className="FourOptionsQuizR2">
                  <div className="FourOptionsImg3">
                    <a
                      href="/#"
                      onClick={() => handleQuestionClick('drafting', 'q4')}
                    >
                      <img
                        id="imgQuiz2"
                        src={drafting}
                        alt="drafting"
                        style={{
                          border:
                            q4 === 'drafting' ? '5px solid #9ddfd5' : 'None',
                        }}
                      />
                      <h2>
                        <span>Drafting</span>
                      </h2>
                    </a>
                  </div>
                  <div className="FourOptionsImg4">
                    <a
                      href="/#"
                      onClick={() => handleQuestionClick('memory', 'q4')}
                    >
                      <img
                        id="imgQuiz2"
                        src={memory}
                        alt="memory"
                        style={{
                          border:
                            q4 === 'memory' ? '5px solid #9ddfd5' : 'None',
                        }}
                      />
                      <h2>
                        <span>Memory</span>
                      </h2>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Button
            sx={{ right: '372px', bottom: '510px', backgroundColor: '#485B73' }}
            variant="contained"
            size="small"
            onClick={() => setQuizPage(3)}
          >
            Prev
          </Button>
        </div>
      );
    } else if (quizPage === 5) {
      return (
        <div className="QuestionQuiz">
          <div className="QuestionQuiz">
            <div className="QuestionQuiz">
              <Typography id="quizMainQuestion">
                Do you prefer short games or long games?
              </Typography>
              <div className="TwoOptionsQuiz">
                <div className="TwoOptionsImg1">
                  <a
                    href="/#"
                    onClick={() => handleQuestionClick('short', 'q5')}
                  >
                    <img
                      id="imgQuiz"
                      src={short}
                      alt="short"
                      style={{
                        border: q5 === 'short' ? '5px solid #9ddfd5' : 'None',
                      }}
                    />
                    <h2 id="shortH2">
                      <span>Short</span>
                    </h2>
                  </a>
                </div>
                <div className="TwoOptionsImg2">
                  <a
                    href="/#"
                    onClick={() => handleQuestionClick('long', 'q5')}
                  >
                    <img
                      id="imgQuiz"
                      src={long}
                      alt="long"
                      style={{
                        border: q5 === 'long' ? '5px solid #9ddfd5' : 'None',
                      }}
                    />
                    <h2 id="longH2">
                      <span>Long</span>
                    </h2>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <Button
            sx={{ right: '372px', bottom: '455px', backgroundColor: '#485B73' }}
            variant="contained"
            size="small"
            onClick={() => setQuizPage(4)}
          >
            Prev
          </Button>
        </div>
      );
    } else if (quizPage === 6) {
      return (
        <div>
          <Typography
            sx={{ textAlign: 'center', padding: '1rem' }}
            fontWeight="bold"
            fontSize="1.5rem"
          >
            Thank you for completing our quiz!<br></br>
            Here are some games you may like:
          </Typography>

          {loading2 ? (
            <DisplayLoadingScreen />
          ) : (
            <>
              {' '}
              <div
                style={{
                  display: 'flex',
                  flexFlow: 'row wrap',
                  justifyContent: 'center',
                  marginTop: '20px',
                }}
              >
                {displayQuizRecommendedItems}
              </div>{' '}
            </>
          )}

          <Typography
            sx={{ textAlign: 'center', marginTop: '1rem' }}
            fontWeight="bold"
          >
            Click anywhere outside the box to close this
          </Typography>
        </div>
      );
    }
  };

  React.useEffect(() => {
    /* eslint-disable */
    submitQuiz();
  }, [questionsComplete]);

  const boxStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50rem',
    height: '45rem',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={boxStyle}>
        <div className="QuizTitle">
          <img id="logoQuiz" src={logo} alt="logoQuiz" />
          <img id="boredGamesLogo" src={text} alt="boredGamesLogo" />
        </div>
        {!quizPage === 6 ? (
          <Slider
            sx={{
              color: '#485B73',
              marginTop: '1.5rem',
              marginBottom: '2rem',
            }}
            size="small"
            min={1}
            max={5}
            value={quizPage}
            onChange={(e) => setQuizPage(e.target.value)}
            marks={marks}
            disabled={true}
          />
        ) : (
          <div></div>
        )}

        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {quizView()}
        </Typography>
      </Box>
    </Modal>
  );
};

export default SignupQuiz;
