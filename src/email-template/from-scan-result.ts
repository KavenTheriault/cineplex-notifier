import {ScanResult} from "../scan/types";
import {Movie} from "../cineplex/types";

export const buildEmailFromScanResult = (scanResult: ScanResult): string => {
  const {
    newMovies,
    newBookableMovies,
    trackedMovieDatesFound,
    trackedMovies,
    trackedMovieIdsNotFound,
    nearbyTheatres
  } = scanResult;

  let emailBody = '';

  if (trackedMovieDatesFound.length > 0) {
    emailBody += '🎟️ TRACKED MOVIES NOW AVAILABLE:\n\n';
    trackedMovieDatesFound.forEach(found => {
      emailBody += `${found.movieName} @ ${found.theatreName}\n`;
      emailBody += `Dates: ${found.dates.map(formatDate).join(', ')}\n\n`;
    });
  }

  if (newBookableMovies.length > 0) {
    emailBody += '\n📅 NEW BOOKABLE MOVIES:\n\n';
    newBookableMovies.forEach(movie => {
      emailBody += buildMovieText(movie);
    });
  }

  if (newMovies.length > 0) {
    emailBody += '\n🎬 NEW MOVIES ANNOUNCED:\n\n';
    newMovies.forEach(movie => {
      emailBody += buildMovieText(movie);
    });
  }

  emailBody += '\n' + '─'.repeat(60) + '\n';
  emailBody += '⚙️ CURRENT CONFIGURATION\n\n';

  emailBody += `📌 Tracked Movies (${trackedMovies.length}):\n`;
  trackedMovies.forEach(movie => {
    emailBody += `   - ${movie.name} (ID: ${movie.id})\n`;
  });

  if (trackedMovieIdsNotFound.length > 0) {
    emailBody += `\n⚠️  Tracked Movie IDs Not Found (${trackedMovieIdsNotFound.length}):\n`;
    emailBody += `   ${trackedMovieIdsNotFound.join(', ')}\n`;
  }

  emailBody += `\n🎭 Nearby Theatres (${nearbyTheatres.length}):\n`;
  nearbyTheatres.forEach(theatre => {
    const distanceKm = (theatre.location.distanceToOriginInMeters / 1000).toFixed(1);
    emailBody += `   - ${theatre.shortTheatreName} (${distanceKm}km)\n`;
  });

  return emailBody;
}

const formatDate = (dateString: string): string => {
  return dateString.replace('T00:00:00', '');
}

const buildMovieText = (movie: Movie) => {
  const flags = [];
  if (movie.isEvent) flags.push('🎪 Event');
  if (movie.isEarlyAccess) flags.push('⚡ Early Access');
  const flagText = flags.length > 0 ? ` [${flags.join(', ')}]` : '';

  return `- ${movie.name} (Release: ${formatDate(movie.releaseDate)})${flagText}\n`;
}