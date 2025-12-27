import { Link } from 'react-router-dom';
import { useAppSelector } from '../../hooks/use-app-selector';
import { AppRoute } from '../../app-route';
import FavoritePlaceCardList from '../../components/place-card/favorite-place-card-list';
import Header from '../../components/header/header';

export default function FavoritesPage(): JSX.Element {
  const favoriteOffers = useAppSelector((state) => state.offers.favoriteOffers);

  const isEmpty = favoriteOffers && favoriteOffers.length === 0;

  return (
    <div className={'page' + (isEmpty ? ' page--favorites-empty' : '')}>
      <Header />
      <main className={'page__main page__main--favorites' + (isEmpty ? ' page__main--favorites-empty' : '')}>
        <div className="page__favorites-container container">
          <FavoritePlaceCardList offers={favoriteOffers} />
        </div>
      </main>
      <footer className="footer container">
        <Link className="footer__logo-link" to={AppRoute.Root}>
          <img
            className="footer__logo"
            src="img/logo.svg"
            alt="6 cities logo"
            width={64}
            height={33}
          />
        </Link>
      </footer>
    </div>
  );
}
