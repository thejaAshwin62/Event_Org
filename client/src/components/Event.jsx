import * as React from "react";
import { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { useAllJobsContext } from "../pages/AllEvent";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";

const Event = ({
  _id,
  name,
  Payment,
  Catogory,
  location,
  details,
  companyName,
  date,
  image,
  isApproved,
}) => {
  const { userInfo } = useAllJobsContext();
  const { userId, role } = userInfo;

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await customFetch.post(`/events/${_id}/book/${userId}`);
      toast.success(
        "Booking request submitted successfully. Awaiting approval."
      );
    } catch (error) {
      toast.error("Failed to submit booking request");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await customFetch.delete(`/events/${_id}`);
      toast.success("Event deleted successfully.");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to delete Event.");
    }
  };

  const statusStyles = {
    pending: { background: "#fef3c7", color: "#f59e0b" },
    available: { background: "#e0e8f9", color: "#647acb" },
    booked: { background: "#ffeeee", color: "#d66a6a" },
  };

  const currentStatusStyle =
    isApproved === "pending"
      ? statusStyles.pending
      : isApproved === "approved"
      ? statusStyles.booked
      : statusStyles.available;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0"); // Get minutes and pad with 0
  const ampm = hours >= 12 ? "PM" : "AM"; // Determine AM or PM

  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? String(hours).padStart(2, "0") : "12"; // the hour '0' should be '12'

  return `${day}-${month}-${year} ,  ${hours}:${minutes} ${ampm}`; // Format as YYYY-MM-DD HH:MM AM/PM
};
  return (
    <Card
      sx={{
        width: 420,
        maxWidth: 550, // Increased width here
        borderRadius: 5,
        marginBottom: 8,
        boxShadow: 8,
        marginLeft: 0,
      }}
    >
      <CardMedia
        sx={{ height: 280 }}
        image={image}
        title={name || "Event Image"}
      />

      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            columnGap: "30px",
            width: "auto",
          }}
        >
          <Typography >
            <span
              style={{
                fontWeight: "bold",
                fontSize: "20px",
                borderRadius: "9999px",
                backgroundColor: "rgba(34, 197, 94, 0.1)", // Green background with 10% opacity
                padding: "0.15rem 1rem",
                color: "#047857", // Darker green text color
              }}
            >
              {Payment || "N/A"}₹
            </span>
          </Typography>
          <Typography
            sx={{ color: "#121212 ", fontWeight: "bold", width: "100%",textAlign:"center" }}
          >
            {name || "Event Name"}
          </Typography>
          <Typography sx={{ fontSize: "13px", marginLeft: "0.5rem" }}>
            {Catogory}
          </Typography>
        </Box>

        <Box
          sx={{
            margin: "1rem ",
            display: "flex",
            columnGap: "10px",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ color: "#666666  " }}>
            {date ? formatDate(date) : "N/A"}
          </Typography>
          {"-"}
          <Typography sx={{ color: "#666666" }}>{location}</Typography>
        </Box>

        <Box sx={{ margin: "0 1rem" }}>
          <Typography
            sx={{
              color: "#000000",
              fontWeight: "bold",
              fontSize: "15px",
              textAlign: "center",
            }}
          >
            {details}
          </Typography>
        </Box>
        <Box sx={{ margin: "1rem 1rem", textAlign: "center" }}>
          <Typography>{companyName}</Typography>
        </Box>
      </CardContent>
      <CardActions
        sx={{
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
          marginTop: "-2rem",
        }}
      >
        {role === "admin" ? (
          <>
            <Button
              component={Link}
              to={`/dashboard/edit-event/${_id}`}
              size="small"
              sx={{
                color: "white",
                background: "#BB61FF",
                "&:hover": { background: "#a855f7" },
              }}
            >
              Edit
            </Button>
            <Button
              onClick={handleDelete}
              size="small"
              sx={{
                color: "white",
                background: "#BB61FF",
                "&:hover": { background: "#a855f7" },
              }}
            >
              Delete
            </Button>
          </>
        ) : isApproved === "pending" ? (
          <Typography
            variant="body2"
            sx={{ color: "#f59e0b", fontSize: "1.2rem", textAlign: "center" }}
          >
            Booking request is pending for approval
          </Typography>
        ) : isApproved === "approved" ? (
          <Typography
            variant="body2"
            sx={{ color: "#d66a6a", fontSize: "1.2rem", textAlign: "center" }}
          >
            Event is booked
          </Typography>
        ) : (
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Button
              type="submit"
              size="small"
              sx={{
                color: "white",
                display: "block",
                margin: "0 auto",
                background: "#BB61FF",
                "&:hover": { background: "#a855f7" },
                position: "relative",
              }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress
                  size={24}
                  sx={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    marginLeft: "-12px",
                    marginTop: "-12px",
                  }}
                />
              ) : (
                "Book"
              )}
            </Button>
          </form>
        )}
      </CardActions>
    </Card>
  );
};

export default Event;
