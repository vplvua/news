import { Injectable } from '@angular/core';
import {
  Observable,
  catchError,
  filter,
  map,
  mergeMap,
  of,
  retry,
  share,
  switchMap,
  tap,
  throwError,
  toArray,
} from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from 'src/environment';
import { NotificationsService } from '../notifications/notifications.service';

interface OpenWeatherResponse {
  list: {
    dt_txt: string;
    main: {
      temp: number;
    };
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class ForecastService {
  url = environment.forecastURL;
  appid = environment.forecastAPIKey;

  constructor(
    private http: HttpClient,
    private notificationService: NotificationsService
  ) {}

  getForecast() {
    return this.getCurrentPosition().pipe(
      map((coords) => {
        return new HttpParams()
          .set('lat', String(coords.latitude))
          .set('lon', String(coords.longitude))
          .set('units', 'metric')
          .set('appid', this.appid);
      }),
      switchMap((params) =>
        this.http.get<OpenWeatherResponse>(this.url, { params })
      ),
      map((value) => value.list),
      mergeMap((value) => of(...value)),
      filter((value, index) => index % 8 === 0),
      map((value) => {
        return {
          dateString: value.dt_txt,
          temp: value.main.temp,
        };
      }),
      toArray(),
      share(),
      tap(
        () => {
          this.notificationService.addSuccess('Got your forecast');
        },
        (error) => {
          this.notificationService.addError('Failed to get your forecast');
        }
      )
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
    }).pipe(
      retry(1),
      tap(() => {
        this.notificationService.addSuccess('Got your location');
      }),
      catchError((error) => {
        this.notificationService.addError('Failed to get your location');
        return throwError(error);
      })
    );
  }
}
