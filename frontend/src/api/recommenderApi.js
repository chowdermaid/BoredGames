export const curPopularApi = async () => {
  const response = await fetch(
    'https://bored-games-3900.herokuapp.com/recommender/currently_popular',
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
    `https://bored-games-3900.herokuapp.com/recommender/you_might_also_like/${handle}`,
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
    `https://bored-games-3900.herokuapp.com/recommender/recommended_for_you`,
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
    `https://bored-games-3900.herokuapp.com/recommender/completed_quiz`,
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
    `https://bored-games-3900.herokuapp.com/recommender/completed_quiz`,
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
    `https://bored-games-3900.herokuapp.com/recommender/categories_for_you`,
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
    `https://bored-games-3900.herokuapp.com/recommender/mechanics_for_you`,
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
    `https://bored-games-3900.herokuapp.com/recommender/top_categories`,
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
    `https://bored-games-3900.herokuapp.com/recommender/top_mechanics`,
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
  const response = await fetch(
    `https://bored-games-3900.herokuapp.com/recommender/sale_items`,
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
