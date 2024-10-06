import React, { useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { FormRow, FormRowSelect } from "../components";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import { useOutletContext, redirect } from "react-router-dom";

import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import access from "../assets/images/access1.png";

const AddEvent = () => {
  const { user } = useOutletContext();
  const [image, setImage] = useState(null);
  const [eventData, seteventData] = useState({
    name: "",
    Payment: "",
    Catogory: "",
    companyName:"",
    location: user.location,
    details:"",
    date:""
  });
  const [loading, setLoading] = useState(false); // New state for loading

  const handleChange = (e) => {
    const { name, value } = e.target;
    seteventData({
      ...eventData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when form is submitted
    const formData = new FormData();

    Object.keys(eventData).forEach((key) => {
      formData.append(key, eventData[key]);
    });

    if (image) {
      formData.append("image", image);
    }

    try {
      await customFetch.post("/events", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Event added successfully");
      redirect("all-events");
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Failed to add event");
    } finally {
      setLoading(false); // Reset loading state after submission
    }
  };

  return user.role === "user" ? (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        maxHeight: "53vh", // Full height to center vertically
      }}
    >
      <img
        src={access}
        alt="Access"
        style={{
          maxWidth: "100%",
          height: "100%",

          marginTop: "100px",
        }}
      />
    </div>
  ) : (
    <Wrapper>
      <form
        method="post"
        encType="multipart/form-data"
        className="form"
        onSubmit={handleSubmit}
      >
        <h4
          className="form-title"
          style={{ textAlign: "center", marginTop: "20px" }}
        >
          Add Event
        </h4>
        <div className="form-center">
          <FormRow
            type="text"
            name="name"
            value={eventData.name}
            onChange={handleChange}
          />
          <FormRow
            type="text"
            name="Payment"
            value={eventData.Payment}
            onChange={handleChange}
          />
          <FormRow
            type="text"
            name="Catogory"
            value={eventData.Catogory}
            onChange={handleChange}
          />{" "}
          <FormRow
            type="text"
            name="companyName"
            value={eventData.companyName}
            onChange={handleChange}
          />
          <FormRow
            type="text"
            labelText="Location"
            name="location"
            value={eventData.location}
            onChange={handleChange}
          />
          <FormRow
            type="text"
            name="details"
            value={eventData.details}
            onChange={handleChange}
          />
          <FormRow
            type="datetime-local" // Updated to datetime-local for combined date and time
            name="date" // Updated to dateTime
            value={eventData.dateTime}
            onChange={handleChange}
          />
          <div className="form-row">
            <label htmlFor="image" className="form-label">
              Select an image file (max 0.5 MB):
            </label>
            <input
              type="file"
              id="image"
              name="image"
              className="form-input"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <button
            type="submit"
            className="btn btn-block form-btn"
            disabled={loading} // Disable button while loading
          >
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <CircularProgress size={24} sx={{ mr: 1 }} />
                Submitting...
              </Box>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </form>
    </Wrapper>
  );
};

export default AddEvent;
