export const API_URL = "https://b3owi4hxn3.execute-api.us-east-1.amazonaws.com/Prod/v1";

// Search related constant
export const SEARCH_AUTOCOMPLETE_API_URL = "https://suggestqueries.google.com/complete/search";

// Youtube Data API
export const YOUTUBE_API_SEARCH_ENDPOINT = "https://www.googleapis.com/youtube/v3/search"

export const authConfig = {
  loginEndpoint: "https://whatnext.auth.us-east-1.amazoncognito.com/login",
  tokenEndpoint: "https://whatnext.auth.us-east-1.amazoncognito.com/oauth2/token",
};

// storage keys
export const storageKeys = {
  masterLobbyId: "masterLobbyId",
  clientLobbyId: "clientLobbyId",
  authToken: "authToken"
};
