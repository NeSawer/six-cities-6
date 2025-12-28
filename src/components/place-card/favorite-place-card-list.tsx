import { useMemo } from 'react';
import { OfferShortModel } from '../../models/offer-short-model';
import groupBy from '../../tools/group-by';
import Loader from '../loader/loader';
import { PlaceCardMemo } from './place-card';

type Props = {
  offers: OfferShortModel[] | null;
};

export default function FavoritePlaceCardList({ offers }: Props): JSX.Element {
  const groupedOffers = useMemo(
    () => offers && Object.entries(groupBy(offers, (c) => c.city.name)),
    [offers]);

  const isEmpty = groupedOffers && groupedOffers.length === 0;

  return (
    <section className={`favorites${isEmpty ? ' favorites--empty' : ''}`}>
      {isEmpty ?
        <>
          <h1 className="visually-hidden">Favorites (empty)</h1>
          <div className="favorites__status-wrapper">
            <b className="favorites__status">Nothing yet saved.</b>
            <p className="favorites__status-description">Save properties to narrow down search or plan your future trips.</p>
          </div>
        </> :
        <>
          <h1 className="favorites__title">Saved listing</h1>
          {!groupedOffers
            ? <Loader />
            :
            <ul className="favorites__list">
              {groupedOffers.map(([city, cards]) => (
                <li key={city} className="favorites__locations-items">
                  <div className="favorites__locations locations locations--current">
                    <div className="locations__item">
                      <a className="locations__item-link" href="#">
                        <span>{city}</span>
                      </a>
                    </div>
                  </div>
                  <div className="favorites__places">
                    {cards.map((c) => (
                      <PlaceCardMemo
                        variant='favorite'
                        key={c.id}
                        model={c}
                      />
                    ))}
                  </div>
                </li>
              )
              )}
            </ul>}
        </>}
    </section>
  );
}
