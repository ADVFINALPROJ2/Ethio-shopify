import apiClient from '../../../lib/axios';

const checkoutCart = async (userId, formData = {}) => {
  const response = await apiClient.post('/cart/checkout', {
    user_id: userId,
    phone: formData.phone,
    address: formData.address,
    notes: formData.notes
  });
  return response.data;
};

export default checkoutCart;
