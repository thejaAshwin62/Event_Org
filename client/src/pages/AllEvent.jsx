import { toast } from "react-toastify";
import { EventContainer } from "../components";
import customFetch from "../utils/customFetch";
import { useLoaderData } from "react-router-dom";
import { useContext, createContext } from "react";

export const loader = async () => {
  try {
    const [eventResponse, userInfoResponse] = await Promise.all([
      customFetch.get("/events"),
      customFetch.get("/auth/me"),
    ]);

    return {
      events: eventResponse.data.events || [], 
      userInfo: userInfoResponse.data,
    };
  } catch (error) {
    toast.error(error?.response?.data?.msg || "Failed to fetch data");
    return {
      events: [],
      userInfo: { userId: null, role: null },
    };
  }
};

const AllEventContext = createContext();

const AllShips = () => {
  const { events, userInfo } = useLoaderData();

  return (
    <AllEventContext.Provider value={{ events, userInfo }}>
      <EventContainer />
    </AllEventContext.Provider>
  );
};

export const useAllJobsContext = () => useContext(AllEventContext);
export default AllShips;
