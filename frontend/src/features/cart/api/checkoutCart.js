import apiClient from '../../../lib/axios';

const checkoutCart = async (_userId, formData = {}) => {
  const response = await apiClient.post('/cart/checkout', {
    phone: formData.phone,
    address: formData.address,
    notes: formData.notes
  });
  return response.data;
};

export default checkoutCart;
