import { render, screen } from '@testing-library/react';
import { makeFakeReviews } from '../../test-utils/mock';
import { datatype } from 'faker';
import OfferReviewList from './offer-review-list';
import { Settings } from '../../configuration/settings';

describe('Component: OfferReviewList', () => {
  it('should render correctly', () => {
    const reviews = makeFakeReviews();
    const component = <OfferReviewList models={reviews} />;

    render(component);

    expect(screen.queryByText(reviews[0].comment)).toBeInTheDocument();
  });

  it('should render correctly with limit', () => {
    const reviews = makeFakeReviews({ date: datatype.datetime().toISOString() }, Settings.OFFER_REVIEW.MAX_TO_SHOW * 2);
    const component = <OfferReviewList models={reviews} />;

    render(component);

    expect(screen.queryByText(reviews[0].comment)).toBeInTheDocument();
    expect(screen.queryByText(reviews[Settings.OFFER_REVIEW.MAX_TO_SHOW - 1].comment)).toBeInTheDocument();
    expect(screen.queryByText(reviews[Settings.OFFER_REVIEW.MAX_TO_SHOW].comment)).not.toBeInTheDocument();
    expect(screen.queryByText(reviews[reviews.length - 1].comment)).not.toBeInTheDocument();
  });
});
