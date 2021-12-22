export const loginApi = async ({ email, password }) => {
  const response = await fetch('http://localhost:9099/account/login', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data);
  }
  return data.token;
};

export const registerApi = async ({
  username,
  email,
  password,
  confirm_password,
}) => {
  const response = await fetch('http://localhost:9099/account/register', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      username,
      email,
      password,
      confirm_password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data);
  }
  return data.token;
};

export const logoutApi = async ({ token }) => {
  const response = await fetch('http://localhost:9099/account/logout', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
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

export const detailsApi = async ({ token }) => {
  const response = await fetch('http://localhost:9099/account/details', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    method: 'GET',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data);
  }
  return data;
};

export const forgotPasswordApi = async ({ email }) => {
  const response = await fetch('http://localhost:9099/account/forgotpassword', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      email,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data);
  }
  return data.token;
};

export const resetPasswordApi = async ({
  email,
  password,
  confirm_password,
}) => {
  const response = await fetch('http://localhost:9099/account/resetpassword', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      confirm_password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data);
  }
  return data.token;
};
