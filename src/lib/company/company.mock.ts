import { BehaviorSubject, Observable, delay, map, of, timer} from "rxjs";
import { Injectable } from "@angular/core";
import { Resource, NavigationItem, UID} from "safecility-admin-services";
import {NewCompany} from "./company.service";

let sourceCompanies: Array<NavigationItem> = [
  {name: "Safecility", uid: "safecility", path: [
      {name: "company", uid: "company"}, {name: "Safecility", uid: "safecility"}
    ] as Array<Resource>},
  {name: "Big Corp", uid: "big-corp", path: [
      {name: "company", uid: "company"}, {name: "Big Corp", uid: "big-corp"}
    ] },
  {name: "Small Corp", uid: "small-corp", path:  [
      {name: "company", uid: "company"}, {name: "Small Corp", uid: "small-corp"}
    ]},
  {name: "Mock Corp", uid: "mock-corp", path:  [
      {name: "company", uid: "company"}, {name: "Mock Corp", uid: "mock-corp"}
    ]},
]

@Injectable({
  providedIn: 'root'
})
export class CompanyMock {

  companies = new BehaviorSubject<Array<NavigationItem>>(sourceCompanies)

  constructor() {
    console.log("companyMock");
  }

  uidExists(uid: string): Observable<boolean> {
    return of(this.companies.value.reduce((p, c) => {
      if (c.uid === uid)
        p = true
      return p
    }, false)).pipe(delay(300))
  }

  addCompany(newCompany: NewCompany): Observable<boolean> {
    return timer(200).pipe(map(_=> {
      let current = this.companies.value;
      current.push( {name: newCompany.name, uid: newCompany.uid, path:  [
          {name: "company", uid: "company"}, {name: newCompany.name, uid: newCompany.uid}
        ]},)
      this.companies.next(current);
      return true
    }))
  }

  archiveCompany(uid: string): Observable<boolean> {
    const newCompanies = this.companies.value.filter(x => x.uid !== uid);
    this.companies.next(newCompanies);
    return timer(200).pipe(map(_ => {
      return true
    }))
  }

  getCompanyList() : Observable<Array<NavigationItem> | undefined> {
    return this.companies.pipe(delay(400))
  }

  getViewList(company: NavigationItem) : Observable<Array<NavigationItem> | undefined> {

    console.log("getting views for: ", company);

    if (company.uid === "big-corp")
      return of([
        {name: "Solar Power", uid: "power-solar", path: [
            {name: "views", uid: "views"}, {name: "Solar Power", uid: "power-solar"}
          ] },
        {name: "Mock Power", uid: "power-mock", path:  [
            {name: "views", uid: "views"}, {name: "Mock Power", uid: "power-mock"}
          ]},
    ]).pipe(delay(200))
    return of([
      {name: "Dali", uid: "dali", path: [
          {name: "views", uid: "views"}, {name: "Dali", uid: "dali"}
        ] as Array<Resource>},
      {name: "Solar Power", uid: "power-solar", path: [
          {name: "views", uid: "views"}, {name: "Solar Power", uid: "power-solar"}
        ] },
      {name: "Three Phase Power", uid: "power-three-phase", path:  [
          {name: "views", uid: "views"}, {name: "Three Phase Power", uid: "power-three-phase"}
        ]},
      {name: "Mock Power", uid: "power-mock", path:  [
          {name: "views", uid: "views"}, {name: "Mock Power", uid: "power-mock"}
        ]},
    ]).pipe(delay(200))
  }
}

