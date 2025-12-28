import { render, screen } from '@testing-library/react';
import Loader from './loader';

describe('Component: Loader', () => {
  it('should render correctly', () => {
    render(<Loader />);

    expect(screen.queryByTestId('loader-box')).toBeInTheDocument();
  });

  it('should render with custom size', () => {
    const size = 50;

    render(<Loader size={size} />);

    expect(screen.getByTestId('loader')).toHaveStyle({
      width: `${size}px`,
      height: `${size}px`
    });
  });
});
