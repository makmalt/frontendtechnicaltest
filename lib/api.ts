import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

export async function getMenuTree() {
  try {
    const response = await axios.get(`${baseUrl}/api/menus`);
    return response.data;
  } catch (error) {
    console.error("Error fetching menu tree:", error);
    throw error;
  }
}

export async function updateMenu(id: string, data: any) {
  try {
    const response = await axios.put(`${baseUrl}/api/menus/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating menu with id ${id}:`, error);
    throw error;
  }
}

export async function createMenu(data: any) {
  try {
    const response = await axios.post(`${baseUrl}/api/menus`, data);
    console.log("Menu created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating menu:", error);
    throw error;
  }
}

export async function deleteMenu(id: string) {
  try {
    const response = await axios.delete(`${baseUrl}/api/menus/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting menu with id ${id}:`, error);
    throw error;
  }
}