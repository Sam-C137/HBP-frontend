import { HBApiService } from "@services";
import { GeocodeLocationRequestResponse } from "@types";
import { environment } from "@/environments/environment.development";
import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class LocationService extends HBApiService {
    getCordinates(): Promise<{ long: string; lat: string }> {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve({
                            long: position.coords.longitude.toString(),
                            lat: position.coords.latitude.toString(),
                        });
                    },
                    () => {
                        reject("User denied location access");
                    },
                );
            } else {
                reject("Geolocation is not supported by this browser");
            }
        });
    }

    getCityFromCordinates(long: string, lat: string) {
        const headers = new HttpHeaders()
            .set("Skip-Interceptor", "true")
            .set("Content-Type", "application/json");

        return this.http.get<GeocodeLocationRequestResponse>(
            `https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?location=${long},${lat}&f=json&token=${environment.geocodeApiKey}`,
            { headers },
        );
    }
}
