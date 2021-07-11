import { List, Avatar } from 'antd';
import { format } from 'date-fns';
import styled from 'styled-components';
import codes from './../utils/weatherCodes.json';

export const HourlyWeather = ({ dt, icon, temp, id, description, displayUnit }) => {
  const avatarSrc = codes[icon] || codes['01d'];
  return (
    <List.Item>
      <List.Item.Meta
        data-cy={`list-item-${id}`}
        avatar={<Avatar alt="weather-icon" data-cy={`list-item-avatar-${id}`} src={`/${avatarSrc}`} />}
        title={
          <Text data-cy={`list-item-title-${id}`}>
            {format(new Date(dt * 1000), 'hh:mm aaa')} | {temp} °{displayUnit}
          </Text>
        }
        description={<Text data-cy={`list-item-description-${id}`}>{description}</Text>}
      />
    </List.Item>
  );
};

const Text = styled.p`
  margin-bottom: 0;
`;
