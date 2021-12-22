import React from 'react';
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';

const QuizProductsCard = ({
  imgurl,
  name,
  price,
  id,
  discount,
  hasDiscount,
}) => {
  const { handleClose } = useQuiz();
  return (
    <div className="quizProductCard">
      <Link to={`/shop/${id}`}>
        <img
          src={imgurl}
          id="quizProductImg"
          onClick={() => handleClose()}
          alt="quizProductCard"
        />
      </Link>
      <Typography>{name}</Typography>
      {hasDiscount ? (
        <div>
          <Typography
            style={{ textDecoration: 'line-through' }}
            fontWeight="bold"
          >
            ${price}
          </Typography>
          <Typography
            style={{
              color: '#4bbba9',
            }}
            fontWeight="bold"
          >
            Now ${discount.toFixed(2)}!
          </Typography>
        </div>
      ) : (
        <Typography fontWeight="bold">${price}</Typography>
      )}
    </div>
  );
};

export default QuizProductsCard;
