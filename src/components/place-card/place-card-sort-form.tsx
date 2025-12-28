import { memo, useState } from 'react';
import { OfferSortOption } from '../../models/offer-sort-option';

const SORT_OPTIONS: OfferSortOption[] = [
  OfferSortOption.Popular,
  OfferSortOption.PriceLowToHigh,
  OfferSortOption.PriceHighToLow,
  OfferSortOption.TopRatedFirst,
];

type Props = {
  selectedOption: OfferSortOption;
  onChange?: (value: OfferSortOption) => void;
};

function PlaceCardSortForm({ selectedOption, onChange }: Props): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <form className="places__sorting" action="#" method="get">
      <span className="places__sorting-caption">Sort by</span>
      <span className="places__sorting-type" tabIndex={0} onClick={() => setIsOpen((state) => !state)}>
        {selectedOption}
        <svg className="places__sorting-arrow" width="7" height="4">
          <use
            xlinkHref="#icon-arrow-select"
            transform={isOpen ? 'rotate(180 3.5 2)' : undefined}
          >
          </use>
        </svg>
      </span>
      <ul className={`places__options places__options--custom${isOpen ? ' places__options--opened' : ''}`}>
        {SORT_OPTIONS.map((option) => (
          <li
            key={option}
            className={`places__option${option === selectedOption ? ' places__option--active' : ''}`}
            tabIndex={0}
            onClick={() => {
              setIsOpen(false);
              onChange?.(option);
            }}
          >
            {option}
          </li>
        ))}
      </ul>
    </form>
  );
}

export const PlaceCardSortFormMemo = memo(PlaceCardSortForm);
