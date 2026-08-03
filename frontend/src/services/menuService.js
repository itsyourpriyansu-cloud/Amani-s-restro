import api, { mockApiDelay } from './api';
import { DISHES, CATEGORIES } from '../utils/mockData';

export const menuService = {
  // Fetch all menu dishes with optional filters
  async getMenu(category = 'all', searchQuery = '') {
    try {
      // In production with FastAPI:
      // const response = await api.get('/menu', { params: { category, search: searchQuery } });
      // return response.data;
      
      let filtered = [...DISHES];
      if (category && category !== 'all') {
        filtered = filtered.filter(item => item.category === category);
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(item => 
          item.name.toLowerCase().includes(query) ||
          (item.italianName && item.italianName.toLowerCase().includes(query)) ||
          (item.shortDescription && item.shortDescription.toLowerCase().includes(query)) ||
          (item.description && item.description.toLowerCase().includes(query))
        );
      }
      return await mockApiDelay(filtered);
    } catch (error) {
      console.error("Error fetching menu:", error);
      throw error;
    }
  },

  // Fetch category list
  async getCategories() {
    try {
      return await mockApiDelay(CATEGORIES);
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  // Fetch single dish by ID
  async getDishById(id) {
    try {
      const dish = DISHES.find(item => item.id === id);
      if (!dish) {
        throw new Error("Dish not found");
      }
      return await mockApiDelay(dish);
    } catch (error) {
      console.error(`Error fetching dish ${id}:`, error);
      throw error;
    }
  }
};
