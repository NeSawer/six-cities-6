import { Link } from 'react-router-dom';
import { AppRoute } from '../../configuration/app-route';
import Header from '../../components/header/header';

export default function NotFoundPage(): JSX.Element {
  return (
    <div className="page page--gray page--main">
      <Header />
      <main className="page__main page__main--index">
        <h1>404 Not Found{'('}</h1>
        <Link to={AppRoute.Root}>Back to main page</Link>
      </main>
    </div>
  );
}
