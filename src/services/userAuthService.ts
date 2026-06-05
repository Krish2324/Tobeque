const API_BASE = 'http://localhost:5000/api/user-auth';

export interface UserAuthData {
  id: number;
  phone: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  status: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  gender?: string | null;
  sizePreference?: string | null;
}

export interface OtpVerifyResponse {
  success: boolean;
  token: string;
  user: UserAuthData;
}

export const sendOtp = async (phone: string): Promise<{ success: boolean; message: string }> => {
  const res = await fetch(`${API_BASE}/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to send OTP');
  return data;
};

export const verifyOtp = async (phone: string, otp: string): Promise<OtpVerifyResponse> => {
  const res = await fetch(`${API_BASE}/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Invalid OTP');
  return data;
};

export const getUserProfile = async (token: string): Promise<UserAuthData> => {
  const res = await fetch(`${API_BASE}/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to fetch profile');
  return data.user;
};

export const getUserOrders = async (token: string) => {
  const res = await fetch(`${API_BASE}/orders`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to fetch orders');
  return data.orders;
};

export const updateUserProfile = async (
  token: string,
  updates: {
    firstName?: string;
    lastName?: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    gender?: string;
    sizePreference?: string;
  }
) => {
  const res = await fetch(`${API_BASE}/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(updates)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to update profile');
  return data.user;
};

export const createOrder = async (
  token: string,
  orderData: {
    shippingAddress: string;
    items: Array<{
      productId: number;
      price: number | string;
      quantity: number;
      variantDetails?: any;
    }>;
  }
) => {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(orderData)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to create order');
  return data;
};
