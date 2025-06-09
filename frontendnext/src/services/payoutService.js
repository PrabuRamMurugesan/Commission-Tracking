import axiosInstance from '../api/axiosInstance';

const payoutService = {
  createPayout: async (payoutData) => {
    try {
      const response = await axiosInstance.post('/payouts/create', payoutData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Payout creation failed' };
    }
  },

  getPayoutStatus: async (payoutId) => {
    try {
      const response = await axiosInstance.get(`/payouts/status/${payoutId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch payout status' };
    }
  },

  approvePayout: async (payoutId) => {
    try {
      const response = await axiosInstance.post(`/payouts/approve/${payoutId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to approve payout' };
    }
  }
};

export default payoutService;
