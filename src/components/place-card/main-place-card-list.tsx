import { useMemo, useState } from 'react';
import { OfferShortModel } from '../../models/offer-short-model';
import { OfferSortOption } from '../../models/offer-sort-option';
import { PlaceCardSortFormMemo } from './place-card-sort-form';
import { PlaceCardMemo } from './place-card';
import Loader from '../loader/loader';

type Props = {
  cityName: string;
  offers?: OfferShortModel[];
  onChangeActiveOfferId?: (offerId: string | undefined) => void;
};

const SORTERS: Record<OfferSortOption, ((offers: OfferShortModel[]) => OfferShortModel[])> = {
  [OfferSortOption.Popular]: (offers) => offers,
  [OfferSortOption.PriceLowToHigh]: (offers) => offers.slice().sort((a, b) => a.price - b.price),
  [OfferSortOption.PriceHighToLow]: (offers) => offers.slice().sort((a, b) => b.price - a.price),
  [OfferSortOption.TopRatedFirst]: (offers) => offers.slice().sort((a, b) => b.rating - a.rating),
};

export default function MainPlaceCardList({ cityName, offers, onChangeActiveOfferId }: Props): JSX.Element {
  const [selectedSortOption, setSelectedSortOption] = useState<OfferSortOption>(OfferSortOption.Popular);

  const sortedOffers = useMemo(
    () => offers && SORTERS[selectedSortOption](offers),
    [selectedSortOption, offers]
  );

  return (
    <section className="cities__places places">
      <h2 className="visually-hidden">Places</h2>
      {!sortedOffers
        ? <Loader />
        :
        <>
          <b className="places__found">{sortedOffers.length} places to stay in {cityName}</b>
          <PlaceCardSortFormMemo selectedOption={selectedSortOption} onChange={setSelectedSortOption} />
          <div className="cities__places-list places__list tabs__content">
            {sortedOffers.map((c) => (
              <PlaceCardMemo
                variant='city'
                key={c.id}
                model={c}
                onMouseEnter={() => onChangeActiveOfferId?.(c.id)}
                onMouseLeave={() => onChangeActiveOfferId?.(undefined)}
              />
            ))}
          </div>
        </>}
    </section>
  );
}
