import { render, screen } from '@testing-library/react';
import { withHistory, withStore } from '../../test-utils/mock-components';
import { makeFakeStore } from '../../test-utils/mock';
import NotFoundPage from './not-found-page';

describe('Component: NotFoundPage', () => {
  it('should render correctly', () => {
    const { withStoreComponent } = withStore(withHistory(<NotFoundPage />), makeFakeStore());

    render(withStoreComponent);

    expect(screen.queryByText('404 Not Found(')).toBeInTheDocument();
    expect(screen.queryByText('Back to main page')).toBeInTheDocument();
  });
});
