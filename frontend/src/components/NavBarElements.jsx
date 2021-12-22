import { FaBars } from 'react-icons/fa';
import { NavLink as Link } from 'react-router-dom';
import styled from 'styled-components';

export const Nav = styled.nav`
  background: #ffffff;
  box-shadow: 0px 4px 50px rgba(0, 0, 0, 0.3);
  height: 85px;
  display: flex;
  justify-content: space-between;
  // padding: 0.2rem calc((100vw - 1000px) / 2);
  padding: 0 4rem;
  z-index: 12;
`;

export const NavBarImage = styled.nav`
  height: 60%;
  display: flex;
  justify-content: space-between;
  z-index: 12;
  justify-content: flex-start;
`;

export const NavLink = styled(Link)`
  color: #808080;
  display: flex;
  justify-content: right;
  align-items: center;
  text-decoration: none;
  padding: 0 1rem;
  height: 100%;
  cursor: pointer;
  &.active {
    color: #000000;
    font-weight: bold;
  }
  &:hover {
    transition: all 0.3s ease-in-out;
    text-decoration: overline;
    color: #000000;
    font-weight: bold;
  }
`;

export const Bars = styled(FaBars)`
  display: none;
  color: #808080;
  @media screen and (max-width: 768px) {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(-100%, 75%);
    font-size: 1.8rem;
    cursor: pointer;
  }
`;

export const NavMenu = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-right: -24px;
  /* Second Nav */
  /* margin-right: 24px; */
  /* Third Nav */
  /* width: 100vw;
  white-space: nowrap; */
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const NavBtn = styled.nav`
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  margin-right: 24px;
  /* Third Nav */
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const NavBtnLink = styled(Link)`
  border-radius: 50%;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.3);
  background: #ffffff;
  max-width: 60px;
  max-height: 60px;
  margin: auto;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  /* Second Nav */
  &:hover {
    transition: all 0.2s ease-in-out;
    background: #808080;
    color: #000000;
  }
  justify-content: center;
  display: flex;
  align-items: center;
`;

export const StyledLink = styled(Link)`
  color: #000000;
  justify-content: left;
  text-decoration: none;
  padding: 1rem 0rem;
  cursor: pointer;
  &.active {
    font-weight: bold;
  }
  &:hover {
    transition: all 0.3s ease-in;
    text-decoration: underline;
    font-weight: bold;
  }
`;
