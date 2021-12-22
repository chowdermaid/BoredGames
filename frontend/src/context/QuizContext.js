import React, { useContext } from 'react';
import { completeQuiz, getRecommendedGamesQuiz } from '../api/recommenderApi';
import { useAlert } from './AlertContext';
import { useAuth } from './AuthContext';
import QuizProductsCard from '../cards/QuizProductsCard';
import { useUser } from './UserContext';

const QuizContext = React.createContext(undefined);

export const QuizProvider = ({ children }) => {
  const { token } = useAuth();
  const { setQuizComplete } = useUser();
  const { handlePopupClick, setLoading2 } = useAlert();
  const [questionsComplete, setQuestionsComplete] = React.useState(false);
  const [quizPage, setQuizPage] = React.useState(1);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [q1, setQ1] = React.useState(undefined);
  const [q2, setQ2] = React.useState(undefined);
  const [q3, setQ3] = React.useState(undefined);
  const [q4, setQ4] = React.useState(undefined);
  const [q5, setQ5] = React.useState(undefined);
  const [products, setProducts] = React.useState([]);

  const handleQuestionClick = (value, question) => {
    if (question === 'q1') {
      setQ1(value);
      setQuizPage(2);
    } else if (question === 'q2') {
      setQ2(value);
      setQuizPage(3);
    } else if (question === 'q3') {
      setQ3(value);
      setQuizPage(4);
    } else if (question === 'q4') {
      setQ4(value);
      setQuizPage(5);
    } else if (question === 'q5') {
      setQ5(value);
      setQuestionsComplete(true);
      setQuizPage(6);
    }
  };

  /**
   * Checks if quiz is complete
   */
  const refreshQuiz = () => {
    setQuestionsComplete(false);
    setQuizPage(1);
    setQ1(undefined);
    setQ2(undefined);
    setQ3(undefined);
    setQ4(undefined);
    setQ5(undefined);
    setProducts([]);
  };

  /**
   * Submits quiz
   */
  const submitQuiz = async () => {
    if (questionsComplete) {
      try {
        const data = await completeQuiz({
          token: token,
          Q1: q1,
          Q2: q2,
          Q3: q3,
          Q4: q4,
          Q5: q5,
        });
        if (data) {
          getQuizRecommendedItems();
          setQuizComplete(true);
        }
      } catch (error) {
        handlePopupClick(error.message.toString(), 'error', 'top', 'center');
      }
    }
  };

  /**
   * Gets all recommended items
   */
  const getQuizRecommendedItems = async () => {
    setLoading2(true);
    try {
      const data = await getRecommendedGamesQuiz({ token: token });
      if (data) {
        setProducts(data);
      }
    } catch (error) {
      handlePopupClick(error.message.toString(), 'error', 'top', 'center');
    }
    setLoading2(false);
  };

  const discountedPrice = (discount, price) => {
    var value = 0;
    value = price * (1 - discount);
    return value;
  };

  const hasDiscount = (discount) => {
    if (discount > 0) {
      return true;
    }
    return false;
  };

  const displayQuizRecommendedItems = products.map((data) => (
    <QuizProductsCard
      imgurl={data.image_url}
      name={data.name}
      price={data.price_au}
      id={data.id}
      discount={discountedPrice(data.discount, data.price_au)}
      hasDiscount={hasDiscount(data.discount)}
      key={data.handle}
    />
  ));

  return (
    <QuizContext.Provider
      value={{
        setQuizComplete,
        open,
        handleOpen,
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
        refreshQuiz,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => useContext(QuizContext);
