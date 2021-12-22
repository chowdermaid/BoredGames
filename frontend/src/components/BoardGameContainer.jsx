import React from 'react';
import Image from './Image';
import styled from 'styled-components';

export const Catalog = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;
  row-gap: 50px;
`;
const BoardGameContainer = (props) => {
  const displayImage = () => {
    return props.boardgames.map((game) => {
      return (
        <Image
          url={game.image_url}
          name={game.name}
          price={game.price_au}
          id={game.id}
          handle={game.handle}
          instock={game.quantity}
        />
      );
    });
  };

  return <Catalog>{displayImage()}</Catalog>;
};

export default BoardGameContainer;
