import {ScanResult, TrackedMovieDateFound} from "./types";
import {ListResult, Movie, Theatre, TheatresResult} from "../cineplex/types";
import {existsSync} from "fs";
import {readJsonFile, writeJsonFile} from "../json-file";
import {keyBy} from "lodash";
import {cineplexApiCall} from "../cineplex/api";
import {AppConfig} from "../config";

const NEARBY_THEATRES_LIMIT_KM = 25;
const MOVIES_FILE = 'movies.json';
const BOOKABLE_MOVIES_FILE = 'bookable-movies.json';
const NOTIFIED_DATES_FILE = 'notified-dates.json';

interface NotifiedDate {
  movieId: number;
  theatreId: number;
  date: string;
}

export const scan = async (appConfig: AppConfig): Promise<ScanResult> => {
  const {movies: bookableMovies, newMovies: newBookableMovies} = await detectNewMovies(
    BOOKABLE_MOVIES_FILE,
    () => cineplexApiCall<Movie[]>('movies/bookable?language=en', appConfig)
  );
  if (newBookableMovies.length > 0) {
    console.log(`📅 New bookable movies: ${newBookableMovies.map(m => m.name).join(', ')}`);
  } else {
    console.log('📅 No new bookable movies found');
  }

  const {movies: movies, newMovies: newMovies} = await detectNewMovies(
    MOVIES_FILE,
    async () => {
      const result = await cineplexApiCall<ListResult<Movie>>('movies?language=en', appConfig);
      return result.items;
    }
  );
  if (newMovies.length > 0) {
    console.log(`🎬 New movies announced: ${newMovies.map(m => m.name).join(', ')}`);
  } else {
    console.log('🎬 No new movies announced');
  }

  const trackedMovies: Movie[] = [];
  const trackedMovieIdsNotFound: number[] = [];
  const moviesById = keyBy(movies, 'id');
  for (const trackedMovieId of appConfig.trackedMovieIds) {
    const movie = moviesById[trackedMovieId];
    if (movie) trackedMovies.push(movie); else trackedMovieIdsNotFound.push(trackedMovieId);
  }

  const nearbyTheatres = await findNearbyTheatres(appConfig);
  const trackedMovieDatesFound = await findDatesForTrackedMovies(
    trackedMovies, bookableMovies, nearbyTheatres, appConfig
  );

  return {
    newMovies,
    newBookableMovies,
    trackedMovies,
    trackedMovieIdsNotFound,
    trackedMovieDatesFound,
    nearbyTheatres,
  }
}

const detectNewMovies = async (fileName: string, getMovies: () => Promise<Movie[]>): Promise<{
  movies: Movie[],
  newMovies: Movie[]
}> => {
  const fileExist = existsSync(fileName);

  const movies = await getMovies();
  const savedMovies = fileExist ? await readJsonFile<Movie[]>(fileName) : [];
  await writeJsonFile(fileName, movies);

  if (!fileExist) {
    console.log(`📝 First run detected. Saved ${movies.length} items to ${fileName} for comparison on next run.`);
    return {movies, newMovies: []};
  }

  const savedMoviesById = keyBy(savedMovies, 'id');
  return {movies, newMovies: movies.filter(movie => !savedMoviesById[movie.id])};
}

const findNearbyTheatres = async (appConfig: AppConfig): Promise<Theatre[]> => {
  const theatres = await cineplexApiCall<TheatresResult>(
    `theatres?Latitude=${appConfig.latitude}&Longitude=${appConfig.longitude}`,
    appConfig
  );
  return [...theatres.nearbyTheatres, ...theatres.otherTheatres].filter(
    t => t.location.distanceToOriginInMeters <= NEARBY_THEATRES_LIMIT_KM * 1000
  );
}

const findDatesForTrackedMovies = async (
  trackedMovies: Movie[],
  allBookableMovies: Movie[],
  nearbyTheatres: Theatre[],
  appConfig: AppConfig
): Promise<TrackedMovieDateFound[]> => {
  const bookableMoviesById = keyBy(allBookableMovies, 'id');

  const notifiedDates = existsSync(NOTIFIED_DATES_FILE) ? await readJsonFile<NotifiedDate[]>(NOTIFIED_DATES_FILE) : [];
  const notifiedSet = new Set(
    notifiedDates.map(n => notifiedKey(n.movieId, n.theatreId, n.date))
  );

  const trackedMovieDateFounds: TrackedMovieDateFound[] = [];
  for (const trackedMovie of trackedMovies) {
    if (!bookableMoviesById[trackedMovie.id]) {
      console.log(`🔒 ${trackedMovie.name} is not available for booking yet.`);
      continue;
    }
    for (const nearbyTheatre of nearbyTheatres) {
      const dates = await cineplexApiCall<string[]>(
        `dates/bookable?filmId=${trackedMovie.id}&locationId=${nearbyTheatre.theatreId}`,
        appConfig
      );
      if (dates.length === 0) {
        console.log(`➖ ${trackedMovie.name} is not available at ${nearbyTheatre.theatreName}`);
        continue;
      }

      const newDates = dates.filter(date =>
        !notifiedSet.has(notifiedKey(trackedMovie.id, nearbyTheatre.theatreId, date))
      );
      if (newDates.length > 0) {
        newDates.forEach(date => {
          notifiedDates.push({
            movieId: trackedMovie.id,
            theatreId: nearbyTheatre.theatreId,
            date,
          })
        })
        trackedMovieDateFounds.push({
          movieName: trackedMovie.name,
          theatreName: nearbyTheatre.theatreName,
          dates: newDates,
        });
        console.log(`✅ ${trackedMovie.name} @ ${nearbyTheatre.theatreName}: ${newDates.length} new dates`);
      } else {
        console.log(`ℹ️ ${trackedMovie.name} @ ${nearbyTheatre.theatreName}: already notified for all dates`);
      }
    }
  }

  await writeJsonFile(NOTIFIED_DATES_FILE, notifiedDates);
  return trackedMovieDateFounds;
}

const notifiedKey = (movieId: number, theatreId: number, date: string) =>
  `${movieId}|${theatreId}|${date}`;