import React from "react";
import Event from "./Event";
import Wrapper from "../assets/wrappers/JobsContainer";
import { useAllJobsContext } from "../pages/AllEvent";
import { useDashboardContext } from "../pages/DashboardLayout"; // Import useDashboardContext
import { Typography } from "@mui/material";

const EventContainer = () => {
  const { events = [] } = useAllJobsContext(); // Default to an empty array if ships is undefined
  const { showSidebar } = useDashboardContext(); // Get sidebar visibility

  return (
    <Wrapper className={showSidebar ? "centered" : ""}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ textAlign: "center", mt: -10, mb: 5 }}
      >
        Available Events
      </Typography>

      {events.length === 0 ? (
        <h2>No Events to display...</h2>
      ) : (
        <div className="jobs">
          {events.map((event) => (
            <Event key={event._id} {...event} />
          ))}
        </div>
      )}
    </Wrapper>
  );
};

export default EventContainer;
