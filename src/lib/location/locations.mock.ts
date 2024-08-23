import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, map, of, timer} from "rxjs";
import { Resource, NavigationItem } from "safecility-admin-services";
import { NewLocation} from "./locations.service";
import {Company} from "../company/company.model";

const sourceLocations = [
  {name: "HQ", uid: "hq", company: "safecility", path: [
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

interface typedNavigationItem extends NavigationItem {
  company: string
}

@Injectable({
  providedIn: 'root'
})
export class LocationsMock {

  locations = new BehaviorSubject<Array<typedNavigationItem>>(sourceLocations)

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
      current.push( {name: newLocation.name, uid: newLocation.uid, company: newLocation.company.uid, path:  [
          {name: "company", uid: "company"}, {name: newLocation.company.name, uid: newLocation.company.uid},
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

  getLocationList(company: Company): Observable<Array<NavigationItem> | undefined> {
    return this.locations.pipe(delay(400), map( (a) => {
      if (!a)
        return []
      return a.filter(u => !!u).filter(x => !x || x.company === company.uid) as Array<NavigationItem>
    }))
  }

}
