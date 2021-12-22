export const getAnalyticsApi = async () => {
  const response = await fetch(`http://localhost:9099/analytics/analytics`, {
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

export const getOOSApi = async () => {
  const response = await fetch(
    `http://localhost:9099/analytics/out_of_stock_items`,
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
