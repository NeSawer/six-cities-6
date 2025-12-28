import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './private-route';
import { render, screen } from '@testing-library/react';
import { AppRoute } from '../../configuration/app-route';
import { withHistory, withStore } from '../../test-utils/mock-components';
import { AuthorizationStatus } from '../../models/authorization-status';

describe('Component: PrivateRoute', () => {
  it('should render component for public route, when user not authorized', () => {
    const expectedText = 'public route';
    const notExpectedText = 'private route';
    const { withStoreComponent } = withStore(withHistory(
      <Routes>
        <Route path={AppRoute.Login} element={<span>{expectedText}</span>} />
        <Route path={AppRoute.Offer} element={
          <PrivateRoute>
            <span>{notExpectedText}</span>
          </PrivateRoute>
        }
        />
      </Routes>,
      [AppRoute.Offer]
    ), { auth: { authStatus: AuthorizationStatus.NoAuth, currentUser: null } });

    render(withStoreComponent);

    expect(screen.queryByText(expectedText)).toBeInTheDocument();
    expect(screen.queryByText(notExpectedText)).not.toBeInTheDocument();
  });

  it('should render component for private route, when user authorized', () => {
    const expectedText = 'private route';
    const notExpectedText = 'public route';
    const { withStoreComponent } = withStore(withHistory(
      <Routes>
        <Route path={AppRoute.Login} element={<span>{notExpectedText}</span>} />
        <Route path={AppRoute.Offer} element={
          <PrivateRoute>
            <span>{expectedText}</span>
          </PrivateRoute>
        }
        />
      </Routes>,
      [AppRoute.Offer]
    ), { auth: { authStatus: AuthorizationStatus.Auth, currentUser: null } });

    render(withStoreComponent);

    expect(screen.queryByText(expectedText)).toBeInTheDocument();
    expect(screen.queryByText(notExpectedText)).not.toBeInTheDocument();
  });
});
