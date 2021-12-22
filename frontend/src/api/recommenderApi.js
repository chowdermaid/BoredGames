export const curPopularApi = async () => {
  const response = await fetch(
    'http://localhost:9099/recommender/currently_popular',
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

export const relatedProductsApi = async ({ handle }) => {
  const response = await fetch(
    `http://localhost:9099/recommender/you_might_also_like/${handle}`,
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

export const recommendedForUserProductsApi = async ({ token }) => {
  const response = await fetch(
    `http://localhost:9099/recommender/recommended_for_you`,
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

export const getRecommendedGamesQuiz = async ({ token }) => {
  const response = await fetch(
    `http://localhost:9099/recommender/completed_quiz`,
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

export const completeQuiz = async ({ token, Q1, Q2, Q3, Q4, Q5 }) => {
  const response = await fetch(
    `http://localhost:9099/recommender/completed_quiz`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      method: 'POST',
      body: JSON.stringify({
        Q1,
        Q2,
        Q3,
        Q4,
        Q5,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data);
  }
  return data;
};

export const getPersonalCategoriesListApi = async ({ token }) => {
  const response = await fetch(
    `http://localhost:9099/recommender/categories_for_you`,
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

export const getPersonalMechanicsListApi = async ({ token }) => {
  const response = await fetch(
    `http://localhost:9099/recommender/mechanics_for_you`,
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

export const getPopularCategoriesListApi = async () => {
  const response = await fetch(
    `http://localhost:9099/recommender/top_categories`,
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

export const getPopularMechanicsListApi = async () => {
  const response = await fetch(
    `http://localhost:9099/recommender/top_mechanics`,
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

export const getSaleItemsApi = async () => {
  const response = await fetch(`http://localhost:9099/recommender/sale_items`, {
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
