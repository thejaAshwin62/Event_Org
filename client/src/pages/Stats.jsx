import React, { useEffect, useState } from "react";
import Wrapper from "../assets/wrappers/StatItem";
import customFetch from "../utils/customFetch";
import fetchAdminStats from "../utils/fetchAdminStats";
import { toast } from "react-toastify";
import { useLoaderData, redirect, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import AdminStats from "../components/AdminStats";
import styled from "styled-components";
import empty from "../assets/images/empty.svg";

const ImageContainer = styled(Box)`
  flex-basis: 100%; // Occupy full width on mobile
  height: auto; // Adjust height to auto
  position: relative; // To allow for positioning of CardMedia
  overflow: hidden; // Prevent overflow of images

  @media (min-width: 600px) {
    flex-basis: 40%; // Occupy 40% of the card width on larger screens
  }
`;

const CardMediaStyled = styled(CardMedia)`
  height: 100%; // Make image take full height of container
  width: 100%; // Make image take full width of container
  object-fit: cover; // Ensure image fits well and covers the area
`;

const CardStyled = styled(Card)`
  display: flex; // Use flex layout
  align-items: stretch; // Ensure both sections stretch to full height
  width: 100%; // Make it responsive
  height: auto; // Allow height to adjust automatically

  @media (max-width: 600px) {
    flex-direction: column; // Stack on smaller screens
    margin: 10px 0; // Adjust margin for mobile
  }
`;

const ContentContainer = styled(Box)`
  flex-basis: 100%; // Occupy full width on mobile
  padding: 16px; // Add padding to the content
  display: flex;
  flex-direction: column;
  justify-content: center; // Center the content vertically

  @media (min-width: 600px) {
    flex-basis: 60%; // Occupy 60% of the card width on larger screens
    padding: 16px; // Keep padding consistent on larger screens
  }
`;

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px; /* Adjust height as needed */
  text-align: center;

  img {
    width: 150px; /* Adjust width as needed */
    margin-bottom: 20px;
  }

  button {
    margin-top: 20px;
  }
`;

export const loader = async () => {
  try {
    const [userResponse, eventsResponse] = await Promise.all([
      customFetch.get("/auth/me"),
      customFetch.get("/events"),
    ]);
    return {
      userInfo: userResponse.data,
      events: eventsResponse.data.events || [],
    };
  } catch (error) {
    return redirect("/dashboard");
  }
};

// Ships component
const Stats = () => {
  const { userInfo } = useLoaderData();
  const [adminStats, setAdminStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch admin stats if the user is an admin
        if (userInfo.role === "admin") {
          const adminStatsData = await fetchAdminStats();
          setAdminStats(adminStatsData);
        }

        // Fetch user bookings
        const userId = userInfo.userId;
        const response = await customFetch.get(
          `/users/booked-details/${userId}`
        );
        setBookings(response.data.bookings);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userInfo]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      hour12: true,
    };
    return date.toLocaleString("en-US", options);
  };

  return (
    <Wrapper style={{ marginBottom: "100px" }}>
      <div className="content">
        {userInfo.role === "admin" && adminStats ? (
          <div>
            <AdminStats adminStats={adminStats} />
            <div style={{ marginTop: "40px" }}></div>
          </div>
        ) : (
          <div>
            <Typography
              variant="h4"
              component="h4"
              sx={{
                textAlign: "center",
                marginBottom: "30px",
                fontSize: { xs: "1.5rem", sm: "2rem" }, // Responsive font sizes
              }}
            >
              Booking Details
            </Typography>

            <div className="content-center">
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <Box
                    key={booking._id}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "flex-start",
                      position: "relative",
                      padding: 2,
                      marginBottom: 4,
                    }}
                  >
                    <CardStyled
                      sx={{
                        boxShadow: 6,
                        position: "relative",
                      }}
                    >
                      <ImageContainer>
                        <CardMediaStyled
                          component="img"
                          image={booking.image}
                          alt={booking.eventName || "Ship Image"}
                        />
                      </ImageContainer>

                      <ContentContainer>
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              columnGap: "30px",
                              flexDirection: "column",
                              textAlign: "center",
                            }}
                          >
                            <Typography
                              sx={{
                                fontWeight: "bold",
                                fontSize: { xs: "1rem", sm: "1.25rem" }, // Responsive font sizes
                                borderRadius: "9999px",
                                backgroundColor: "rgba(34, 197, 94, 0.1)",
                                padding: "0.15rem 1rem",
                                color: "#047857",
                              }}
                            >
                              {booking.Payment || "N/A"} ₹
                            </Typography>
                            <Typography
                              sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                            >
                              {booking.Catogory || "N/A"}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              margin: "1rem 0",
                              width: "100%",
                              textAlign: "center",
                              color: "#121212",
                            }}
                          >
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="div"
                              sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }} // Responsive font sizes
                            >
                              {booking.eventName}
                            </Typography>
                          </Box>

                          <Typography
                            sx={{
                              margin: "1rem 0",
                              fontSize: { xs: "0.875rem", sm: "1rem" }, // Responsive font sizes
                              color: "#666666",
                              textAlign: "center",
                            }}
                          >
                            {booking.location || "N/A"}
                            <br />
                            {booking.date ? formatDate(booking.date) : "N/A"}
                          </Typography>

                          <Typography
                            sx={{
                              color: "#000000",
                              fontWeight: "bold",
                              fontSize: { xs: "1.25rem", sm: "1.5rem" }, // Responsive font sizes
                              textAlign: "center",
                            }}
                          >
                            {booking.details || "N/A"}
                          </Typography>
                          <Typography
                            sx={{ margin: "1rem 0", textAlign: "center" }}
                          >
                            {booking.companyName || "N/A"}
                          </Typography>

                          <Typography sx={{ textAlign: "center" }}>
                            <span
                              style={{
                                color: booking.isApproved
                                  ? "#4caf50"
                                  : "#d66a6a",
                              }}
                            >
                              {booking.isApproved ? "Approved" : "Not Approved"}
                            </span>
                          </Typography>
                        </CardContent>
                      </ContentContainer>
                    </CardStyled>
                  </Box>
                ))
              ) : (
                <EmptyStateContainer>
                  <img src={empty} alt="No bookings" />
                  <Typography
                    variant="h5"
                    sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
                  >
                    No Bookings Found
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/dashboard")}
                    sx={{ marginTop: "10px" }}
                  >
                    Go Back
                  </Button>
                </EmptyStateContainer>
              )}
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default Stats;
