import { vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { MutableRefObject } from 'react';
import { Map as LeafletMap, TileLayer } from 'leaflet';
import { LocationModel } from '../models/location-model';
import useMap from './use-map';

vi.mock('leaflet', () => ({
  Map: vi.fn().mockImplementation(() => ({
    setView: vi.fn(),
    addLayer: vi.fn()
  })),
  TileLayer: vi.fn().mockImplementation(() => ({}))
}));

describe('useMap', () => {
  let mapRef: MutableRefObject<HTMLElement | null>;
  const cityLocation: LocationModel = {
    latitude: 10,
    longitude: 20,
    zoom: 5
  };

  beforeEach(() => {
    mapRef = { current: document.createElement('div') } as MutableRefObject<HTMLElement>;
    vi.clearAllMocks();
  });

  it('should create a map instance on first render', () => {
    const { result } = renderHook(() => useMap(mapRef, cityLocation));

    expect(LeafletMap).toHaveBeenCalledTimes(1);
    expect(LeafletMap).toHaveBeenCalledWith(mapRef.current, expect.any(Object));
    expect(TileLayer).toHaveBeenCalledTimes(1);
    expect(result.current).not.toBeNull();
  });

  it('should set the view if map already exists', () => {
    const { result, rerender } = renderHook(
      ({ ref, loc }) => useMap(ref, loc),
      { initialProps: { ref: mapRef, loc: cityLocation } }
    );
    rerender({ ref: mapRef, loc: { ...cityLocation, zoom: 7 } });

    const mapInstance = result.current!;
    expect(mapInstance.setView).toHaveBeenCalledWith(
      { lat: cityLocation.latitude, lng: cityLocation.longitude },
      cityLocation.zoom
    );
  });

  it('should not create map if mapRef.current is null', () => {
    mapRef.current = null;
    renderHook(() => useMap(mapRef, cityLocation));

    expect(LeafletMap).not.toHaveBeenCalled();
    expect(TileLayer).not.toHaveBeenCalled();
  });
});
