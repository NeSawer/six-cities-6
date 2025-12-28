import { render, screen } from '@testing-library/react';
import { withHistory, withStore } from '../../test-utils/mock-components';
import { makeFakeOffersWith, makeFakeStore } from '../../test-utils/mock';
import cities from '../../mocks/cities';
import MainPage from './main-page';

describe('Component: MainPage', () => {
  it('should render correctly', () => {
    const offers = makeFakeOffersWith({ city: cities[0] });
    const { withStoreComponent } = withStore(withHistory(<MainPage />), makeFakeStore({
      offers: { selectedCity: cities[0], offers: offers, favoriteOffers: null }
    }));

    render(withStoreComponent);

    expect(screen.queryByText('Cities')).toBeInTheDocument();
    expect(screen.queryByText(cities[0].name)).toBeInTheDocument();
    expect(screen.queryByText(offers[0].title)).toBeInTheDocument();
    expect(screen.queryByText(offers[offers.length - 1].title)).toBeInTheDocument();
  });

  it('should not render places from another cities', () => {
    const offers = [
      ...makeFakeOffersWith({ city: cities[0] }, 5),
      ...makeFakeOffersWith({ city: cities[1] }, 5)
    ];
    const { withStoreComponent } = withStore(withHistory(<MainPage />), makeFakeStore({
      offers: { selectedCity: cities[0], offers: offers, favoriteOffers: null }
    }));

    render(withStoreComponent);

    expect(screen.queryByText(offers[5].title)).not.toBeInTheDocument();
    expect(screen.queryByText(offers[offers.length - 1].title)).not.toBeInTheDocument();
  });

  it('should render correctly when empty', () => {
    const { withStoreComponent } = withStore(withHistory(<MainPage />), makeFakeStore({
      offers: { selectedCity: cities[0], offers: [], favoriteOffers: null }
    }));

    render(withStoreComponent);

    expect(screen.queryByText('No places to stay available')).toBeInTheDocument();
    expect(screen.queryByText(`We could not find any property available at the moment in ${cities[0].name}`)).toBeInTheDocument();
  });

  it('should not render places from another cities when current empty', () => {
    const offers = makeFakeOffersWith({ city: cities[1] }, 5);
    const { withStoreComponent } = withStore(withHistory(<MainPage />), makeFakeStore({
      offers: { selectedCity: cities[0], offers: offers, favoriteOffers: null }
    }));

    render(withStoreComponent);

    expect(screen.queryByText('No places to stay available')).toBeInTheDocument();
    expect(screen.queryByText(`We could not find any property available at the moment in ${cities[0].name}`)).toBeInTheDocument();
  });
});
