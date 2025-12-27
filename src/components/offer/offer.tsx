import { Fragment, useMemo } from 'react';
import { OfferModel } from '../../models/offer-model';
import OfferReviewSection from '../offer-review/offer-review-section';
import NearPlaceCardList from '../place-card/near-place-card-list';
import { OfferShortModel } from '../../models/offer-short-model';
import Map from '../map/map';
import Loader from '../loader/loader';
import { LocationModel } from '../../models/location-model';
import { Setting } from '../../configuration/consts';
import withPrevent from '../../tools/with-prevent';
import { fetchUpdateFavoriteOffer } from '../../store/namespaces/offers';
import { useAppDispatch } from '../../hooks/use-app-dispatch';
import { useAppSelector } from '../../hooks/use-app-selector';
import { AuthorizationStatus } from '../../models/authorization-status';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../../app-route';

type Props = {
  offer: OfferModel;
  nearbyOffers?: OfferShortModel[] | null;
};

export default function Offer({ offer, nearbyOffers }: Props): JSX.Element {
  const navigate = useNavigate();

  const authStatus = useAppSelector((state) => state.auth.authStatus);
  const dispatch = useAppDispatch();
  const limitedNearbyOffers = nearbyOffers?.slice(0, Setting.NEARBY_OFFERS_LIMIT);

  const offerLocations: [string, LocationModel][] = useMemo(
    () => {
      if (!limitedNearbyOffers) {
        return [[offer.id, offer.location]];
      }
      return [
        [offer.id, offer.location],
        ...limitedNearbyOffers.map((p) => [p.id, p.location])
      ] as [string, LocationModel][];
    },
    [offer, limitedNearbyOffers]
  );

  const bookmarkOnClick = () => {
    if (authStatus === AuthorizationStatus.Auth) {
      dispatch(fetchUpdateFavoriteOffer({ offerId: offer.id, isFavorite: !offer.isFavorite }));
    } else {
      navigate(AppRoute.Login);
    }
  };

  return (
    <Fragment>
      <section className="offer">
        <div className="offer__gallery-container container">
          <div className="offer__gallery">
            {offer.images.slice(0, 6).map((url) => (
              <div key={url} className="offer__image-wrapper">
                <img
                  className="offer__image"
                  src={url}
                  alt="Photo studio"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="offer__container container">
          <div className="offer__wrapper">
            {offer.isPremium &&
              <div className="offer__mark">
                <span>Premium</span>
              </div>}
            <div className="offer__name-wrapper">
              <h1 className="offer__name">
                {offer.title}
              </h1>
              <button
                className={`offer__bookmark-button ${offer.isFavorite ? 'offer__bookmark-button--active ' : ''}button`}
                type="button"
                onClick={withPrevent(bookmarkOnClick)}
              >
                <svg className="offer__bookmark-icon" width={31} height={33}>
                  <use xlinkHref="#icon-bookmark" />
                </svg>
                <span className="visually-hidden">{offer.isFavorite ? 'In' : 'To'} bookmarks</span>
              </button>
            </div>
            <div className="offer__rating rating">
              <div className="offer__stars rating__stars">
                <span style={{ width: `${Math.round(offer.rating) * 20}%` }} />
                <span className="visually-hidden">Rating</span>
              </div>
              <span className="offer__rating-value rating__value">{offer.rating}</span>
            </div>
            <ul className="offer__features">
              <li className="offer__feature offer__feature--entire">{offer.type[0].toUpperCase()}{offer.type.slice(1)}</li>
              <li className="offer__feature offer__feature--bedrooms">
                {offer.bedrooms} Bedroom{offer.bedrooms > 1 ? 's' : ''}
              </li>
              <li className="offer__feature offer__feature--adults">
                Max {offer.maxAdults} adult{offer.maxAdults > 1 ? 's' : ''}
              </li>
            </ul>
            <div className="offer__price">
              <b className="offer__price-value">€{offer.price}</b>
              <span className="offer__price-text">&nbsp;night</span>
            </div>
            <div className="offer__inside">
              <h2 className="offer__inside-title">What&#39;s inside</h2>
              <ul className="offer__inside-list">
                {offer.goods.map((g) => (
                  <li key={g} className="offer__inside-item">{g}</li>
                ))}
              </ul>
            </div>
            <div className="offer__host">
              <h2 className="offer__host-title">Meet the host</h2>
              <div className="offer__host-user user">
                <div className={`offer__avatar-wrapper ${offer.host.isPro ? 'offer__avatar-wrapper--pro ' : ''}user__avatar-wrapper`}>
                  <img
                    className="offer__avatar user__avatar"
                    src={offer.host.avatarUrl}
                    width={74}
                    height={74}
                    alt="Host avatar"
                  />
                </div>
                <span className="offer__user-name">{offer.host.name}</span>
                {offer.host.isPro && <span className="offer__user-status">Pro</span>}
              </div>
              <div className="offer__description">
                <p className="offer__text">
                  {offer.description}
                </p>
              </div>
            </div>
            <OfferReviewSection offerId={offer.id} />
          </div>
        </div>
        <Map
          type='offer'
          cityLocation={offer.city.location}
          offerLocations={offerLocations}
          selectedOfferId={offer.id}
        />
      </section>
      <div className="container">
        {!limitedNearbyOffers
          ? <Loader />
          : <NearPlaceCardList placeCards={limitedNearbyOffers} />}
      </div>
    </Fragment>
  );
}
