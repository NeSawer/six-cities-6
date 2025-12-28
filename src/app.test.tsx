import { render, screen } from '@testing-library/react';
import App from './app';
import { withHistory, withStore } from './test-utils/mock-components';
import { makeFakeStore } from './test-utils/mock';
import { AppRoute } from './configuration/app-route';
import { AuthorizationStatus } from './models/authorization-status';

describe('Application Routing', () => {
  it('should render "MainPage" when user navigate to "/"', () => {
    const withHistoryComponent = withHistory(<App />, [AppRoute.Root]);
    const { withStoreComponent } = withStore(withHistoryComponent, makeFakeStore());

    render(withStoreComponent);

    expect(screen.getByText(/Cities/)).toBeInTheDocument();
  });

  it('should render "LoginPage" when user navigate to "/login"', () => {
    const withHistoryComponent = withHistory(<App />, [AppRoute.Login]);
    const { withStoreComponent } = withStore(withHistoryComponent, makeFakeStore());

    render(withStoreComponent);

    expect(screen.getByText(/E-mail/)).toBeInTheDocument();
    expect(screen.getByText(/Password/)).toBeInTheDocument();
  });

  it('should render "NotFoundScreen" when user navigate to non-existent route', () => {
    const withHistoryComponent = withHistory(<App />, ['/unknown-route']);
    const { withStoreComponent } = withStore(withHistoryComponent, makeFakeStore());

    render(withStoreComponent);

    expect(screen.getByText(/404 Not Found\(/)).toBeInTheDocument();
    expect(screen.getByText(/Back to main page/)).toBeInTheDocument();
  });

  it('should navigate to and render "LoginPage" when user navigate to favorites route without authorization', () => {
    const withHistoryComponent = withHistory(<App />, [AppRoute.Favorites]);
    const { withStoreComponent } = withStore(withHistoryComponent, makeFakeStore());

    render(withStoreComponent);

    expect(screen.getByText(/E-mail/)).toBeInTheDocument();
    expect(screen.getByText(/Password/)).toBeInTheDocument();
  });

  it('should render "FavoritePage" when user navigate to favorites route with authorization', () => {
    const withHistoryComponent = withHistory(<App />, [AppRoute.Favorites]);
    const { withStoreComponent } = withStore(withHistoryComponent, makeFakeStore({
      auth: { authStatus: AuthorizationStatus.Auth, currentUser: null }
    }));

    render(withStoreComponent);

    expect(screen.getByText(/Saved listing/)).toBeInTheDocument();
  });

  it('should navigate to and render "MainPage" when user navigate to login route with authorization', () => {
    const withHistoryComponent = withHistory(<App />, [AppRoute.Login]);
    const { withStoreComponent } = withStore(withHistoryComponent, makeFakeStore({
      auth: { authStatus: AuthorizationStatus.Auth, currentUser: null }
    }));

    render(withStoreComponent);

    expect(screen.getByText(/Cities/)).toBeInTheDocument();
  });
});
