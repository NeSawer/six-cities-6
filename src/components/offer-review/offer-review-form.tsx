import { useState } from 'react';
import withPrevent from '../../tools/with-prevent';
import handleRequest from '../../tools/handle-request';
import { appApi } from '../../api/api';
import { ReviewModel } from '../../models/review-model';

type Props = {
  offerId: string;
  onPostComment: (comment: ReviewModel) => unknown;
}

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
    && formState.comment.length >= 50
    && formState.comment.length <= 300;

  const postComment = () => {
    setSubmitStatus({ isInProgress: true, isError: false });
    handleRequest(
      () => appApi.post<ReviewModel>(`comments/${offerId}`, formState),
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
        <input
          className="form__rating-input visually-hidden"
          name="rating"
          value={5}
          id="5-stars"
          type="radio"
          disabled={sumbitStatus.isInProgress}
          onChange={(e) => setFormState((s) => ({ ...s, rating: +e.target.value }))}
          checked={formState.rating === 5}
        />
        <label
          htmlFor="5-stars"
          className="reviews__rating-label form__rating-label"
          title="perfect"
        >
          <svg className="form__star-image" width={37} height={33}>
            <use xlinkHref="#icon-star" />
          </svg>
        </label>
        <input
          className="form__rating-input visually-hidden"
          name="rating"
          value={4}
          id="4-stars"
          type="radio"
          disabled={sumbitStatus.isInProgress}
          onChange={(e) => setFormState((s) => ({ ...s, rating: +e.target.value }))}
          checked={formState.rating === 4}
        />
        <label
          htmlFor="4-stars"
          className="reviews__rating-label form__rating-label"
          title="good"
        >
          <svg className="form__star-image" width={37} height={33}>
            <use xlinkHref="#icon-star" />
          </svg>
        </label>
        <input
          className="form__rating-input visually-hidden"
          name="rating"
          value={3}
          id="3-stars"
          type="radio"
          disabled={sumbitStatus.isInProgress}
          onChange={(e) => setFormState((s) => ({ ...s, rating: +e.target.value }))}
          checked={formState.rating === 3}
        />
        <label
          htmlFor="3-stars"
          className="reviews__rating-label form__rating-label"
          title="not bad"
        >
          <svg className="form__star-image" width={37} height={33}>
            <use xlinkHref="#icon-star" />
          </svg>
        </label>
        <input
          className="form__rating-input visually-hidden"
          name="rating"
          value={2}
          id="2-stars"
          type="radio"
          disabled={sumbitStatus.isInProgress}
          onChange={(e) => setFormState((s) => ({ ...s, rating: +e.target.value }))}
          checked={formState.rating === 2}
        />
        <label
          htmlFor="2-stars"
          className="reviews__rating-label form__rating-label"
          title="badly"
        >
          <svg className="form__star-image" width={37} height={33}>
            <use xlinkHref="#icon-star" />
          </svg>
        </label>
        <input
          className="form__rating-input visually-hidden"
          name="rating"
          value={1}
          id="1-star"
          type="radio"
          disabled={sumbitStatus.isInProgress}
          onChange={(e) => setFormState((s) => ({ ...s, rating: +e.target.value }))}
          checked={formState.rating === 1}
        />
        <label
          htmlFor="1-star"
          className="reviews__rating-label form__rating-label"
          title="terribly"
        >
          <svg className="form__star-image" width={37} height={33}>
            <use xlinkHref="#icon-star" />
          </svg>
        </label>
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
          <b className="reviews__text-amount">50 characters</b>.
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
