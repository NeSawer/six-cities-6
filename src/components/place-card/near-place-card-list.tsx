import { OfferShortModel } from '../../models/offer-short-model';
import { PlaceCardMemo } from './place-card';

type Props = {
  placeCards: OfferShortModel[];
};

export default function NearPlaceCardList({ placeCards }: Props): JSX.Element {
  return (
    <section className="near-places places">
      <h2 className="near-places__title">
        Other places in the neighbourhood
      </h2>
      <div className="near-places__list places__list">
        {placeCards.map((c) => (
          <PlaceCardMemo
            variant='nearby'
            key={c.id}
            model={c}
          />
        ))}
      </div>
    </section>
  );
}
