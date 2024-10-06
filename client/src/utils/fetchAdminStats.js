import customFetch from "../utils/customFetch";

const fetchAdminStats = async () => {
  try {
    const response = await customFetch.get("/users/admin/app-stats");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch admin stats:", error);
    throw error; 
  }
};

export default fetchAdminStats;
