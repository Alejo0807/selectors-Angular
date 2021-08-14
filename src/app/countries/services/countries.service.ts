import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConutrySmall, Country } from '../interfaces/countries.interface';
import { combineLatest, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  apiUrl: string = 'https://restcountries.eu/rest/v2';

  private _regions: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regions(): string[] {
    return [...this._regions];
  }


  constructor(private http: HttpClient) { }

  getCountriesByRegion( region: string ): Observable<ConutrySmall[]> {
    if (!region) return of([]);
    return this.http.get<ConutrySmall[]>(`${this.apiUrl}/region/${region}?fields=alpha3Code;name`)
  } 

  
  getCountryByCode( country: string ): Observable<Country | null> {
    if (!country) return of(null);
    return this.http.get<Country>(`${this.apiUrl}/alpha/${country}?fields=borders;name;alpha3Code`)
  }
  
  getCountrySmallByCode( code: string ): Observable<ConutrySmall> {
    // if (!code) return of( null;
    return this.http.get<ConutrySmall>(`${this.apiUrl}/alpha/${code}?fields=alpha3Code;name`)
  }

  getCountriesByCode( codes: string[]): Observable<ConutrySmall[]> {
    if (!codes) return of([]);

    const fetchs: Observable<ConutrySmall>[] = [];

    codes.forEach( code => {
      const fetch = this.getCountrySmallByCode(code);
      fetchs.push(fetch);
    })

    return combineLatest(fetchs);


  }
}
