export const loginApi = async ({ email, password }) => {
  const response = await fetch(
    'https://bored-games-3900.herokuapp.com/account/login',
    {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
    },
  );
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
  const response = await fetch(
    'https://bored-games-3900.herokuapp.com/account/register',
    {
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
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data);
  }
  return data.token;
};

export const logoutApi = async ({ token }) => {
  const response = await fetch(
    'https://bored-games-3900.herokuapp.com/account/logout',
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

export const detailsApi = async ({ token }) => {
  const response = await fetch(
    'https://bored-games-3900.herokuapp.com/account/details',
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
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

export const forgotPasswordApi = async ({ email }) => {
  const response = await fetch(
    'https://bored-games-3900.herokuapp.com/account/forgotpassword',
    {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        email,
      }),
    },
  );

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
  const response = await fetch(
    'https://bored-games-3900.herokuapp.com/account/resetpassword',
    {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        confirm_password,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data);
  }
  return data.token;
};
