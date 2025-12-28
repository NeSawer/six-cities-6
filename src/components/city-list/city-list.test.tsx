import { render, screen } from '@testing-library/react';
import { withHistory } from '../../test-utils/mock-components';
import CityList from './city-list';
import cities from '../../mocks/cities';

describe('Component: CityList', () => {
  it('should render correctly', () => {
    const preparedComponent = withHistory(<CityList cities={cities} selectedCityName='Paris' />);

    render(preparedComponent);

    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('Amsterdam')).toBeInTheDocument();
  });
});
