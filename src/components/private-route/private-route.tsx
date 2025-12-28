import { Navigate } from 'react-router-dom';
import { AppRoute } from '../../configuration/app-route';
import { AuthorizationStatus } from '../../models/authorization-status';
import { useAppSelector } from '../../hooks/use-app-selector';
import { getAuthStatus } from '../../store/auth/auth';

type Props = {
  children: JSX.Element;
}

export default function PrivateRoute({ children }: Props): JSX.Element {
  const authStatus = useAppSelector(getAuthStatus);

  return (
    authStatus === AuthorizationStatus.Auth
      ? children
      : <Navigate to={AppRoute.Login} />
  );
}
