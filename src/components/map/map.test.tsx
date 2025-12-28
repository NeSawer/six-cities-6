import { Mock, vi } from 'vitest';
import { render } from '@testing-library/react';
import Map from './map';
import { LocationModel } from '../../models/location-model';
import { layerGroup, Marker } from 'leaflet';

vi.mock('leaflet', () => {
  const mockAddTo = vi.fn().mockReturnThis();
  return {
    Map: vi.fn().mockImplementation(() => ({
      setView: vi.fn(),
      addLayer: vi.fn(),
      removeLayer: vi.fn()
    })),
    Marker: vi.fn().mockImplementation(() => ({
      setIcon: vi.fn().mockReturnThis(),
      addTo: mockAddTo
    })),
    layerGroup: vi.fn(() => ({
      addTo: mockAddTo
    })),
    Icon: vi.fn(),
    TileLayer: vi.fn().mockImplementation(() => ({
      addTo: mockAddTo
    }))
  };
});

describe('Component: Map', () => {
  const cityLocation: LocationModel = { latitude: 10, longitude: 20, zoom: 5 };
  const offerLocations: [string, LocationModel][] = [
    ['1', { latitude: 11, longitude: 21, zoom: 1 }],
    ['2', { latitude: 12, longitude: 22, zoom: 1 }]
  ];

  it('should renders the correct map container class for type "cities"', () => {
    const { container } = render(<Map type="cities" cityLocation={cityLocation} />);
    expect(container.querySelector('section')).toHaveClass('cities__map');
  });

  it('should renders the correct map container class for type "offer"', () => {
    const { container } = render(<Map type="offer" cityLocation={cityLocation} />);
    expect(container.querySelector('section')).toHaveClass('offer__map');
  });

  it('should adds markers to the map', () => {
    render(<Map type="cities" cityLocation={cityLocation} offerLocations={offerLocations} selectedOfferId="1" />);

    expect(layerGroup).toHaveBeenCalled();
    expect(Marker).toHaveBeenCalledTimes(2);
    const firstMarker = (Marker as unknown as Mock).mock.results[0].value as Marker;
    expect(firstMarker.setIcon).toHaveBeenCalled();
    expect(firstMarker.addTo).toHaveBeenCalled();
  });
});
