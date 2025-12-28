import { render, screen } from '@testing-library/react';
import { withHistory, withStore } from '../../test-utils/mock-components';
import { PlaceCardMemo } from './place-card';
import { makeFakeOffer, makeFakeOfferWith, makeFakeStore } from '../../test-utils/mock';

describe('Component: PlaceCard', () => {
  it('should render correctly when "city" variant', () => {
    const offer = makeFakeOffer();
    const { withStoreComponent } = withStore(withHistory(<PlaceCardMemo variant='city' model={offer} />), makeFakeStore());

    render(withStoreComponent);

    expect(screen.queryByText(offer.title)).toBeInTheDocument();
    expect(screen.queryByText(offer.type)).toBeInTheDocument();
    expect(screen.queryByText(`€${offer.price}`)).toBeInTheDocument();
  });

  it('should render correctly when "nearby" variant', () => {
    const offer = makeFakeOffer();
    const { withStoreComponent } = withStore(withHistory(<PlaceCardMemo variant='nearby' model={offer} />), makeFakeStore());

    render(withStoreComponent);

    expect(screen.queryByText(offer.title)).toBeInTheDocument();
    expect(screen.queryByText(offer.type)).toBeInTheDocument();
    expect(screen.queryByText(`€${offer.price}`)).toBeInTheDocument();
  });

  it('should render correctly when "favorite" variant', () => {
    const offer = makeFakeOffer();
    const { withStoreComponent } = withStore(withHistory(<PlaceCardMemo variant='favorite' model={offer} />), makeFakeStore());

    render(withStoreComponent);

    expect(screen.queryByText(offer.title)).toBeInTheDocument();
    expect(screen.queryByText(offer.type)).toBeInTheDocument();
    expect(screen.queryByText(`€${offer.price}`)).toBeInTheDocument();
  });

  it('should render when premium', () => {
    const offer = makeFakeOfferWith({ isPremium: true });
    const { withStoreComponent } = withStore(withHistory(<PlaceCardMemo variant='city' model={offer} />), makeFakeStore());

    render(withStoreComponent);

    expect(screen.queryByText('Premium')).toBeInTheDocument();
  });

  it('should render when not premium', () => {
    const offer = makeFakeOfferWith({ isPremium: false });
    const { withStoreComponent } = withStore(withHistory(<PlaceCardMemo variant='city' model={offer} />), makeFakeStore());

    render(withStoreComponent);

    expect(screen.queryByText('Premium')).not.toBeInTheDocument();
  });

  it('should render when rating is 0', () => {
    const offer = makeFakeOfferWith({ rating: 0 });
    const { withStoreComponent } = withStore(withHistory(<PlaceCardMemo variant='city' model={offer} />), makeFakeStore());

    render(withStoreComponent);

    expect(screen.getByTestId('rating-span')).toHaveStyle({ width: '0%' });
  });

  it('should render when rating is 3.2', () => {
    const offer = makeFakeOfferWith({ rating: 3.2 });
    const { withStoreComponent } = withStore(withHistory(<PlaceCardMemo variant='city' model={offer} />), makeFakeStore());

    render(withStoreComponent);

    expect(screen.getByTestId('rating-span')).toHaveStyle({ width: '60%' });
  });

  it('should render when rating is 4.5', () => {
    const offer = makeFakeOfferWith({ rating: 4.5 });
    const { withStoreComponent } = withStore(withHistory(<PlaceCardMemo variant='city' model={offer} />), makeFakeStore());

    render(withStoreComponent);

    expect(screen.getByTestId('rating-span')).toHaveStyle({ width: '100%' });
  });
});
