import {Movie, Theatre} from "../cineplex/types";

export interface TrackedMovieDateFound {
  movieName: string;
  theatreName: string;
  dates: string[];
}

export interface ScanResult {
  newBookableMovies: Movie[];
  newMovies: Movie[];
  trackedMovieDatesFound: TrackedMovieDateFound[];
  trackedMovies: Movie[];
  trackedMovieIdsNotFound: number[];
  nearbyTheatres: Theatre[];
}