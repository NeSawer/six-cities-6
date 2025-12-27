import { useMemo, useState } from 'react';
import { useAppSelector } from '../../hooks/use-app-selector';
import { useAppDispatch } from '../../hooks/use-app-dispatch';
import CityList from '../../components/city-list/city-list';
import MainPlaceCardList from '../../components/place-card/main-place-card-list';
import Map from '../../components/map/map';
import cities from '../../mocks/cities';
import Header from '../../components/header/header';
import { selectCity } from '../../store/namespaces/offers';

export default function MainPage(): JSX.Element {
  const selectedCity = useAppSelector((state) => state.offers.selectedCity);
  const offers = useAppSelector((state) => state.offers.offers);
  const dispatch = useAppDispatch();

  const [activeOfferId, setActiveOfferId] = useState<string>();

  const filteredOffers = useMemo(
    () => offers?.filter((o) => o.city.name === selectedCity.name),
    [selectedCity.name, offers]
  );

  const isEmpty = filteredOffers?.length === 0;

  return (
    <div className="page page--gray page--main">
      <Header />
      <main className={`page__main page__main--index${isEmpty ? ' page__main--index-empty' : ''}`}>
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs">
          <CityList
            cities={cities}
            selectedCityName={selectedCity.name}
            onSelectCity={(city) => dispatch(selectCity(city))}
          />
        </div>
        <div className="cities">
          <div className={`cities__places-container${isEmpty ? ' cities__places-container--empty' : ''} container`}>
            {isEmpty
              ?
              <section className="cities__no-places">
                <div className="cities__status-wrapper tabs__content">
                  <b className="cities__status">No places to stay available</b>
                  <p className="cities__status-description">We could not find any property available at the moment in {selectedCity.name}</p>
                </div>
              </section>
              :
              <MainPlaceCardList
                cityName={selectedCity.name}
                offers={filteredOffers}
                onChangeActiveOfferId={setActiveOfferId}
              />}
            <div className="cities__right-section">
              {!isEmpty &&
                <Map
                  type='cities'
                  cityLocation={selectedCity.location}
                  offerLocations={filteredOffers?.map((p) => [p.id, p.location])}
                  selectedOfferId={activeOfferId}
                />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
