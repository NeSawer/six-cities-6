import { useState } from 'react';
import { appApi } from '../../api/api';
import useAsyncEffect from '../../hooks/use-async-effect';
import { ReviewModel } from '../../models/review-model';
import handleRequest from '../../tools/handle-request';
import OfferReviewForm from './offer-review-form';
import OfferReviewList from './offer-review-list';
import Loader from '../loader/loader';
import { useAppSelector } from '../../hooks/use-app-selector';
import { AuthorizationStatus } from '../../models/authorization-status';
import { ApiRoute } from '../../configuration/api-route';
import { getAuthStatus } from '../../store/auth';

type Props = {
  offerId: string;
}

export default function OfferReviewSection({ offerId }: Props): JSX.Element {
  const authStatus = useAppSelector(getAuthStatus);

  const [comments, setComments] = useState<ReviewModel[] | null>();

  useAsyncEffect((signal) => handleRequest(
    () => appApi.get<ReviewModel[]>(`${ApiRoute.Comments}/${offerId}`, { signal }),
    setComments,
    { [404]: () => setComments(null) }
  ), [offerId]);

  const isAuth = authStatus === AuthorizationStatus.Auth;

  return (
    <section className="offer__reviews reviews">
      <h2 className="reviews__title">
        Reviews · <span className="reviews__amount">{comments?.length}</span>
      </h2>
      {!comments
        ? <Loader />
        : <OfferReviewList models={comments} />}
      {isAuth &&
        <OfferReviewForm
          offerId={offerId}
          onPostComment={(comment) => setComments((prev) => [...prev ?? [], comment])}
        />}
    </section>
  );
}
