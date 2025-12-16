import React from "react";
import styled from "styled-components";

const Buttons = ({ children, className, ...props }) => {
  return (
    <StyledWrapper>
      <button className={className} {...props}>
        <span>{children}</span>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  button {
    outline: none;
    cursor: pointer;
    border: none;
    padding: 0.55rem 1.4rem;
    margin: 0;
    font-family: inherit;
    font-size: inherit;
    position: relative;
    display: inline-block;
    letter-spacing: 0.05rem;
    font-weight: 700;
    font-size: 17px;
    border-radius: 50px;
    overflow: hidden;
    background: linear-gradient(140deg, #009dec, #fc67cf);
    color: ghostwhite;
  }

  button span {
    position: relative;
    z-index: 10;
    transition: color 0.4s;
  }

  button:hover span {
    color: black;
  }

  button::before {
    content: "";
    position: absolute;
    top: 0;
    left: -10%;
    width: 120%;
    height: 100%;
    background: #000;
    transform: skew(30deg);
    transition: transform 0.4s cubic-bezier(0.3, 1, 0.8, 1);
    z-index: 0;
  }

  button:hover::before {
    transform: translate3d(100%, 0, 0);
  }
`;

export default Buttons;
