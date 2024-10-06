import { useState } from "react";
import { useLoaderData, Form, useNavigation, redirect } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import { FormRow, SubmitBtn } from "../components";
import Wrapper from "../assets/wrappers/DashboardFormPage";

// Loader function to fetch event data
export const loader = async ({ params }) => {
  try {
    const { data } = await customFetch.get(`/events/${params.id}`);
    return data;
  } catch (error) {
    toast.error(error.response.data.msg);
    return redirect("/dashboard");
  }
};

// Action function for submitting form data, including image
export const action = async ({ request, params }) => {
  const formData = await request.formData();

  try {
    // Send form data, including image, to the backend
    await customFetch.patch(`/events/${params.id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    toast.success("Event edited successfully");
    return redirect("/dashboard");
  } catch (error) {
    toast.error(error.response.data.msg);
    return error;
  }
};

const EditEvent = () => {
  const { event } = useLoaderData(); // Get event data

  const [image, setImage] = useState(null); // State for the image file


  // Format date for input field
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");

  const hours = String(date.getHours()).padStart(2, "0"); // Get hours and pad with 0
  const minutes = String(date.getMinutes()).padStart(2, "0"); // Get minutes and pad with 0

  return `${year}-${month}-${day} ${hours}:${minutes}`; // Format as YYYY-MM-DD HH:MM
};

const formattedDate = formatDate(event.date);
console.log(formattedDate);


  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Set selected image
    }
  };
    const handleChange = (e) => {
      const { name, value } = e.target;
      seteventData({
        ...eventData,
        [name]: value,
      });
    };

  return (
    <Wrapper>
      <Form method="post" encType="multipart/form-data" className="form">
        <h4 className="form-title">Edit Event</h4>
        <div className="form-center">
          <FormRow type="text" name="name" defaultValue={event.name} />
          <FormRow type="text" name="Payment" defaultValue={event.Payment} />
          <FormRow type="text" name="Catogory" defaultValue={event.Catogory} />
          <FormRow
            type="text"
            name="CompanyName"
            defaultValue={event.companyName}
          />
          <FormRow
            type="text"
            labelText="location"
            name="location"
            defaultValue={event.location}
          />
          <FormRow
            type="text"
            name="details"
            labelText="details"
            defaultValue={event.details}
          />

          {/* Image input field */}
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

          <FormRow
            type="datetime-local" // Updated to datetime-local for combined date and time
            name="date" // Updated to dateTime
            
            onChange={handleChange}
            defaultValue={formattedDate}
           
          />
          <SubmitBtn formBtn />
        </div>
      </Form>
    </Wrapper>
  );
};

export default EditEvent;
