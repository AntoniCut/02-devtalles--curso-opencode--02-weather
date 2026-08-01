import type { GeocodingResponse, GeocodingResult } from "../types.ts";

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";

export async function searchCities(name: string): Promise<GeocodingResult[]> {
    const url = `${GEOCODING_URL}?name=${encodeURIComponent(name)}&count=5&language=es&format=json`;
    try {
        const res = await fetch(url);
        if (!res.ok) {
            console.log(`✗ Error de red (${res.status}). Intenta de nuevo.`);
            return [];
        }
        const data = (await res.json()) as GeocodingResponse;
        if (data.error) {
            console.log(`✗ Error de la API: ${data.reason ?? "desconocido"}`);
            return [];
        }
        return data.results ?? [];
    } catch (err) {
        console.log("✗ No se pudo conectar con el servicio de geocoding:", err);
        return [];
    }
}