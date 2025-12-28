import { useMemo, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { AppRoute } from '../../configuration/app-route';
import Offer from '../../components/offer/offer';
import Header from '../../components/header/header';
import { OfferModel } from '../../models/offer-model';
import { OfferShortModel } from '../../models/offer-short-model';
import useAsyncEffect from '../../hooks/use-async-effect';
import { appApi } from '../../api/api';
import handleRequest from '../../tools/handle-request';
import Loader from '../../components/loader/loader';
import { useAppSelector } from '../../hooks/use-app-selector';
import { ApiRoute } from '../../configuration/api-route';
import { getFavoriteOffers } from '../../store/offers/offers';

export default function OfferPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();

  const favoriteOffers = useAppSelector(getFavoriteOffers);

  const [offer, setOffer] = useState<OfferModel | null>();
  const [nearbyOffers, setNearbyOffers] = useState<OfferShortModel[] | null>();

  useAsyncEffect((signal) => handleRequest(
    () => appApi.get<OfferModel>(`${ApiRoute.Offers}/${id}`, { signal }),
    setOffer,
    { [404]: () => setOffer(null) }
  ), [id]);

  useAsyncEffect((signal) => handleRequest(
    () => appApi.get<OfferShortModel[]>(`${ApiRoute.Offers}/${id}/${ApiRoute.Nearby}`, { signal }),
    setNearbyOffers,
    { [404]: () => setNearbyOffers(null) }
  ), [id]);

  const trueOffer = useMemo(() => offer && {
    ...offer,
    isFavorite: favoriteOffers?.some((o) => o.id === offer?.id) ?? offer.isFavorite
  }, [offer, favoriteOffers]);

  const trueNearByOffers = useMemo(() => nearbyOffers && nearbyOffers.map((no) => ({
    ...no,
    isFavorite: favoriteOffers?.some((o) => o.id === no?.id) ?? no.isFavorite
  })), [nearbyOffers, favoriteOffers]);

  if (offer === null || nearbyOffers === null) {
    return <Navigate to={AppRoute.NotFound} />;
  }

  return (
    <div className="page">
      <Header />
      <main className="page__main page__main--offer">
        {!trueOffer
          ? <Loader />
          : <Offer offer={trueOffer} nearbyOffers={trueNearByOffers} />}
      </main>
    </div>
  );
}
