const rawEnvUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
const API_BASE = `${rawEnvUrl}/api/user-auth`;

const parseResponse = async (res: Response, defaultErrMsg: string) => {
  const text = await res.text();
  try {
    const data = JSON.parse(text);
    if (!res.ok || !data.success) {
      throw new Error(data.error || data.message || defaultErrMsg);
    }
    return data;
  } catch (err: any) {
    if (err.message && !err.message.includes('JSON') && !err.message.includes('SyntaxError')) {
      throw err;
    }
    throw new Error(`Connection Error (${res.status}): Server endpoint not found or unreachable.`);
  }
};

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
  shippingAddress?: string | null;
  shippingCity?: string | null;
  shippingState?: string | null;
  shippingZipCode?: string | null;
  gender?: string | null;
  profilePhoto?: string | null;
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
  return parseResponse(res, 'Failed to send OTP');
};

export const verifyOtp = async (phone: string, otp: string): Promise<OtpVerifyResponse> => {
  const res = await fetch(`${API_BASE}/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp })
  });
  return parseResponse(res, 'Invalid OTP');
};

export const getUserProfile = async (token: string): Promise<UserAuthData> => {
  const res = await fetch(`${API_BASE}/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await parseResponse(res, 'Failed to fetch profile');
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
    shippingAddress?: string;
    shippingCity?: string;
    shippingState?: string;
    shippingZipCode?: string;
    gender?: string;
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

export const uploadProfilePhoto = async (token: string, file: File): Promise<UserAuthData> => {
  const formData = new FormData();
  formData.append('photo', file);

  const res = await fetch(`${API_BASE}/profile/photo`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to upload photo');
  return data.user;
};

export const createOrder = async (
  token: string,
  orderData: {
    shippingAddress: any;
    customerName?: string;
    customerPhone?: string;
    items: Array<{
      productId: string | number;
      price: number | string;
      quantity: number;
      variantDetails?: any;
    }>;
    couponCode?: string;
    paymentMethod?: string;
    billingAddress?: any;
    notes?: string;
    shippingCost?: number;
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

export const validateCouponAPI = async (code: string, cartTotal?: number) => {
  const res = await fetch(`${API_BASE}/validate-coupon`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code, cartTotal })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Invalid coupon code');
  return data.coupon;
};

export const getRazorpayConfig = async () => {
  const res = await fetch(`${API_BASE}/razorpay/config`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to fetch Razorpay config');
  return data.key;
};

export const createRazorpayOrder = async (
  token: string,
  orderData: {
    items: Array<{ productId: string | number; price: number | string; quantity: number; variantDetails?: any }>;
    couponCode?: string;
    shippingCost?: number;
  }
) => {
  const res = await fetch(`${API_BASE}/razorpay/create-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(orderData)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to initialize payment');
  return data;
};

export const verifyRazorpayPayment = async (
  token: string,
  verifyData: any
) => {
  const res = await fetch(`${API_BASE}/razorpay/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(verifyData)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Payment verification failed');
  return data;
};
