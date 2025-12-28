import { useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { AppRoute } from '../../configuration/app-route';
import Header from '../../components/header/header';
import { OfferModel } from '../../models/offer-model';
import { OfferShortModel } from '../../models/offer-short-model';
import useAsyncEffect from '../../hooks/use-async-effect';
import { appApi } from '../../api/api';
import handleRequest from '../../tools/handle-request';
import Loader from '../../components/loader/loader';
import { useAppSelector } from '../../hooks/use-app-selector';
import { ApiRoute } from '../../configuration/api-route';
import { fetchUpdateFavoriteOffer, getFavoriteOffers } from '../../store/offers/offers';
import { ReviewModel } from '../../models/review-model';
import { Settings } from '../../configuration/settings';
import { useAppDispatch } from '../../hooks/use-app-dispatch';
import { getAuthStatus } from '../../store/auth/auth';
import { LocationModel } from '../../models/location-model';
import { AuthorizationStatus } from '../../models/authorization-status';
import Map from '../../components/map/map';
import withPrevent from '../../tools/with-prevent';
import OfferReviewList from '../../components/offer-review/offer-review-list';
import OfferReviewForm from '../../components/offer-review/offer-review-form';
import NearPlaceCardList from '../../components/place-card/near-place-card-list';

export default function OfferPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const authStatus = useAppSelector(getAuthStatus);
  const favoriteOffers = useAppSelector(getFavoriteOffers);
  const dispatch = useAppDispatch();

  const [offer, setOffer] = useState<OfferModel | null>();
  const [nearbyOffers, setNearbyOffers] = useState<OfferShortModel[] | null>();
  const [comments, setComments] = useState<ReviewModel[] | null>();

  useAsyncEffect((signal) => handleRequest(
    () => appApi.get<OfferModel>(`${ApiRoute.Offers}/${id}`, { signal }),
    setOffer,
    { [404]: () => setOffer(null) }
  ), [id, favoriteOffers]);

  useAsyncEffect((signal) => handleRequest(
    () => appApi.get<OfferShortModel[]>(`${ApiRoute.Offers}/${id}/${ApiRoute.Nearby}`, { signal }),
    setNearbyOffers,
    { [404]: () => setNearbyOffers(null) }
  ), [id, favoriteOffers]);

  useAsyncEffect((signal) => handleRequest(
    () => appApi.get<ReviewModel[]>(`${ApiRoute.Comments}/${id}`, { signal }),
    setComments,
    { [404]: () => setComments(null) }
  ), [offer]);

  const limitedNearbyOffers = nearbyOffers?.slice(0, Settings.NEARBY_OFFERS_LIMIT);

  const offerLocations: [string, LocationModel][] | undefined = useMemo(
    () => {
      if (!id || !offer) {
        return undefined;
      }
      if (!limitedNearbyOffers) {
        return [[id, offer.location]];
      }
      return [
        [id, offer.location],
        ...limitedNearbyOffers.map((p) => [p.id, p.location])
      ] as [string, LocationModel][];
    },
    [id, offer, limitedNearbyOffers]
  );

  if (offer === null || nearbyOffers === null) {
    return <Navigate to={AppRoute.NotFound} />;
  }

  const bookmarkOnClick = () => {
    if (!id || !offer) {
      return;
    }
    if (authStatus === AuthorizationStatus.Auth) {
      dispatch(fetchUpdateFavoriteOffer({ offerId: id, isFavorite: !offer.isFavorite }));
    } else {
      navigate(AppRoute.Login);
    }
  };

  return (
    <div className="page">
      <Header />
      <main className="page__main page__main--offer">
        {!offer ?
          <Loader /> :
          <>
            <section className="offer">
              <div className="offer__gallery-container container">
                <div className="offer__gallery">
                  {offer.images.slice(0, Settings.OFFER_MAX_IMAGES).map((url) => (
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
                  <section className="offer__reviews reviews">
                    <h2 className="reviews__title">
                      Reviews · <span className="reviews__amount">{comments?.length}</span>
                    </h2>
                    {!comments
                      ? <Loader />
                      : <OfferReviewList models={comments} />}
                    {authStatus === AuthorizationStatus.Auth &&
                      <OfferReviewForm
                        offerId={offer.id}
                        onPostComment={(comment) => setComments((prev) => [...prev ?? [], comment])}
                      />}
                  </section>
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
          </>}
      </main>
    </div>
  );
}
