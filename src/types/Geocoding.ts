/*
    *  -------------------------------------------------------  *
    *  -----  Geocoding.ts  --  /src/types/Geocoding.ts  -----  *
    *  -------------------------------------------------------  *
*/

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1: string;
}

export interface GeocodingResponse {
  results?: GeocodingResult[];
  error?: boolean;
  reason?: string;
}