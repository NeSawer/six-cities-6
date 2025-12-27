import { Link } from 'react-router-dom';
import { AppRoute } from '../../configuration/app-route';
import { useAppSelector } from '../../hooks/use-app-selector';
import { AuthorizationStatus } from '../../models/authorization-status';
import { useAppDispatch } from '../../hooks/use-app-dispatch';
import withPrevent from '../../tools/with-prevent';
import { fetchLogout, getAuthStatus, getCurrentUser } from '../../store/auth';
import { getFavoriteOffers } from '../../store/offers';

export default function Header(): JSX.Element {
  const authStatus = useAppSelector(getAuthStatus);
  const currentUser = useAppSelector(getCurrentUser);
  const favoriteOffers = useAppSelector(getFavoriteOffers);
  const dispatch = useAppDispatch();

  const isAuth = authStatus === AuthorizationStatus.Auth && currentUser;

  return (
    <header className="header">
      <div className="container">
        <div className="header__wrapper">
          <div className="header__left">
            <Link className="header__logo-link header__logo-link--active" to={AppRoute.Root}>
              <img className="header__logo" src="img/logo.svg" alt="6 cities logo" width="81" height="41" />
            </Link>
          </div>
          <nav className="header__nav">
            <ul className="header__nav-list">
              <li className="header__nav-item user">
                <Link
                  className="header__nav-link header__nav-link--profile"
                  to={isAuth ? AppRoute.Favorites : AppRoute.Login}
                >
                  <div className="header__avatar-wrapper user__avatar-wrapper">
                  </div>
                  {isAuth ?
                    <>
                      <span className="header__user-name user__name">{currentUser.email}</span>
                      <span className="header__favorite-count">{favoriteOffers?.length ?? '-'}</span>
                    </> :
                    <span className="header__login">Sign in</span>}
                </Link>
              </li>
              {isAuth &&
                <li className="header__nav-item">
                  <a className="header__nav-link" onClick={withPrevent(() => dispatch(fetchLogout()))}>
                    <span className="header__signout">Sign out</span>
                  </a>
                </li>}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
