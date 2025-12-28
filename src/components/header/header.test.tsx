import { render, screen } from '@testing-library/react';
import { withHistory, withStore } from '../../test-utils/mock-components';
import { makeFakeOffers, makeFakeStore, makeFakeUser } from '../../test-utils/mock';
import Header from './header';
import { AuthorizationStatus } from '../../models/authorization-status';
import cities from '../../mocks/cities';

describe('Component: Header', () => {
  it('should render correctly when unauthorized', () => {
    const component = <Header />;
    const { withStoreComponent } = withStore(withHistory(component), makeFakeStore());

    render(withStoreComponent);

    expect(screen.queryByText('Sign in')).toBeInTheDocument();
    expect(screen.queryByText('Sign out')).not.toBeInTheDocument();
  });

  it('should render correctly when authorized without favorite offers loaded', () => {
    const store = { auth: { authStatus: AuthorizationStatus.Auth, currentUser: makeFakeUser() } };
    const component = <Header />;
    const { withStoreComponent } = withStore(withHistory(component), makeFakeStore(store));

    render(withStoreComponent);

    expect(screen.queryByText(store.auth.currentUser.email)).toBeInTheDocument();
    expect(screen.queryByText('Sign in')).not.toBeInTheDocument();
    expect(screen.queryByText('Sign out')).toBeInTheDocument();
    expect(screen.queryByText('-')).toBeInTheDocument();
  });

  it('should render correctly when authorized with favorite offers loaded', () => {
    const favoriteCount = 15;
    const store = {
      auth: { authStatus: AuthorizationStatus.Auth, currentUser: makeFakeUser() },
      offers: { selectedCity: cities[0], offers: null, favoriteOffers: makeFakeOffers(true, favoriteCount) }
    };
    const component = <Header />;
    const { withStoreComponent } = withStore(withHistory(component), makeFakeStore(store));

    render(withStoreComponent);

    expect(screen.queryByText(store.auth.currentUser.email)).toBeInTheDocument();
    expect(screen.queryByText('Sign in')).not.toBeInTheDocument();
    expect(screen.queryByText('Sign out')).toBeInTheDocument();
    expect(screen.queryByText(`${favoriteCount}`)).toBeInTheDocument();
  });
});
