import React from 'react';
import { Typography, Card, CardContent } from '@material-ui/core';
import { Line, Bar } from 'react-chartjs-2';
import { getAnalyticsApi } from '../api/analyticsApi';
import PersonIcon from '@mui/icons-material/Person';
import ReceiptIcon from '@mui/icons-material/Receipt';
import TimelineIcon from '@mui/icons-material/Timeline';
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart';

const AdminAnalytics = () => {
  const [totalUsers, setTotalUsers] = React.useState('');
  const [totalUnitSales, setTotalUnitSales] = React.useState('');
  const [totalSales, setTotalSales] = React.useState('');
  const [averageSales, setAverageSales] = React.useState('');
  const [dailySalesDay, setDailySalesDay] = React.useState([]);
  const [dailySalesNum, setDailySalesNum] = React.useState([]);
  const [dailySalesUnitDay, setDailySalesUnitDay] = React.useState([]);
  const [dailySalesUnitNum, setDailySalesUnitNum] = React.useState([]);
  const [topGamesCollectionHandle, setTopGamesCollectionHandle] =
    React.useState([]);
  const [topGamesCollectionNum, setTopGamesCollectionNum] = React.useState([]);
  const [topGamesCartHandle, setTopGamesCartHandle] = React.useState([]);
  const [topGamesCartNum, setTopGamesCartNum] = React.useState([]);
  const [topGamesBoughtHandle, setTopGamesBoughtHandle] = React.useState([]);
  const [topGamesBoughtNum, setTopGamesBoughtNum] = React.useState([]);

  const getAnalyticsData = async () => {
    const data = await getAnalyticsApi({});
    setTotalUsers(data.number_users);
    setTotalUnitSales(data.number_sales);
    setTotalSales(data.total_sales);
    setAverageSales(data.average_sale_value);
    setDailySalesDay(data.daily_sales_value_graph.day);
    setDailySalesNum(data.daily_sales_value_graph.total_daily_sales_value);
    setDailySalesUnitDay(data.daily_sales_graph.day);
    setDailySalesUnitNum(data.daily_sales_graph.total_daily_sales);
    setTopGamesCollectionHandle(data.top_games_collection_graph.game_handles);
    setTopGamesCollectionNum(data.top_games_collection_graph.num_collections);
    setTopGamesCartHandle(data.top_games_cart_graph.game_handles);
    setTopGamesCartNum(data.top_games_cart_graph.num_carts);
    setTopGamesBoughtHandle(data.top_games_bought_graph.game_handles);
    setTopGamesBoughtNum(data.top_games_bought_graph.num_carts);
  };

  const dailySales = {
    labels: dailySalesDay,
    datasets: [
      {
        label: 'Revenue ($)',
        fill: false,
        lineTension: 0.5,
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        data: dailySalesNum,
      },
    ],
  };

  const dailySalesUnit = {
    labels: dailySalesUnitDay,
    datasets: [
      {
        label: 'Transactions (amount)',
        fill: false,
        lineTension: 0.5,
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        data: dailySalesUnitNum,
      },
    ],
  };

  const mostCollections = {
    labels: topGamesCollectionHandle,
    datasets: [
      {
        label: 'Collections (amount)',
        fill: false,
        lineTension: 0.5,
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        data: topGamesCollectionNum,
      },
    ],
  };

  const mostCarts = {
    labels: topGamesCartHandle,
    datasets: [
      {
        label: 'Carts (amount)',
        fill: false,
        lineTension: 0.5,
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        data: topGamesCartNum,
      },
    ],
  };

  const mostBought = {
    labels: topGamesBoughtHandle,
    datasets: [
      {
        label: 'Bought (amount)',
        fill: false,
        lineTension: 0.5,
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        data: topGamesBoughtNum,
      },
    ],
  };

  React.useEffect(() => {
    getAnalyticsData();
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <h1>Analytics</h1>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginTop: '1rem',
        }}
      >
        <div style={{ display: 'flex', gap: '7rem', marginBottom: '3rem' }}>
          <Card
            sx={{
              width: '200px',
              height: '130px',
              boxShadow:
                '0 10px 16px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 12%)',
              textAlign: 'center',
            }}
          >
            <Typography fontWeight="bold">Total Sales</Typography>
            <StackedLineChartIcon style={{ color: 'rgb(76, 180, 164)' }} />

            <CardContent
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Typography fontWeight="bold" variant="h5">
                {totalSales}
              </Typography>
            </CardContent>
          </Card>
          <Card
            sx={{
              width: '200px',
              height: '130px',
              boxShadow:
                '0 10px 16px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 12%)',
              textAlign: 'center',
            }}
          >
            <Typography fontWeight="bold">Average Daily Sales</Typography>
            <TimelineIcon style={{ color: 'rgb(76, 180, 164)' }} />

            <CardContent
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Typography fontWeight="bold" variant="h5">
                {averageSales}
              </Typography>
            </CardContent>
          </Card>
          <Card
            sx={{
              width: '200px',
              height: '130px',
              boxShadow:
                '0 10px 16px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 12%)',
              textAlign: 'center',
            }}
          >
            <Typography fontWeight="bold">Total Users</Typography>
            <PersonIcon style={{ color: 'rgb(76, 180, 164)' }} />
            <CardContent
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Typography fontWeight="bold" variant="h5">
                {totalUsers}
              </Typography>
            </CardContent>
          </Card>
          <Card
            sx={{
              width: '200px',
              height: '130px',
              boxShadow:
                '0 10px 16px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 12%)',
              textAlign: 'center',
            }}
          >
            <Typography fontWeight="bold">Total Transactions</Typography>
            <ReceiptIcon style={{ color: 'rgb(76, 180, 164)' }} />

            <CardContent
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Typography fontWeight="bold" variant="h5">
                {totalUnitSales}
              </Typography>
            </CardContent>
          </Card>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridGap: '3rem',
          }}
        >
          <div>
            <Line
              data={dailySales}
              options={{
                plugins: {
                  title: {
                    display: true,
                    text: 'Total Daily Revenue',
                    font: {
                      weight: 'bold',
                    },
                    color: 'black',
                  },
                },
              }}
            />
          </div>
          <div>
            <Line
              data={dailySalesUnit}
              options={{
                plugins: {
                  title: {
                    display: true,
                    text: 'Daily Number of Transactions',
                    font: {
                      weight: 'bold',
                    },
                    color: 'black',
                  },
                },
              }}
            />
          </div>
          <div>
            <Bar
              data={mostCollections}
              options={{
                indexAxis: 'y',
                plugins: {
                  title: {
                    display: true,
                    text: 'Games Appearing in Most Collections',
                    font: {
                      weight: 'bold',
                    },
                    color: 'black',
                  },
                },
              }}
            />
          </div>
          <div>
            <Bar
              data={mostCarts}
              options={{
                indexAxis: 'y',
                plugins: {
                  title: {
                    display: true,
                    text: 'Games Appearing in Most Carts',
                    font: {
                      weight: 'bold',
                    },
                    color: 'black',
                  },
                },
              }}
            />
          </div>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <Bar
            data={mostBought}
            options={{
              plugins: {
                title: {
                  display: true,
                  text: 'Most Bought Games',
                  font: {
                    weight: 'bold',
                  },
                  color: 'black',
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
