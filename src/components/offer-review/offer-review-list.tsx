import { useMemo } from 'react';
import { ReviewModel } from '../../models/review-model';
import OfferReview from './offer-review';

type Props = {
  models: ReviewModel[];
};

export default function OfferReviewList({ models }: Props): JSX.Element {
  const modelsToShow = useMemo(() => models.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10), [models]);

  return (
    <ul className="reviews__list">
      {modelsToShow.map((m) => (
        <OfferReview key={m.id} model={m} />
      ))}
    </ul>
  );
}
