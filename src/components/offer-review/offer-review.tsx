import { ReviewModel } from '../../models/review-model';

type Props = {
  model: ReviewModel;
};

export default function OfferReview({ model }: Props): JSX.Element {
  return (
    <li className="reviews__item">
      <div className="reviews__user user">
        <div className="reviews__avatar-wrapper user__avatar-wrapper">
          <img
            className="reviews__avatar user__avatar"
            src={model.user.avatarUrl}
            width={54}
            height={54}
            alt="Reviews avatar"
          />
        </div>
        <span className="reviews__user-name">{model.user.name}</span>
        {model.user.isPro && <span className="offer__user-status">Pro</span>}
      </div>
      <div className="reviews__info">
        <div className="reviews__rating rating">
          <div className="reviews__stars rating__stars">
            <span style={{ width: `${Math.round(model.rating) * 20}%` }} />
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <p className="reviews__text">
          {model.comment}
        </p>
        <time className="reviews__time" dateTime={model.date}>
          {new Date(model.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
        </time>
      </div>
    </li>
  );
}
