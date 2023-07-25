import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';
import { HttpParams, HttpClient } from '@angular/common/http';

import { environment } from 'src/environment';

export interface Article {
  title: string;
  url: string;
  source: {
    name: string;
  };
}

interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}

@Injectable({
  providedIn: 'root',
})
export class NewsApiService {
  private url = environment.newsApiUrl;
  private apiKey = environment.newsAPIkey;
  private country = 'ua';
  private pageSize = 5;

  private pagesInput: Subject<number>;
  pagesOutput: Observable<Article[]>;
  numberOfPages: Subject<number>;

  constructor(private http: HttpClient) {
    this.numberOfPages = new Subject();
    this.pagesInput = new Subject();
    this.pagesOutput = this.pagesInput.pipe(
      map((page) => {
        return new HttpParams()
          .set('apiKey', this.apiKey)
          .set('country', this.country)
          .set('pageSize', String(this.pageSize))
          .set('page', page.toString());
      }),
      switchMap((params) => {
        return this.http.get<NewsApiResponse>(this.url, { params });
      }),
      tap((response) => {
        const totalPages = Math.ceil(response.totalResults / this.pageSize);
        this.numberOfPages.next(totalPages);
      }),
      map((response) => response.articles)
    );
  }

  getPage(page: number) {
    this.pagesInput.next(page);
  }
}
