import BackgroundVideo from "../components/BackgroundVideo"; // Ensure this is imported
import Wrapper from "../assets/wrappers/LandingPage";
import styled from "styled-components";
import {Box} from '@mui/material'
import { Link } from "react-router-dom";
import bg from "../assets/images/back.png";
import Logo from '../components/Logo'

const Landing = () => {
  const ImageContainer = styled.div`
    position: fixed; /* Fix the position to the viewport */
    top: 0;
    left: 0;
    width: 100vw; /* Set width to full viewport */
    height: 100vh; /* Set height to full viewport */
    overflow: hidden; /* Hide overflow */
    z-index: -1; /* Send it to the back */

    img {
      width: 100%; /* Stretch image to fit width */
      height: 100%; /* Stretch image to fit height */
      object-fit: cover; /* Cover the container */
    }
  `;

  return (
    <Wrapper>
      <ImageContainer>
        <img src={bg} alt="Background" />
      </ImageContainer>
      <div className="overlay"></div> {/* Add the overlay */}
      <nav>{/* <img src={landing} alt="" /> */}</nav>
      <div className="container page">
        {/* info */}
        <div className="info">
          <Box sx={{ marginBottom: "4rem " }}>
            <Logo />
          </Box>
          <Box >
            <h1 style={{marginTop:"-4rem"}}>
              Event <span>Register</span> Website
            </h1>
            <p style={{ color: "white" }}>
              Join us in exploring a world of exciting upcoming events tailored
              just for you! Our platform is designed to streamline the
              registration process, making it easy for you to secure your spot
              at various events. Whether you're interested in workshops,
              conferences, concerts, or festivals, we offer a diverse range of
              activities to cater to all interests.
            </p>
          </Box>
          <Link to="/register" className="btn register-link">
            Register
          </Link>

          <Link to="/login" className="btn register-link">
            Login
          </Link>
        </div>
      </div>
    </Wrapper>
  );
};

export default Landing;
