import { render, screen } from '@testing-library/react';
import OfferReview from './offer-review';
import { makeFakeReview } from '../../test-utils/mock';
import { internet } from 'faker';

describe('Component: OfferReview', () => {
  it('should render correctly', () => {
    const review = makeFakeReview();
    const component = <OfferReview model={review} />;

    render(component);

    expect(screen.queryByText(review.user.name)).toBeInTheDocument();
    expect(screen.queryByText(review.comment)).toBeInTheDocument();
  });

  it('should render correctly when pro', () => {
    const review = makeFakeReview({ user: { avatarUrl: internet.url(), name: internet.userName(), isPro: true } });
    const component = <OfferReview model={review} />;

    render(component);

    expect(screen.queryByText('Pro')).toBeInTheDocument();
  });

  it('should render correctly when not pro', () => {
    const review = makeFakeReview({ user: { avatarUrl: internet.url(), name: internet.userName(), isPro: false } });
    const component = <OfferReview model={review} />;

    render(component);

    expect(screen.queryByText('Pro')).not.toBeInTheDocument();
  });
});
