export const getAnalyticsApi = async () => {
  const response = await fetch(
    `https://bored-games-3900.herokuapp.com/analytics/analytics`,
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

export const getOOSApi = async () => {
  const response = await fetch(
    `https://bored-games-3900.herokuapp.com/analytics/out_of_stock_items`,
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
