import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ForecastService {
  constructor() {}

  getForecast() {
    return this.getCurrentPosition().pipe(
      map((coords) => {
        return new HttpParams()
          .set('lat', String(coords.latitude))
          .set('lon', String(coords.longitude))
          .set('units', 'metric')
          .set('appid', 'a24795300c429d64868e03aa07e89853');
      })
    );
  }

  getCurrentPosition() {
    return new Observable<GeolocationCoordinates>((observer) => {
      window.navigator.geolocation.getCurrentPosition(
        (position) => {
          observer.next(position.coords);
          observer.complete();
        },
        (error) => observer.error(error)
      );
    });
  }
}
