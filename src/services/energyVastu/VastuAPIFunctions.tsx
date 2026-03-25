import axios from "axios";
import { BaseURL } from "../../constants/BaseURL";

export const getVastuCategories = async() => {
    try{
        const response = await axios.get(`${BaseURL}/energy-vastu/categories`);
        return response.data;
    }catch (error){
        console.error(" Get Vastu Categories failed:", error);
        throw error;
    }

    
}
