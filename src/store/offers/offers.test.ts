import cities from '../../mocks/cities';
import { makeFakeOffer, makeFakeOffers } from '../../test-utils/mock';
import { offersSlice, selectCity, setFavoriteOffers, setOffers, updateFavoriteOffer } from './offers';

describe('Offers Slice', () => {
  it('should return initial state with empty action', () => {
    const emptyAction = { type: '' };
    const expectedState = { selectedCity: cities[1], offers: [], favoriteOffers: null };

    const result = offersSlice.reducer(expectedState, emptyAction);

    expect(result).toEqual(expectedState);
  });

  it('should return default initial state with empty action and undefined state', () => {
    const emptyAction = { type: '' };
    const expectedState = { selectedCity: cities[0], offers: null, favoriteOffers: null };

    const result = offersSlice.reducer(undefined, emptyAction);

    expect(result).toEqual(expectedState);
  });

  it('should set selected city with "selectCity" action', () => {
    const initialState = { selectedCity: cities[1], offers: [], favoriteOffers: null };
    const expectedState = { selectedCity: cities[2], offers: [], favoriteOffers: null };

    const result = offersSlice.reducer(initialState, selectCity(cities[2]));

    expect(result).toEqual(expectedState);
  });

  it('should set offers with "setOffers" action', () => {
    const initialState = { selectedCity: cities[0], offers: null, favoriteOffers: null };
    const expectedState = { selectedCity: cities[0], offers: makeFakeOffers(), favoriteOffers: null };

    const result = offersSlice.reducer(initialState, setOffers(expectedState.offers));

    expect(result).toEqual(expectedState);
  });

  it('should set favorite offers with "setFavoriteOffers" action', () => {
    const initialState = { selectedCity: cities[0], offers: null, favoriteOffers: null };
    const expectedState = { selectedCity: cities[0], offers: null, favoriteOffers: makeFakeOffers(true) };

    const result = offersSlice.reducer(initialState, setFavoriteOffers(expectedState.favoriteOffers));

    expect(result).toEqual(expectedState);
  });

  it('should update favorite offer to true with "updateFavoriteOffer" action', () => {
    const offer = makeFakeOffer(false);
    const initialState = { selectedCity: cities[0], offers: [offer, ...makeFakeOffers()], favoriteOffers: makeFakeOffers(true) };
    const updatedOffer = structuredClone(offer);
    updatedOffer.isFavorite = true;

    const result = offersSlice.reducer(initialState, updateFavoriteOffer(updatedOffer));

    expect(result.offers).not.toContainEqual(offer);
    expect(result.offers).toContainEqual(updatedOffer);
    expect(result.favoriteOffers).toContainEqual(updatedOffer);
  });

  it('should update favorite offer to false with "updateFavoriteOffer" action', () => {
    const offer = makeFakeOffer(true);
    const initialState = { selectedCity: cities[0], offers: [offer, ...makeFakeOffers()], favoriteOffers: [offer, ...makeFakeOffers(true)] };
    const updatedOffer = structuredClone(offer);
    updatedOffer.isFavorite = false;

    const result = offersSlice.reducer(initialState, updateFavoriteOffer(updatedOffer));

    expect(result.offers).not.toContainEqual(offer);
    expect(result.offers).toContainEqual(updatedOffer);
    expect(result.favoriteOffers).not.toContainEqual(offer);
    expect(result.favoriteOffers).not.toContainEqual(updatedOffer);
  });
});
