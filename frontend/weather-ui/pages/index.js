import Head from 'next/head';
import { useLazyQuery, gql } from '@apollo/client';
import { PageHeader, Input, notification } from 'antd';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { WeatherList } from '../src/components/WeatherList';

const { Search } = Input;

const GET_FORECAST = gql`
  query GET_FORECAST($zip: Int!) {
    forecast(zip: $zip) {
      id
      city
      country
      daily {
        id
        dt
        min
        max
        uvi
        description
        hourly {
          id
          dt
          temp
          feelsLike
          icon
          description
        }
      }
    }
  }
`;

export default function Home() {
  const [zip, setZip] = useState();
  const [getForecast, { loading, data }] = useLazyQuery(GET_FORECAST, {
    onError(error) {
      if (error) {
        notification.open({
          message: 'Could not get weather data',
          className: 'global-notification-widget',
          description: 'Please double check the zip code and try again.',
          style: {
            background: '#FFF3F8',
            borderLeftWidth: '4px',
            borderLeftStyle: 'solid',
            borderLeftColor: '#FF1675',
          },
        });
      }
    }
  });
  const days = data?.forecast?.daily || [];
  const city = data?.forecast?.city;
  const country = data?.forecast?.country;
  const pageTitleExtension = city && country ? `| ${city}, ${country}` : '';

  const onSearch = (code) => {
    if (!code || code.trim() === '') {
      notification.open({
        message: 'You must enter a zip code',
        className: 'global-notification-widget',
        description: 'The zip code field cannot be blank.',
        style: {
          background: '#FFF3F8',
          borderLeftWidth: '4px',
          borderLeftStyle: 'solid',
          borderLeftColor: '#FF1675',
        },
      });
    } else if (/\D/gi.test(code)) {
      notification.open({
        message: 'Digits only',
        className: 'global-notification-widget',
        description: 'The zip code must contain 5 digits only.',
        style: {
          background: '#FFF3F8',
          borderLeftWidth: '4px',
          borderLeftStyle: 'solid',
          borderLeftColor: '#FF1675',
        },
      });
    } else if (!/^\d{5}$/gi.test(code)) {
      notification.open({
        message: '5 digit zip code only',
        className: 'global-notification-widget',
        description: 'The zip code you entered is not 5 consecutive digits.',
        style: {
          background: '#FFF3F8',
          borderLeftWidth: '4px',
          borderLeftStyle: 'solid',
          borderLeftColor: '#FF1675',
        },
      });
    } else {
      setZip(parseInt(code));
    }
  };

  useEffect(() => {
    if (zip) {
      getForecast({
        variables: {
          zip,
        },
      });
    }
  }, [zip, getForecast]);

  return (
    <div>
      <Head>
        <title>Weather UI {pageTitleExtension}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageHeader
        data-cy="page-header"
        ghost={false}
        title={<HeaderTitle data-cy="header-title">Weather UI</HeaderTitle>}
        subTitle={<HeaderDescription data-cy="header-caption">{pageTitleExtension.trim() === '' ? 'Checkout a 5 day forecast' : pageTitleExtension}</HeaderDescription>}
      />

      <Container>
        <StyledSearch data-cy="zip-input" placeholder="Your zip code here" onSearch={onSearch} enterButton />
        <WeatherList loading={loading} days={days} />
      </Container>

    </div>
  )
}

const HeaderTitle = styled.h3`
  margin-bottom: 0;
`;

const HeaderDescription = styled.p`
  margin-bottom: 0;
`;

const StyledSearch = styled(Search)`
  width: 100%;
  margin-bottom: 20px;
`;

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  margin-top: 50px;
  padding: 0 50px;
`;
