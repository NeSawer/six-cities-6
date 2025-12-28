import { render, screen } from '@testing-library/react';
import { withHistory, withStore } from '../../test-utils/mock-components';
import { makeFakeOffers, makeFakeOfferWith } from '../../test-utils/mock';
import { AuthorizationStatus } from '../../models/authorization-status';
import FavoritePlaceCardList from './favorite-place-card-list';
import cities from '../../mocks/cities';

describe('Component: FavoritePlaceCardList', () => {
  const state = { auth: { authStatus: AuthorizationStatus.Unknown, currentUser: null } };

  it('should render correctly when empty', () => {
    const { withStoreComponent } = withStore(withHistory(<FavoritePlaceCardList offers={[]} />), state);

    render(withStoreComponent);

    expect(screen.queryByText('Saved listing')).not.toBeInTheDocument();
    expect(screen.queryByText('Nothing yet saved.')).toBeInTheDocument();
    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
  });

  it('should render correctly when loading', () => {
    const { withStoreComponent } = withStore(withHistory(<FavoritePlaceCardList offers={null} />), state);

    render(withStoreComponent);

    expect(screen.queryByText('Saved listing')).toBeInTheDocument();
    expect(screen.queryByText('Nothing yet saved.')).not.toBeInTheDocument();
    expect(screen.queryByTestId('loader')).toBeInTheDocument();
  });

  it('should render correctly when loading', () => {
    const offers = makeFakeOffers();
    const { withStoreComponent } = withStore(withHistory(<FavoritePlaceCardList offers={offers} />), state);

    render(withStoreComponent);

    expect(screen.queryByText('Saved listing')).toBeInTheDocument();
    expect(screen.queryByText('Nothing yet saved.')).not.toBeInTheDocument();
    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    expect(screen.queryByText(offers[0].title)).toBeInTheDocument();
    expect(screen.queryByText(offers[offers.length - 1].title)).toBeInTheDocument();
  });

  it('should render only not empty cities', () => {
    const offerParis = makeFakeOfferWith({city: cities[0] });
    const offerBrussels = makeFakeOfferWith({city: cities[2] });
    const { withStoreComponent } = withStore(withHistory(<FavoritePlaceCardList offers={[offerParis, offerBrussels]} />), state);

    render(withStoreComponent);

    expect(screen.queryByText('Paris')).toBeInTheDocument();
    expect(screen.queryByText('Cologne')).not.toBeInTheDocument();
    expect(screen.queryByText('Brussels')).toBeInTheDocument();
    expect(screen.queryByText('Amsterdam')).not.toBeInTheDocument();
  });
});
