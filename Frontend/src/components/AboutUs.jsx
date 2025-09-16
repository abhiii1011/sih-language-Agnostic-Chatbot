import React from "react";
import "./About.css";
import ChatHeader from "./ChatHeader";
import { useUser } from "../context/UserContext"; 

import img1 from "../assets/dashchar.png";
import img2 from "../assets/girl.png";
import img3 from "../assets/image 15.png";
import img4 from "../assets/kid.png";
import img5 from "../assets/singupCha.png";
import img6 from "../assets/loginCha.png";

const About = ({title}) => {
     const { user,isDesktop  } = useUser(); 
  
  return (
    <>
          {isDesktop && <ChatHeader  title={title} />}

    <div id="about-container">
      {/* Left images */}
      <div id="about-left">
        <img src={img1} alt="about" id="about-img" />
        <img src={img2} alt="about" id="about-img" />
        <img src={img3} alt="about" id="about-img" />
      </div>

      {/* Center text */}
      <div id="about-center">
        <h1>~About page</h1>
        <p id="about-text">
          A modern, minimalistic logo for EduGuide. The design should represent
          education, guidance, and connectivity. Use an open book or graduation
          cap symbol blended with a compass or guiding arrow to reflect
          "guidance". Keep the style clean, flat, and professional with smooth
          lines. Use a calm and trustworthy color palette (blue, teal, or green).
          The text EduGuide should appear in a bold, modern sans-serif font below
          or beside the symbol.
        </p>
      </div>

      {/* Right images */}
      <div id="about-right">
        <img src={img4} alt="about" id="about-img" />
        <img src={img5} alt="about" id="about-img" />
        <img style={{height:"10rem"}} src={img6} alt="about" className="img6kid" id="about-img" />
      </div>
    </div>
    </>
  );
};

export default About;
