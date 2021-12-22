export const searchProductApi = async ({ name }) => {
  const response = await fetch(
    `http://localhost:9099/admin/add_product?name=${name}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: name,
      },
      method: 'GET',
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};

export const addProductApi = async ({ quantity, discount, price }) => {
  const response = await fetch('http://localhost:9099/admin/add_product', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      quantity,
      discount,
      price,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};

export const listProductsApi = async () => {
  const response = await fetch('http://localhost:9099/admin/list_products', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};

export const editProductApi = async ({
  description_preview,
  description,
  quantity,
  discount,
  price,
  id,
}) => {
  const response = await fetch(`http://localhost:9099/admin/product/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PATCH',
    body: JSON.stringify({
      description_preview,
      description,
      quantity,
      discount,
      price,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};

export const getProductApi = async ({ id }) => {
  const response = await fetch(`http://localhost:9099/admin/product/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};

export const deleteProductApi = async ({ id }) => {
  const response = await fetch(`http://localhost:9099/admin/product/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};

export const getAllOrdersAdmin = async () => {
  const response = await fetch(`http://localhost:9099/admin/orders`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data);
  }
  return data;
};

export const getUserOrderAdmin = async ({ order_number }) => {
  const response = await fetch(
    `http://localhost:9099/admin/order/${order_number}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data);
  }
  return data;
};

export const patchUserOrderAdmin = async ({ order_number, status }) => {
  const response = await fetch(
    `http://localhost:9099/admin/order/${order_number}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
      body: JSON.stringify({
        status,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data);
  }
  return data;
};

export const getCouponsApi = async () => {
  const response = await fetch(`http://localhost:9099/admin/coupon`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data);
  }
  return data;
};

export const addCouponApi = async ({ code, voucher }) => {
  const response = await fetch('http://localhost:9099/admin/coupon', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      code,
      voucher,
    }),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};

export const deleteCouponApi = async ({ code }) => {
  const response = await fetch(`http://localhost:9099/admin/coupon`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
    body: JSON.stringify({
      code,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};
