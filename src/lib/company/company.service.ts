import {Inject, Injectable} from '@angular/core';
import {Resource, NavigationItem, environmentToken} from "safecility-admin-services";
import { BehaviorSubject, Observable, delay, map, of, timer} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";

const sourceCompanies = [
  {name: "Safecility", uid: "safecility", path: [
      {name: "company", uid: "company"}, {name: "Safecility", uid: "safecility"}
    ] as Array<Resource>},
  {name: "Big Corp", uid: "big-corp", path: [
      {name: "company", uid: "company"}, {name: "Big Corp", uid: "big-corp"}
    ] },
  {name: "Small Corp", uid: "small-corp", path:  [
      {name: "company", uid: "company"}, {name: "Small Corp", uid: "small-corp"}
    ]},
]

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

  companies = new BehaviorSubject<Array<NavigationItem>>(sourceCompanies)

  constructor(
    @Inject(environmentToken) private environment: environment,
    private httpClient: HttpClient,
    ) { }

  uidExists(uid: string): Observable<boolean> {
    return of(this.companies.value.reduce((p, c) => {
      if (c.uid === uid)
        p = true
      return p
    }, false)).pipe(delay(300))
  }

  addCompany(newCompany: NewCompany): Observable<boolean> {
    return timer(300).pipe(map(_=> {
      let current = this.companies.value;
      current.push( {name: newCompany.name, uid: newCompany.uid, path:  [
          {name: "company", uid: "company"}, {name: newCompany.name, uid: newCompany.uid}
        ]},)
      this.companies.next(current);
      return true
    }))
  }

  archiveCompany(uid: string): Observable<boolean> {
    return timer(200).pipe(map(_ => {
      this.companies.next(this.companies.value.filter(x => x.uid !== uid));
      return true
    }))
  }

  getCompanyList(): Observable<Array<NavigationItem> | undefined> {
    console.log("getting device", this.environment.api.company)
    let companyURL = `${this.environment.api.company}/company/list`;
    return this.httpClient.get<Array<NavigationItem>>(companyURL, {headers: authHeaders, withCredentials: true})
  }

  getViewList(company: NavigationItem) : Observable<Array<NavigationItem> | undefined> {
    return of([
      {name: "Dali", uid: "safecility", path: [
          {name: "views", uid: "views"}, {name: "Dali", uid: "dali"}
        ] as Array<Resource>},
      {name: "Solar Power", uid: "power-solar", path: [
          {name: "views", uid: "views"}, {name: "Solar Power", uid: "power-solar"}
        ] },
      {name: "Three Phase Power", uid: "power-three-phase", path:  [
          {name: "views", uid: "views"}, {name: "Three Phase Power", uid: "power-three-phase"}
        ]},
    ])
  }

}
