import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, map, of, timer} from "rxjs";
import { Resource, NavigationItem } from "safecility-admin-services";
import {Company} from "../company/company.model";

const sourceLocations = [
  {name: "Safecility", uid: "safecility", company: "safecility", path: [
      {name: "company", uid: "company"}, {name: "Safecility", uid: "safecility"},
      {name: "locations", uid: "locations"}, {name: "HQ", uid: "hq"}
    ] as Array<Resource>},
  {name: "HQ", uid: "hq", company: "big-corp", path: [
      {name: "company", uid: "company"}, {name: "Big Corp", uid: "big-corp"},
      {name: "locations", uid: "locations"}, {name: "HQ", uid: "hq"}
    ] },
  {name: "HQ First Floor", uid: "hq-floor1", company: "big-corp", path: [
      {name: "company", uid: "company"}, {name: "Big Corp", uid: "big-corp"},
      {name: "locations", uid: "locations"},
      {name: "HQ First Floor", uid: "hq-floor1"}
    ] },
  {name: "HQ Second Floor", uid: "hq-floor2", company: "big-corp", path: [
      {name: "company", uid: "company"}, {name: "Big Corp", uid: "big-corp"},
      {name: "locations", uid: "locations"},
      {name: "HQ Second Floor", uid: "hq-floor2"}
    ] },
  {name: "Small Corp HQ", uid: "small-corp-hq", company: "small-corp", path:  [
      {name: "company", uid: "company"}, {name: "Small Corp", uid: "small-corp"},
      {name: "locations", uid: "locations"}, {name: "Small Corp HQ", uid: "small-corp-hq"}
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
          {name: "location", uid: "location"}, {name: newLocation.name, uid: newLocation.uid}
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
