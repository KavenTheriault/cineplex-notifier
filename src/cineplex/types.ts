export interface Movie {
  id: number;
  releaseDate: string;
  name: string;
  runtimeInMinutes: number;
  filmUrl: string;
  smallPosterImageUrl: string;
  mediumPosterImageUrl: string;
  largePosterImageUrl: string;
  brightcoveVideoId: string;
  language: string;
  subtitleLanguage: string | null;
  marketLanguageCode: string;
  genres: string[];
  distributor: string;
  detailPageUrl: string;
  hasPosterImage: boolean;
  isNowPlaying: boolean;
  isRelevant: boolean;
  isComingSoon: boolean;
  hasShowtimes: boolean;
  isEvent: boolean;
  isEarlyAccess: boolean;
}

export interface Theatre {
  theatreId: number;
  theatreName: string;
  shortTheatreName: string;
  theatreUrl: string;
  hasFreeParking: boolean;
  alertMessages: string | null;
  location: Location;
}

export interface Location {
  geoLocation: GeoLocation;
  distanceToOriginInMeters: number;
  hasDistanceToOrigin: boolean;
  address: string;
  city: string;
  provinceCode: string;
  postalCode: string;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export interface ListResult<T> {
  items: T[];
  totalCount: number;
}

export interface TheatresResult {
  favouriteTheatres: Theatre[];
  nearbyTheatres: Theatre[];
  otherTheatres: Theatre[];
}