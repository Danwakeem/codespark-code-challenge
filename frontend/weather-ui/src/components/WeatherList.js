import { Collapse, List, Skeleton } from 'antd';
import { format } from 'date-fns';
import styled from 'styled-components';
import { HourlyWeather } from './HourlyWeather';
const { Panel } = Collapse;

export const WeatherList = ({ days, loading, displayUnit }) => {
  if (days.length === 0 && !loading) {
    return (
      <NoDataContainer>
        <h2 data-cy="empty-weather-list">
          Enter a zip code to get started{' '}
          <span role="img" aria-label="point up">
            👆
          </span>
        </h2>
      </NoDataContainer>
    );
  }

  return (
    <Skeleton loading={loading} title={false} paragraph={{ rows: 5 }}>
      <Collapse accordion>
        {days.map((day, index) => (
          <StyledPanel
            data-cy={`collapse-panel-${index}`}
            header={`${format(new Date(day.dt * 1000), 'MMM dd yyyy')} - ${day.uvi} UV Index - ${day.description}`}
            key={index}
          >
            <List
              itemLayout="horizontal"
              dataSource={day.hourly}
              renderItem={(item) => <HourlyWeather {...item} displayUnit={displayUnit} />}
            />
          </StyledPanel>
        ))}
      </Collapse>
    </Skeleton>
  );
};

const NoDataContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const StyledPanel = styled(Panel)`
  background-color: white;
`;
