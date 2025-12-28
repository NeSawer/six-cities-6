import { vi } from 'vitest';

vi.mock('@/services/token', () => ({
  getToken: () => 'test-token',
}));

import { appApi } from '../../api/api';
import AxiosMockAdapter from 'axios-mock-adapter';
import { render, screen } from '@testing-library/react';
import { withRoute, withStore } from '../../test-utils/mock-components';
import { makeFakeOffer, makeFakeOffers, makeFakeOfferWith, makeFakeReviews, makeFakeStore } from '../../test-utils/mock';
import OfferPage from './offer-page';
import { AppRoute } from '../../configuration/app-route';
import { datatype } from 'faker';
import { ApiRoute } from '../../configuration/api-route';
import { Settings } from '../../configuration/settings';

describe('Component: OfferPage', () => {
  let mock: AxiosMockAdapter;

  beforeEach(() => {
    mock = new AxiosMockAdapter(appApi);
  });

  afterEach(() => {
    mock.restore();
  });

  it('should render correctly', async () => {
    const id = datatype.uuid();
    const offer = makeFakeOffer();
    const nearbyOffers = makeFakeOffers();
    const reviews = makeFakeReviews();
    const { withStoreComponent } = withStore(withRoute(<OfferPage />, `${AppRoute.Offer}/:id`, `${AppRoute.Offer}/${id}`), makeFakeStore());
    mock.onGet(`${ApiRoute.Offers}/${id}`).reply(200, offer);
    mock.onGet(`${ApiRoute.Offers}/${id}/${ApiRoute.Nearby}`).reply(200, nearbyOffers);
    mock.onGet(`${ApiRoute.Comments}/${id}`).reply(200, reviews);

    render(withStoreComponent);

    expect(await screen.findByText('Meet the host')).toBeInTheDocument();
    expect(await screen.findByText(offer.title)).toBeInTheDocument();
    expect(await screen.findByText(nearbyOffers[0].title)).toBeInTheDocument();
    expect(screen.queryByText(nearbyOffers[Settings.NEARBY_OFFERS_LIMIT].title)).not.toBeInTheDocument();
    expect(await screen.findByText(reviews[0].comment)).toBeInTheDocument();
  });

  it('should render correctly when 1 bedroom', async () => {
    const id = datatype.uuid();
    const offer = makeFakeOfferWith({ bedrooms: 1 });
    const nearbyOffers = makeFakeOffers();
    const reviews = makeFakeReviews();
    const { withStoreComponent } = withStore(withRoute(<OfferPage />, `${AppRoute.Offer}/:id`, `${AppRoute.Offer}/${id}`), makeFakeStore());
    mock.onGet(`${ApiRoute.Offers}/${id}`).reply(200, offer);
    mock.onGet(`${ApiRoute.Offers}/${id}/${ApiRoute.Nearby}`).reply(200, nearbyOffers);
    mock.onGet(`${ApiRoute.Comments}/${id}`).reply(200, reviews);

    render(withStoreComponent);

    expect(await screen.findByText('1 Bedroom')).toBeInTheDocument();
  });

  it('should render correctly when 5 bedrooms', async () => {
    const id = datatype.uuid();
    const offer = makeFakeOfferWith({ bedrooms: 5 });
    const nearbyOffers = makeFakeOffers();
    const reviews = makeFakeReviews();
    const { withStoreComponent } = withStore(withRoute(<OfferPage />, `${AppRoute.Offer}/:id`, `${AppRoute.Offer}/${id}`), makeFakeStore());
    mock.onGet(`${ApiRoute.Offers}/${id}`).reply(200, offer);
    mock.onGet(`${ApiRoute.Offers}/${id}/${ApiRoute.Nearby}`).reply(200, nearbyOffers);
    mock.onGet(`${ApiRoute.Comments}/${id}`).reply(200, reviews);

    render(withStoreComponent);

    expect(await screen.findByText('5 Bedrooms')).toBeInTheDocument();
  });

  it('should render correctly when max 1 adult', async () => {
    const id = datatype.uuid();
    const offer = makeFakeOfferWith({ maxAdults: 1 });
    const nearbyOffers = makeFakeOffers();
    const reviews = makeFakeReviews();
    const { withStoreComponent } = withStore(withRoute(<OfferPage />, `${AppRoute.Offer}/:id`, `${AppRoute.Offer}/${id}`), makeFakeStore());
    mock.onGet(`${ApiRoute.Offers}/${id}`).reply(200, offer);
    mock.onGet(`${ApiRoute.Offers}/${id}/${ApiRoute.Nearby}`).reply(200, nearbyOffers);
    mock.onGet(`${ApiRoute.Comments}/${id}`).reply(200, reviews);

    render(withStoreComponent);

    expect(await screen.findByText('Max 1 adult')).toBeInTheDocument();
  });

  it('should render correctly when max 3 adults', async () => {
    const id = datatype.uuid();
    const offer = makeFakeOfferWith({ maxAdults: 3 });
    const nearbyOffers = makeFakeOffers();
    const reviews = makeFakeReviews();
    const { withStoreComponent } = withStore(withRoute(<OfferPage />, `${AppRoute.Offer}/:id`, `${AppRoute.Offer}/${id}`), makeFakeStore());
    mock.onGet(`${ApiRoute.Offers}/${id}`).reply(200, offer);
    mock.onGet(`${ApiRoute.Offers}/${id}/${ApiRoute.Nearby}`).reply(200, nearbyOffers);
    mock.onGet(`${ApiRoute.Comments}/${id}`).reply(200, reviews);

    render(withStoreComponent);

    expect(await screen.findByText('Max 3 adults')).toBeInTheDocument();
  });
});
