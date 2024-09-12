import {Inject, Injectable} from '@angular/core';
import {Resource, NavigationItem, environmentToken} from "safecility-admin-services";
import { BehaviorSubject, Observable, delay, map, of, timer} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Company} from "./company.model";

export interface NewCompany {
  uid: string
  name: string
}

export interface CompanyEmit {
  company: NewCompany
  valid: boolean
}

interface environment {
  api: {
    microservices: boolean
    company: string
  }
}

const authHeaders = new HttpHeaders(
  {
    "Access-Control-Allow-Headers": "Origin, Authorization",
  }
)

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  options = {}

  constructor(
    @Inject(environmentToken) private environment: environment,
    private httpClient: HttpClient,
    ) {
    if (environment.api.microservices)
      this.options = {headers: authHeaders, withCredentials: true}
  }

  uidExists(uid: string): Observable<boolean> {
    let companyURL = `${this.environment.api.company}/company/uid/${uid}`;
    return this.httpClient.get<Company>(companyURL).pipe(map( x => {
      return !!x
    }));
  }

  addCompany(newCompany: NewCompany): Observable<boolean> {
    let companyURL = `${this.environment.api.company}/company`;
    return this.httpClient.post<Company>(companyURL, newCompany).pipe(map( x => {
      return !!x
    }));
  }

  archiveCompany(uid: string): Observable<boolean> {
    let companyURL = `${this.environment.api.company}/company/uid/${uid}/archive`;
    return this.httpClient.put<Company>(companyURL, {uid, action: 'archive'}, this.options).pipe(map( x => {
      return !!x
    }));
  }

  getCompanyList(): Observable<Array<Resource> | undefined> {
    console.log("getting company", this.environment.api.company)
    let companyURL = `${this.environment.api.company}/company/list`;
    return this.httpClient.get<Array<Resource>>(companyURL, this.options)
  }

  getCompany(uid: string) : Observable<Company | undefined> {
    console.log("getting company", this.environment.api.company)
    let companyURL = `${this.environment.api.company}/company/uid/${uid}`;
    return this.httpClient.get<Company>(companyURL, this.options);
  }

  getViewList(company: NavigationItem) : Observable<Array<Resource> | undefined> {
    let companyURL = `${this.environment.api.company}/company/view/list/${company.uid}`;
    return this.httpClient.get<Array<NavigationItem>>(companyURL, this.options);
  }

}
