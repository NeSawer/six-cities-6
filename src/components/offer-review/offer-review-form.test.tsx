import { render, screen } from '@testing-library/react';
import { withHistory } from '../../test-utils/mock-components';
import OfferReviewForm from './offer-review-form';
import { datatype } from 'faker';

describe('Component: OfferReviewForm', () => {
  it('should render correctly', () => {
    const withHistoryComponent = withHistory(<OfferReviewForm offerId={datatype.uuid()} />);

    render(withHistoryComponent);

    expect(screen.queryByText('Your review')).toBeInTheDocument();
    expect(screen.queryByText(/To submit review please make sure to set/)).toBeInTheDocument();
    expect(screen.queryByText('An error occurred while submitting. Please try again later')).not.toBeInTheDocument();
  });
});
