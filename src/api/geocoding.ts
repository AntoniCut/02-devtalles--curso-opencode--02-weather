/*
    *  -----------------------------------------------------  *
    *  -----  geocoding.ts  --  /src/api/geocoding.ts  -----  *
    *  -----------------------------------------------------  *
*/

import type { GeocodingResponse, GeocodingResult } from "../types/Geocoding.ts";
import { GEOCODING_URL } from "../utils/constants.ts";


/**
 * ----------------------------------
 * -----  `searchCities(name)`  -----
 * ----------------------------------
 * - Busca ciudades por nombre en la API de geocoding de OpenMeteo.
 */

export const searchCities = async (name: string): Promise<GeocodingResult[]> => {
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
};