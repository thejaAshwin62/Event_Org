import React, { useEffect, useState } from "react";
import {
  FaSuitcaseRolling,
  FaCalendarCheck,
  FaCheckCircle,
  FaClock,
  FaBan,
} from "react-icons/fa";
import { useLoaderData, redirect } from "react-router-dom";
import customFetch from "../utils/customFetch";
import Wrapper from "../assets/wrappers/StatsContainer";
import { toast } from "react-toastify";
import { StatsItem } from "../components";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { useMediaQuery } from "@mui/material";

// Styled components for table
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#BB61FF",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

// Loader function to fetch data
export const loader = async () => {
  try {
    const response = await customFetch.get("/users/admin/app-stats");
    return response.data;
  } catch (error) {
    toast.error("You are not authorized to view this page");
    return redirect("/dashboard");
  }
};

const AdminPage = () => {
  const {
    users,
    events,
    bookedEvents: initialBookedEvents,
    bookingsData,
  } = useLoaderData();
  const [bookedEvents, setBookedEvents] = useState(initialBookedEvents);
  const isMobile = useMediaQuery("(max-width:600px)");

  // Effect to update state if loader data changes
  useEffect(() => {
    setBookedEvents(initialBookedEvents);
  }, [initialBookedEvents]);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await customFetch.patch(`/events/bookings/${bookingId}/status`, {
        status: newStatus,
      });
      // Update the state without reloading the page
      setBookedEvents((prevEvents) =>
        prevEvents.map((booking) =>
          booking.bookingId === bookingId
            ? { ...booking, isApproved: newStatus }
            : booking
        )
      );
      toast.success("Booking status updated successfully.");
    } catch (error) {
      toast.error("Failed to update booking status.");
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      await customFetch.delete(`/events/bookings/${bookingId}`);
      // Remove the deleted booking from state
      setBookedEvents((prevEvents) =>
        prevEvents.filter((booking) => booking.bookingId !== bookingId)
      );
      toast.success("Booking deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete booking.");
    }
  };

  const totalApprovedBookings = bookingsData.reduce(
    (total, item) => total + item.approvedBookings,
    0
  );
  const totalPendingBookings = bookingsData.reduce(
    (total, item) => total + item.pendingBookings,
    0
  );
  const totalCanceledBookings = bookingsData.reduce(
    (total, item) => total + item.canceledBookings,
    0
  );

  return (
    <div style={{ padding: "0 16px" }}>
      {/* Statistics Section */}
      <Wrapper>
        <StatsItem
          title="Current Users"
          count={users}
          color="#e9b949"
          bcg="#fcefc7"
          icon={<FaSuitcaseRolling />}
        />
        <StatsItem
          title="Total Events"
          count={events}
          color="#647acb"
          bcg="#e0e8f9"
          icon={<FaCalendarCheck />}
        />
        <StatsItem
          title="Approved Bookings"
          count={totalApprovedBookings}
          color="#4caf50" // Green color for approved bookings
          bcg="#e8f5e9" // Light green background
          icon={<FaCheckCircle />}
        />
        <StatsItem
          title="Pending Bookings"
          count={totalPendingBookings}
          color="#ff9800" // Orange color for pending bookings
          bcg="#fff3e0" // Light orange background
          icon={<FaClock />}
        />
        <StatsItem
          title="Canceled Bookings"
          count={totalCanceledBookings}
          color="#f44336" // Red color for canceled bookings
          bcg="#ffebee" // Light red background
          icon={<FaBan />}
        />
      </Wrapper>

      {/* Table Section */}
      <TableContainer
        component={Paper}
        sx={{
          mt: 4,
          maxWidth: isMobile ? "100%" : "unset",
          overflowX: "auto", // Allow horizontal scrolling on small screens
        }}
      >
        <Table
          sx={{
            minWidth: 500,
            fontSize: isMobile ? "12px" : "14px", // Adjust font size for mobile
          }}
          aria-label="customized table"
        >
          <TableHead>
            <TableRow>
              <StyledTableCell>User Name</StyledTableCell>
              <StyledTableCell>Event Name</StyledTableCell>
              <StyledTableCell>Payment</StyledTableCell>
              <StyledTableCell>Category</StyledTableCell>
              <StyledTableCell>Location</StyledTableCell>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell>Approve</StyledTableCell>
              <StyledTableCell>Delete</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookedEvents.map((booking) => (
              <StyledTableRow key={booking.bookingId}>
                <StyledTableCell component="th" scope="row">
                  {booking.userName}
                </StyledTableCell>
                <StyledTableCell>{booking.EventName}</StyledTableCell>
                <StyledTableCell>{booking.Payment}</StyledTableCell>
                <StyledTableCell>{booking.Category}</StyledTableCell>
                <StyledTableCell>{booking.location}</StyledTableCell>
                <StyledTableCell>
                  {new Date(booking.date).toLocaleDateString()}
                </StyledTableCell>
                <StyledTableCell>
                  <FormControl fullWidth>
                    <Select
                      value={booking.isApproved}
                      onChange={(e) =>
                        handleStatusChange(booking.bookingId, e.target.value)
                      }
                      sx={{ fontSize: isMobile ? "12px" : "14px" }}
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="approved">Approved</MenuItem>
                      <MenuItem value="rejected">Rejected</MenuItem>
                    </Select>
                  </FormControl>
                </StyledTableCell>
                <StyledTableCell>
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDeleteBooking(booking.bookingId)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AdminPage;
