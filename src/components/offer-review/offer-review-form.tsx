import { useState } from 'react';
import withPrevent from '../../tools/with-prevent';
import handleRequest from '../../tools/handle-request';
import { appApi } from '../../api/api';
import { ReviewModel } from '../../models/review-model';
import { ApiRoute } from '../../configuration/api-route';
import { Settings } from '../../configuration/settings';

type Props = {
  offerId: string;
  onPostComment: (comment: ReviewModel) => unknown;
}

const STARS = [5, 4, 3, 2, 1];
const STAR_TITLES = [
  'perfect',
  'good',
  'not bad',
  'badly',
  'terribly'
];

export default function OfferReviewForm({ offerId, onPostComment }: Props): JSX.Element {
  const [sumbitStatus, setSubmitStatus] = useState({
    isInProgress: false,
    isError: false
  });
  const [formState, setFormState] = useState({
    rating: 0,
    comment: ''
  });

  const allowed = !sumbitStatus.isInProgress
    && formState.rating
    && formState.comment.length >= Settings.OFFER_REVIEW.COMMENT_MIN_LENGTH
    && formState.comment.length <= Settings.OFFER_REVIEW.COMMENT_MAX_LENGTH;

  const postComment = () => {
    setSubmitStatus({ isInProgress: true, isError: false });
    handleRequest(
      () => appApi.post<ReviewModel>(`${ApiRoute.Comments}/${offerId}`, formState),
      (comment) => {
        onPostComment(comment);
        setFormState({ rating: 0, comment: '' });
        setSubmitStatus({ isInProgress: false, isError: false });
      },
      {},
      () => setSubmitStatus({ isInProgress: false, isError: true })
    );
  };

  return (
    <form className="reviews__form form" onSubmit={withPrevent(postComment)}>
      <label className="reviews__label form__label" htmlFor="review">
        Your review
      </label>
      <div className="reviews__rating-form form__rating">
        {STARS.map((star, index) => (
          <>
            <input
              className="form__rating-input visually-hidden"
              name="rating"
              value={star}
              id={`${star}-stars`}
              type="radio"
              disabled={sumbitStatus.isInProgress}
              onChange={(e) => setFormState((s) => ({ ...s, rating: +e.target.value }))}
              checked={formState.rating === star}
            />
            <label
              htmlFor={`${star}-stars`}
              className="reviews__rating-label form__rating-label"
              title={STAR_TITLES[index]}
            >
              <svg className="form__star-image" width={37} height={33}>
                <use xlinkHref="#icon-star" />
              </svg>
            </label>
          </>
        ))}
      </div>
      <textarea
        className="reviews__textarea form__textarea"
        id="review"
        name="review"
        placeholder="Tell how was your stay, what you like and what can be improved"
        value={formState.comment}
        disabled={sumbitStatus.isInProgress}
        onChange={(e) => setFormState((s) => ({ ...s, comment: e.target.value }))}
      />
      <div className="reviews__button-wrapper">
        <p className="reviews__help">
          To submit review please make sure to set{' '}
          <span className="reviews__star">rating</span> and describe
          your stay with at least{' '}
          <b className="reviews__text-amount">{Settings.OFFER_REVIEW.COMMENT_MIN_LENGTH} characters</b>.
        </p>
        <button
          className="reviews__submit form__submit button"
          type="submit"
          disabled={!allowed}
        >
          Submit
        </button>
      </div>
      {sumbitStatus.isError &&
        <p className="reviews__help" style={{ color: 'red' }}>
          An error occurred while submitting. Please try again later
        </p>}
    </form>
  );
}
