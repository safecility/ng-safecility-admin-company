import { Injectable } from '@angular/core';
import {View} from "./view.model";
import {delay, Observable, of} from "rxjs";

const safecilityViews = new Map<string, View>(
  [
    ["dali", {
    name: "dali",
    uid: "dali",
    path: undefined,
    company: {
      name: "Safecility",
      uid: "safecility",
      path: undefined,
    },
    active: true,
    app: "dali",
    }],
    ["power-solar", {
      name: "Solar Power",
      uid: "power-solar",
      path: undefined,
      company: {
        name: "Safecility",
        uid: "safecility",
        path: undefined,
      },
      active: true,
      app: "power",
    }],
    ["power-three-phase", {
      name: "Three Phase Power",
      uid: "power-three-phase",
      path: undefined,
      company: {
        name: "Safecility",
        uid: "safecility",
        path: undefined,
      },
      active: false,
      app: "power",
    }]
  ],
)

@Injectable({
  providedIn: 'root'
})
export class ViewService {

  constructor() { }

  getView(view: View): Observable<View | undefined> {
    let lu: View | undefined;
    switch (view.company.uid) {
      case "safecility":
        lu = safecilityViews.get(view.uid)
    }
    return of(lu).pipe(delay(200))
  }

}
