import { Link, useNavigate } from 'react-router-dom';
import { AppRoute } from '../../configuration/app-route';
import { OfferShortModel } from '../../models/offer-short-model';
import withPrevent from '../../tools/with-prevent';
import { useAppDispatch } from '../../hooks/use-app-dispatch';
import { fetchUpdateFavoriteOffer } from '../../store/offers/offers';
import { useAppSelector } from '../../hooks/use-app-selector';
import { AuthorizationStatus } from '../../models/authorization-status';
import { getAuthStatus } from '../../store/auth/auth';
import { memo } from 'react';

type Props = {
  variant: 'city' | 'favorite' | 'nearby';
  model: OfferShortModel;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
};

function PlaceCard({ variant, model, onMouseEnter, onMouseLeave }: Props): JSX.Element {
  const navigate = useNavigate();

  const authStatus = useAppSelector(getAuthStatus);
  const dispatch = useAppDispatch();

  const variantClass = {
    city: 'cities',
    favorite: 'favorites',
    nearby: 'near-places'
  }[variant];

  const bookmarkOnClick = () => {
    if (authStatus === AuthorizationStatus.Auth) {
      dispatch(fetchUpdateFavoriteOffer({ offerId: model.id, isFavorite: !model.isFavorite }));
    } else {
      navigate(AppRoute.Login);
    }
  };

  return (
    <article
      className={`${variantClass}__card place-card`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {model.isPremium &&
        <div className="place-card__mark">
          <span>Premium</span>
        </div>}
      <div className={`${variantClass}__image-wrapper place-card__image-wrapper`}>
        <Link to={`${AppRoute.Offer}/${model.id}`}>
          <img
            className="place-card__image"
            src={model.previewImage}
            width={variant === 'favorite' ? 150 : 260}
            height={variant === 'favorite' ? 110 : 200}
            alt="Place image"
          />
        </Link>
      </div>
      <div className={`${variant === 'favorite' ? 'favorites__card-info ' : ''}place-card__info`}>
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{model.price}</b>
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>
          <button
            className={`place-card__bookmark-button ${model.isFavorite ? 'place-card__bookmark-button--active ' : ''}button`}
            type="button"
            onClick={withPrevent(bookmarkOnClick)}
          >
            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use xlinkHref="#icon-bookmark"></use>
            </svg>
            <span className="visually-hidden">{model.isFavorite ? 'In' : 'To'} bookmarks</span>
          </button>
        </div>
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span data-testid="rating-span" style={{ width: `${Math.round(model.rating) * 20}%` }}></span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <h2 className="place-card__name">
          <Link to={`${AppRoute.Offer}/${model.id}`}>{model.title}</Link>
        </h2>
        <p className="place-card__type">{model.type}</p>
      </div>
    </article>
  );
}

export const PlaceCardMemo = memo(PlaceCard);
