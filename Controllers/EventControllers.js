import Event from "../models/EventModel.js";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors/customErrors.js";
import multer from "multer";
import cloudinary from "cloudinary";

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware to handle image upload
const uploadMiddleware = upload.single("image");

// Cloudinary configuration
cloudinary.config({
  cloud_name: "dglrrdx2u",
  api_key: "355391597932723",
  api_secret: "43ob25YR1O2ilJCLBQG5m6MlKJI",
});

export const createEvents = async (req, res) => {
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    try {
      console.log(req.user);

      const { name, Payment, Catogory, companyName, location, details, date } =
        req.body;
      req.body.createdBy = req.user.userId;

      let image = ""; // Set a default empty string for the image

      // If a file is uploaded, process it with Cloudinary
      if (req.file) {
        const cloudinaryUpload = new Promise((resolve, reject) => {
          const cloudinaryStream = cloudinary.v2.uploader.upload_stream(
            {
              folder: "ship_img",
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );

          cloudinaryStream.write(req.file.buffer);
          cloudinaryStream.end();
        });

        const cloudinaryResult = await cloudinaryUpload;
        image = cloudinaryResult.secure_url; // If an image is uploaded, set the URL
      }

      // Create event with or without image
      const events = await Event.create({
        name,
        Payment,
        Catogory,
        companyName,
        location,
        details,
        date: new Date(date),
        image, // This can be an empty string if no file was uploaded
        createdBy: req.body.createdBy,
      });

      res.status(201).json({ message: "Event created successfully", events });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
};

export const getAllEvents = async (req, res) => {
  // No user-specific filtering; return all ships
  const events = await Event.find({});
  res.status(StatusCodes.OK).json({ events });
};

export const getOneEvent = async (req, res) => {
  const { id } = req.params;
  const event = await Event.findById(id);
  if (!event) throw new NotFoundError(`No event with id: ${id}`);

  res.status(StatusCodes.OK).json({ event });
};

export const updateEvent = async (req, res) => {
  const { id } = req.params;

  // Use multer's upload middleware to handle the image upload
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: err.message });
    }

    try {
      // Find the existing event
      const existingEvent = await Event.findById(id);
      if (!existingEvent) {
        throw new NotFoundError(`No events with id: ${id}`);
      }

      // Update the request body with any new data
      const updatedEventData = { ...req.body };

      if (updatedEventData.date) {
        updatedEventData.date = new Date(updatedEventData.date);
      }

      // Check if a new image file has been uploaded
      if (req.file) {
        const cloudinaryUpload = new Promise((resolve, reject) => {
          const cloudinaryStream = cloudinary.v2.uploader.upload_stream(
            {
              folder: "ship_img", // Adjust the folder as needed
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );

          cloudinaryStream.write(req.file.buffer);
          cloudinaryStream.end();
        });

        const cloudinaryResult = await cloudinaryUpload;
        updatedEventData.image = cloudinaryResult.secure_url; // Update with the new image URL
      } else {
        updatedEventData.image = existingEvent.image; // Retain the old image if no new image is uploaded
      }

      // Update the event in the database
      const updatedEvent = await Event.findByIdAndUpdate(id, updatedEventData, {
        new: true,
        runValidators: true,
      });

      res
        .status(StatusCodes.OK)
        .json({ msg: "Event modified successfully", updatedEvent });
    } catch (error) {
      console.error(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal Server Error" });
    }
  });
};

export const deleteEvent = async (req, res) => {
  const { id } = req.params;
  const removedEvent = await Event.findByIdAndDelete(id);
  if (!removedEvent) throw new NotFoundError(`No events with id: ${id}`);

  res.status(StatusCodes.OK).json({ msg: "Event deleted" });
};
