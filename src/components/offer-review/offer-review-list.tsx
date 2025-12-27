import { useMemo } from 'react';
import { ReviewModel } from '../../models/review-model';
import OfferReview from './offer-review';
import { Settings } from '../../configuration/settings';

type Props = {
  models: ReviewModel[];
};

export default function OfferReviewList({ models }: Props): JSX.Element {
  const modelsToShow = useMemo(() => models
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, Settings.OFFER_REVIEW.MAX_TO_SHOW), [models]);

  return (
    <ul className="reviews__list">
      {modelsToShow.map((m) => (
        <OfferReview key={m.id} model={m} />
      ))}
    </ul>
  );
}
