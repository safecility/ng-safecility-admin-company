import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, map, of, timer} from "rxjs";
import { Breadcrumb, NavigationItem } from "safecility-admin-services";
import {Company} from "../company/company.model";

const sourceLocations = [
  {name: "Safecility", uid: "safecility", company: "safecility", path: [
      {name: "company", pathElement: "company"}, {name: "Safecility", pathElement: "safecility"},
      {name: "locations", pathElement: "locations"}, {name: "HQ", pathElement: "hq"}
    ] as Array<Breadcrumb>},
  {name: "HQ", uid: "hq", company: "big-corp", path: [
      {name: "company", pathElement: "company"}, {name: "Big Corp", pathElement: "big-corp"},
      {name: "locations", pathElement: "locations"}, {name: "HQ", pathElement: "hq"}
    ] },
  {name: "HQ First Floor", uid: "hq-floor1", company: "big-corp", path: [
      {name: "company", pathElement: "company"}, {name: "Big Corp", pathElement: "big-corp"},
      {name: "locations", pathElement: "locations"},
      {name: "HQ First Floor", pathElement: "hq-floor1"}
    ] },
  {name: "HQ Second Floor", uid: "hq-floor2", company: "big-corp", path: [
      {name: "company", pathElement: "company"}, {name: "Big Corp", pathElement: "big-corp"},
      {name: "locations", pathElement: "locations"},
      {name: "HQ Second Floor", pathElement: "hq-floor2"}
    ] },
  {name: "Small Corp HQ", uid: "small-corp-hq", company: "small-corp", path:  [
      {name: "company", pathElement: "company"}, {name: "Small Corp", pathElement: "small-corp"},
      {name: "locations", pathElement: "locations"}, {name: "Small Corp HQ", pathElement: "small-corp-hq"}
    ]},
]

export interface NewLocation {
  uid: string
  name: string
  company: Company
}

export interface LocationEmit {
  location: NewLocation
  valid: boolean
}

@Injectable({
  providedIn: 'root'
})
export class LocationsService {

  locations = new BehaviorSubject<Array<NavigationItem>>(sourceLocations)

  uidExists(uid: string): Observable<boolean> {
    return of(this.locations.value.reduce((p, c) => {
      if (c.uid === uid)
        p = true
      return p
    }, false)).pipe(delay(300))
  }

  addLocation(newLocation: NewLocation): Observable<boolean> {
    return timer(300).pipe(map(_=> {
      let current = this.locations.value;
      current.push( {name: newLocation.name, uid: newLocation.uid, path:  [
          {name: "location", pathElement: "location"}, {name: newLocation.name, pathElement: newLocation.uid}
        ]},)
      this.locations.next(current);
      return true
    }))
  }

  archiveLocation(uid: string): Observable<boolean> {
    return timer(200).pipe(map(_ => {
      this.locations.next(this.locations.value.filter(x => x.uid !== uid));
      return true
    }))
  }

  getLocationList(company: NavigationItem): Observable<Array<NavigationItem> | undefined> {
    return this.locations
  }

}
