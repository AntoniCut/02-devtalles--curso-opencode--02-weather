import type { GeocodingResponse, GeocodingResult } from "../types/Geocoding.ts";
import { GEOCODING_URL } from "../utils/constants.ts";

export async function searchCities(name: string): Promise<GeocodingResult[]> {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(name)}&count=5&language=es&format=json`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      return [];
    }
    const data = (await res.json()) as GeocodingResponse;
    if (data.error) {
      return [];
    }
    return data.results ?? [];
  } catch {
    return [];
  }
}
