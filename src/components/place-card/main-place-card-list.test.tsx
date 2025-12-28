import { render, screen } from '@testing-library/react';
import { withHistory, withStore } from '../../test-utils/mock-components';
import { makeFakeOffers } from '../../test-utils/mock';
import { AuthorizationStatus } from '../../models/authorization-status';
import MainPlaceCardList from './main-place-card-list';

describe('Component: MainPlaceCardList', () => {
  const state = { auth: { authStatus: AuthorizationStatus.Unknown, currentUser: null } };

  it('should render correctly', () => {
    const cityName = 'Paris';
    const offers = makeFakeOffers();
    const { withStoreComponent } = withStore(withHistory(<MainPlaceCardList cityName={cityName} offers={offers} />), state);

    render(withStoreComponent);

    expect(screen.queryByText('Places')).toBeInTheDocument();
    expect(screen.queryByText(`${offers.length} places to stay in ${cityName}`)).toBeInTheDocument();
    expect(screen.queryByText(offers[0].title)).toBeInTheDocument();
    expect(screen.queryByText(offers[offers.length - 1].title)).toBeInTheDocument();
  });
  
  it('should render correctly when loading', () => {
    const { withStoreComponent } = withStore(withHistory(<MainPlaceCardList cityName='Paris' />), state);
    
    render(withStoreComponent);
    
    expect(screen.queryByText(/places to stay in/)).not.toBeInTheDocument();
    expect(screen.queryByTestId('loader')).toBeInTheDocument();
  });
});
