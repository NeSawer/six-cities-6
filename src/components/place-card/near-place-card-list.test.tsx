import { render, screen } from '@testing-library/react';
import { withHistory, withStore } from '../../test-utils/mock-components';
import NearPlaceCardList from './near-place-card-list';
import { makeFakeOffers } from '../../test-utils/mock';
import { AuthorizationStatus } from '../../models/authorization-status';

describe('Component: NearPlaceCardList', () => {
  const state = { auth: { authStatus: AuthorizationStatus.Unknown, currentUser: null } };
  it('should render correctly', () => {
    const offers = makeFakeOffers();
    const { withStoreComponent } = withStore(withHistory(<NearPlaceCardList placeCards={offers} />), state);

    render(withStoreComponent);

    expect(screen.queryByText('Other places in the neighbourhood')).toBeInTheDocument();
    expect(screen.queryByText(offers[0].title)).toBeInTheDocument();
    expect(screen.queryByText(offers[offers.length - 1].title)).toBeInTheDocument();
  });
});
