import { Injectable } from '@angular/core';
import { Breadcrumb, NavigationItem} from "safecility-admin-services";
import { BehaviorSubject, Observable, delay, map, of, timer} from "rxjs";

const sourceCompanies = [
  {name: "Safecility", uid: "safecility", path: [
      {name: "company", pathElement: "company"}, {name: "Safecility", pathElement: "safecility"}
    ] as Array<Breadcrumb>},
  {name: "Big Corp", uid: "big-corp", path: [
      {name: "company", pathElement: "company"}, {name: "Big Corp", pathElement: "big-corp"}
    ] },
  {name: "Small Corp", uid: "small-corp", path:  [
      {name: "company", pathElement: "company"}, {name: "Small Corp", pathElement: "small-corp"}
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

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  companies = new BehaviorSubject<Array<NavigationItem>>(sourceCompanies)

  constructor() { }

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
          {name: "company", pathElement: "company"}, {name: newCompany.name, pathElement: newCompany.uid}
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
    return this.companies.pipe(delay(400))
  }

  getViewList(company: NavigationItem) : Observable<Array<NavigationItem> | undefined> {
    return of([
      {name: "Dali", uid: "safecility", path: [
          {name: "views", pathElement: "views"}, {name: "Dali", pathElement: "dali"}
        ] as Array<Breadcrumb>},
      {name: "Solar Power", uid: "power-solar", path: [
          {name: "views", pathElement: "views"}, {name: "Solar Power", pathElement: "power-solar"}
        ] },
      {name: "Three Phase Power", uid: "power-three-phase", path:  [
          {name: "views", pathElement: "views"}, {name: "Three Phase Power", pathElement: "power-three-phase"}
        ]},
    ])
  }

}
