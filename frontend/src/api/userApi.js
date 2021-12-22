export const editProductCartApi = async ({ quantity, handle, token }) => {
  const response = await fetch(`http://localhost:9099/user/cart/${handle}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PATCH',
    body: JSON.stringify({
      token,
      quantity,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data);
  }
  return data;
};

export const addProductCartApi = async ({ quantity, handle, token }) => {
  const response = await fetch(`http://localhost:9099/user/cart/${handle}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      token,
      quantity,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data);
  }
  return data;
};

export const deleteProductCartApi = async ({ handle, token }) => {
  const response = await fetch(`http://localhost:9099/user/cart/${handle}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
    body: JSON.stringify({
      token,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data);
  }
  return data;
};

export const getCartApi = async ({ token }) => {
  const response = await fetch(`http://localhost:9099/user/cart_list`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    method: 'GET',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data);
  }
  return data;
};

export const deleteProductCollectionApi = async ({ handle, token }) => {
  const response = await fetch(
    `http://localhost:9099/user/my_collection/${handle}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
      body: JSON.stringify({
        token,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data);
  }
  return data;
};

export const addProductCollectionApi = async ({ handle, token }) => {
  const response = await fetch(
    `http://localhost:9099/user/my_collection/${handle}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        token,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data);
  }
  return data;
};

export const getCollectionApi = async ({ token }) => {
  const response = await fetch(
    `http://localhost:9099/user/my_collection_list`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
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

export const filterSearchApi = async ({
  search,
  min_price,
  max_price,
  min_year,
  max_year,
  min_players,
  max_players,
  min_playtime,
  max_playtime,
  min_age,
  mechanics,
  categories,
  curve_start,
  curve_end,
  depth_start,
  depth_end,
}) => {
  const response = await fetch(`http://localhost:9099/user/filter_search`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      search,
      min_price,
      max_price,
      min_year,
      max_year,
      min_players,
      max_players,
      min_playtime,
      max_playtime,
      min_age,
      mechanics,
      categories,
      curve_start,
      curve_end,
      depth_start,
      depth_end,
    }),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data);
  }
  return data;
};

export const collectTagsApi = async ({
  search,
  min_price,
  max_price,
  min_year,
  max_year,
  min_players,
  max_players,
  min_playtime,
  max_playtime,
  min_age,
  mechanics,
  categories,
  curve_start,
  curve_end,
  depth_start,
  depth_end,
}) => {
  const response = await fetch(
    `http://localhost:9099/user/collect_user_selected_tags`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        search,
        min_price,
        max_price,
        min_year,
        max_year,
        min_players,
        max_players,
        min_playtime,
        max_playtime,
        min_age,
        mechanics,
        categories,
        curve_start,
        curve_end,
        depth_start,
        depth_end,
      }),
    },
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data);
  }
  return data;
};

export const confirmTransactionApi = async ({
  token,
  card_name,
  card_number,
  card_expiry,
  card_cvc,
  shipping_name,
  shipping_address,
  shipping_post_code,
  shipping_city,
  shipping_state,
  contact_number,
  shipping_method,
  gifting,
  gifting_email,
  gifting_name,
  gifting_message,
  add_to_collection,
}) => {
  const response = await fetch(`http://localhost:9099/user/order_place`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      token,
      card_name,
      card_number,
      card_expiry,
      card_cvc,
      shipping_name,
      shipping_address,
      shipping_post_code,
      shipping_city,
      shipping_state,
      contact_number,
      shipping_method,
      gifting,
      gifting_email,
      gifting_name,
      gifting_message,
      add_to_collection,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data);
  }
  return data;
};

export const cartApplyCouponApi = async ({ token, coupon_code }) => {
  const response = await fetch(`http://localhost:9099/user/cart_apply_coupon`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      token,
      coupon_code,
    }),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data);
  }
  return data;
};

export const getAllUserOrders = async ({ token }) => {
  const response = await fetch(`http://localhost:9099/user/orders`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    method: 'GET',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data);
  }
  return data;
};

export const getUserOrder = async ({ token, order_number }) => {
  const response = await fetch(
    `http://localhost:9099/user/order/${order_number}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
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
