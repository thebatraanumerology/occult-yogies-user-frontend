import axios from "axios";
import { BaseURL } from "../../constants/BaseURL";

export const getVastuCategories = async () => {
  try {
    const response = await axios.get(`${BaseURL}/energy-vastu/categories`);
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

    const response = await axios.post(
      `${BaseURL}/energy-vastu/create`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    // Log full Laravel validation errors
    console.error("Validation errors:", error.response?.data);
    throw error;
  }
};

export const getVastuAnalysisByID = async (id: number) => {
  try {
    const response = await axios.get(`${BaseURL}/energy-vastu/analyse/${id}`);
    return response.data;
  } catch (error) {
    console.error("Get Vastu Analysis failed:", error);
    throw error;
  }
};

export const getListData = async () => {
  try {
    const response = await axios.get(`${BaseURL}/energy-vastu/list`);
    console.log("list repornse datA:: ",response.data);
    return response.data;
  } catch (error) {
    console.error("Get List Data failed:", error);
    throw error;
  }
};

export const deleteVastuAnalysisRecordByID = async (id: number) => {
  try {
    const response = await axios.delete(`${BaseURL}/energy-vastu/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete Vastu Analysis failed:", error);
    throw error;
  }
};

