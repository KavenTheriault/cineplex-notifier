import {AppConfig} from "../config";

const CINEPLEX_API_BASE_URL = "https://apis.cineplex.com/prod/cpx/theatrical/api/v1";

export const cineplexApiCall = async <T>(path: string, appConfig: AppConfig): Promise<T> => {
  const response = await fetch(
    new URL(`${CINEPLEX_API_BASE_URL}/${path}`),
    {headers: new Headers({'Ocp-Apim-Subscription-Key': appConfig.apiSubscriptionKey})}
  );
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const result = await response.json();
  return result as T;
}
