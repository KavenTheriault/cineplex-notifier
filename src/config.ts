import dotenv from "dotenv";

export interface AppConfig {
  destinationEmail: string;
  smtpUser: string;
  smtpPassword: string;
  apiSubscriptionKey: string;
  latitude: string;
  longitude: string;
  trackedMovieIds: number[];
}

export const loadAppConfig = (): AppConfig => {
  dotenv.config({quiet: true});

  return {
    destinationEmail: process.env.DESTINATION_EMAIL!,
    smtpUser: process.env.SMTP_USER!,
    smtpPassword: process.env.SMTP_PASS!,
    apiSubscriptionKey: process.env.API_SUBSCRIPTION_KEY!,
    latitude: process.env.LATITUDE!,
    longitude: process.env.LONGITUDE!,
    trackedMovieIds: process.env.TRACKED_MOVIE_IDS!.split(',').map(id => Number(id.trim())),
  }
}