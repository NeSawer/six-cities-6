import { Link, Navigate } from 'react-router-dom';
import { AppRoute } from '../../app-route';
import { useAppSelector } from '../../hooks/use-app-selector';
import { AuthorizationStatus } from '../../models/authorization-status';
import { useState } from 'react';
import { useAppDispatch } from '../../hooks/use-app-dispatch';
import withPrevent from '../../tools/with-prevent';
import { fetchRegistration } from '../../store/namespaces/auth';

export default function LoginPage(): JSX.Element {
  const authStatus = useAppSelector((state) => state.auth.authStatus);
  const dispatch = useAppDispatch();

  const [formState, setFormState] = useState({
    email: '',
    password: ''
  });

  if (authStatus === AuthorizationStatus.Auth) {
    return <Navigate to={AppRoute.Root} />;
  }

  const allowed = formState.email
    && formState.password
    && formState.password.indexOf(' ') < 0;

  return (
    <div className="page page--gray page--login">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <Link className="header__logo-link" to={AppRoute.Root}>
                <img className="header__logo" src="img/logo.svg" alt="6 cities logo" width="81" height="41" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="page__main page__main--login">
        <div className="page__login-container container">
          <section className="login">
            <h1 className="login__title">Sign in</h1>
            <form className="login__form form" onSubmit={withPrevent(() => dispatch(fetchRegistration(formState)))}>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">E-mail</label>
                <input
                  className="login__input form__input"
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formState.email}
                  onChange={(e) => setFormState((s) => ({ ...s, email: e.target.value }))}
                  required
                />
              </div>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">Password</label>
                <input
                  className="login__input form__input"
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formState.password}
                  onChange={(e) => setFormState((s) => ({ ...s, password: e.target.value }))}
                  required
                />
              </div>
              <button
                className="login__submit form__submit button"
                type="submit"
                disabled={!allowed}
              >
                Sign in
              </button>
            </form>
          </section>
          <section className="locations locations--login locations--current">
            <div className="locations__item">
              <a className="locations__item-link" href="#">
                <span>Amsterdam</span>
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
