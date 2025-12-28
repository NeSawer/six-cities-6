import { cleanup, render, screen } from '@testing-library/react';
import { withHistory, withStore } from '../../test-utils/mock-components';
import { makeFakeStore } from '../../test-utils/mock';
import LoginPage from './login-page';
import { AuthorizationStatus } from '../../models/authorization-status';

describe('Component: LoginPage', () => {
  it('should render correctly', () => {
    const { withStoreComponent } = withStore(withHistory(<LoginPage />), makeFakeStore({
      auth: { authStatus: AuthorizationStatus.NoAuth, currentUser: null }
    }));

    render(withStoreComponent);

    expect(screen.getByText('E-mail')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
  });

  it('should navigate out when authorized', () => {
    const { withStoreComponent } = withStore(withHistory(<LoginPage />), makeFakeStore({
      auth: { authStatus: AuthorizationStatus.Auth, currentUser: null }
    }));

    render(withStoreComponent);

    expect(screen.queryByText('E-mail')).not.toBeInTheDocument();
    expect(screen.queryByText('Password')).not.toBeInTheDocument();
  });

  it('should show random city', () => {
    const { withStoreComponent } = withStore(withHistory(<LoginPage />), makeFakeStore({
      auth: { authStatus: AuthorizationStatus.NoAuth, currentUser: null }
    }));
    render(withStoreComponent);
    const firstCity = screen.getByTestId('random-city-name').textContent;
    let secondCity = firstCity;

    for (let i = 0; i < 10 && firstCity === secondCity; i++) {
      cleanup();
      render(withStoreComponent);
      secondCity = screen.getByTestId('random-city-name').textContent;
    }

    expect(firstCity).not.toBe(secondCity);
  });
});
