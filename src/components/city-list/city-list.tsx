import { CityModel } from '../../models/city';
import withPrevent from '../../tools/with-prevent';

type Props = {
  cities: CityModel[];
  selectedCityName: string;
  onSelectCity?: (city: CityModel) => void;
};

export default function CityList({ cities, selectedCityName, onSelectCity }: Props): JSX.Element {
  return (
    <section className="locations container">
      <ul className="locations__list tabs__list">
        {cities.map((city) => (
          <li key={city.name} className="locations__item">
            <a
              className={`locations__item-link tabs__item${city.name === selectedCityName ? ' tabs__item--active' : ''}`}
              href="#"
              onClick={withPrevent(() => onSelectCity?.(city))}
            >
              <span>{city.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
