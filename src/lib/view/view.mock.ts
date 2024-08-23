import { Injectable } from '@angular/core';
import {View} from "./view.model";
import {delay, Observable, of} from "rxjs";

const safecilityViews = new Map<string, View>(
  [["dali", {
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
  }]]
)

@Injectable({
  providedIn: 'root'
})
export class ViewMock {

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
