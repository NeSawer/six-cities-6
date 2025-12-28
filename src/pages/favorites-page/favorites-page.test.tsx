import { render, screen } from '@testing-library/react';
import { withHistory, withStore } from '../../test-utils/mock-components';
import { makeFakeOffers, makeFakeStore } from '../../test-utils/mock';
import FavoritesPage from './favorites-page';
import cities from '../../mocks/cities';

describe('Component: FavoritesPage', () => {
  it('should render correctly', () => {
    const offers = makeFakeOffers(true);
    const { withStoreComponent } = withStore(withHistory(<FavoritesPage />), makeFakeStore({
      offers: { selectedCity: cities[0], offers: null, favoriteOffers: offers }
    }));

    render(withStoreComponent);

    expect(screen.queryByText(offers[0].title)).toBeInTheDocument();
    expect(screen.queryByText(offers[offers.length - 1].title)).toBeInTheDocument();
  });

  it('should render correctly when empty', () => {
    const { withStoreComponent } = withStore(withHistory(<FavoritesPage />), makeFakeStore({
      offers: { selectedCity: cities[0], offers: null, favoriteOffers: [] }
    }));

    render(withStoreComponent);

    expect(screen.queryByText('Nothing yet saved.')).toBeInTheDocument();
  });
});
