import axiosInstance from '../api/axiosInstance';

const saleService = {
  createSale: async (saleData) => {
    try {
      const response = await axiosInstance.post('/sales/create', saleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Sale creation failed' };
    }
  },

  getSalesByAgent: async (agentId) => {
    try {
      const response = await axiosInstance.get(`/sales/agent/${agentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch sales for agent' };
    }
  },

  getSalesOverview: async () => {
    try {
      const response = await axiosInstance.get('/reports/sales-overview');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch sales overview' };
    }
  }
};

export default saleService;
