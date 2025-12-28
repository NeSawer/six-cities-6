import { render, screen } from '@testing-library/react';
import { withHistory } from '../../test-utils/mock-components';
import { PlaceCardSortFormMemo } from './place-card-sort-form';
import { OfferSortOption } from '../../models/offer-sort-option';

describe('Component: PlaceCardSortForm', () => {
  it('should render correctly', () => {
    const withHistoryComponent = withHistory(<PlaceCardSortFormMemo selectedOption={OfferSortOption.Popular} />);

    render(withHistoryComponent);

    expect(screen.queryByText('Sort by')).toBeInTheDocument();
    expect(screen.queryByText('Price: low to high')).toBeInTheDocument();
    expect(screen.queryByText('Top rated first')).toBeInTheDocument();
  });
});
