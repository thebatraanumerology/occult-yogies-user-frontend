import axiosInstance from "../axiosInstance"; // Ensure this path correctly points to your axiosInstance.ts

/**
 * NOTE: We removed 'const token = Cookies.get("oy_token")' from the top level.
 * The axiosInstance interceptor now handles token injection dynamically.
 */

export const getVastuCategories = async () => {
  try {
    // We use axiosInstance and a relative path because baseURL is already set in the instance
    const response = await axiosInstance.get(`/energy-vastu/categories`);
    return response.data;
  } catch (error) {
    console.error(" Get Vastu Categories failed:", error);
    throw error;
  }
};

export const postVastuAnalysis = async (data: any) => {
  try {
    const formData = new FormData();
    formData.append("full_name", data.fullName);
    formData.append("gender", data.gender.toLowerCase());
    formData.append("mobile_number", data.mobileNumber);
    formData.append("address", data.address || "");
    formData.append("category", data.category);

    if (data.dateOfPurchase) {
      let formatted = "";

      if (data.dateOfPurchase.includes("-")) {
        const [year, month, day] = data.dateOfPurchase.split("-");
        formatted = `${day}-${month}-${year}`;
      } else if (data.dateOfPurchase.includes("/")) {
        const parts = data.dateOfPurchase.split("/");
        formatted = `${parts[1]}-${parts[0]}-${parts[2]}`;
      }

      if (formatted) {
        formData.append("dateOfPurchase", formatted);
      }
    }

    if (data.map instanceof File) {
      formData.append("map_image", data.map);
    }

    // Interceptor handles the token; we only need to specify the content-type here
    const response = await axiosInstance.post(
      `/energy-vastu/create`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Validation errors:", error.response?.data);
    throw error;
  }
};

export const getVastuAnalysisByID = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/energy-vastu/analyse/${id}`);
    return response.data;
  } catch (error) {
    console.error("Get Vastu Analysis failed:", error);
    throw error;
  }
};

export const getListData = async (page = 1) => {
  try {
    const response = await axiosInstance.get(`/energy-vastu/list?page=${page}`);
    console.log("list response data: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Get List Data failed:", error);
    throw error;
  }
};

export const deleteVastuAnalysisRecordByID = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/energy-vastu/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete Vastu Analysis failed:", error);
    throw error;
  }
};