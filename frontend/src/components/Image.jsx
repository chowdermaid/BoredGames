import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const Element = styled.div`
  width: 10rem;
`;

export const Item = styled.div`
  height: 8rem;
  display: flex;
  justify-content: center;
`;

export const Text = styled.div`
  height: 8rem;
  display: flex;
  justify-content: center;
`;

// eslint-disable-next-line
export default Image = (props) => {
  return (
    <Element>
      <Link to={`/shop/${props.id}`}>
        <Item>
          <img src={props.url} alt="board game" />
        </Item>
        <Text>
          <p>
            {props.name}
            <b>
              <br />
              {props.price}
            </b>
            <br />
            In stock: {props.instock}
          </p>
        </Text>
      </Link>
    </Element>
  );
};
