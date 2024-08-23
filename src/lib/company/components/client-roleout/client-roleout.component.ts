import {Component, Input} from '@angular/core';
import {MatchNavigationItem, NavigationItem, SliderPanel, Sliders, SliderService} from "safecility-admin-services";
import {MatDivider} from "@angular/material/divider";
import {MatListItem, MatListOption, MatSelectionList} from "@angular/material/list";
import {ViewNavRoleoutComponent} from "../../../view/components/view-nav-roleout/view-nav-roleout.component";
import {JsonPipe} from "@angular/common";
import {
  LocationNavRoleoutComponent
} from "../../../location/components/location-nav-roleout/location-nav-roleout.component";

const routes = [{name:"views", uid:"views", path: [
    {name: "clients", uid: "clients"}, {name: "views", uid: "views"}
  ]}, {name:"locations", uid:"locations", path: [
  {name: "clients", uid: "clients"}, {name: "locations", uid: "locations"}
]}];

@Component({
  selector: 'lib-client-roleout',
  standalone: true,
  imports: [
    MatDivider,
    MatListItem,
    MatListOption,
    MatSelectionList,
    ViewNavRoleoutComponent,
    JsonPipe,
    LocationNavRoleoutComponent
  ],
  templateUrl: './client-roleout.component.html',
  styleUrl: './client-roleout.component.css'
})
export class ClientRoleoutComponent implements SliderPanel{

  @Input() company: NavigationItem | undefined;

  @Input() set setParent( parent: NavigationItem | undefined) {
    if (!parent || ! parent.path) {
      console.warn("we need parent to setup root")
      return;
    }
    const path = parent.path.map(x => x).concat({name: "clients", uid: "clients"})
    this.root = {name: "clients", uid: "clients", path};
    this.clientRoutes = routes.map( x => {
      const clientPath = path.map(x => x).concat({name: x.name, uid: x.uid});
      return {name: x.name, uid: x.uid, path: clientPath};
    })
  }
  root: NavigationItem | undefined;
  clientRoutes : Array<NavigationItem> | undefined;

  selectedRoute: NavigationItem | undefined

  constructor(private sliderService: SliderService,
  ) {
    this.sliderService.sliderNavigation(Sliders.NavSlider)?.subscribe({
      next: (change: NavigationItem | undefined) => {
        if (change && change.path) {
          if (!this.root || !this.root.path) {
            console.warn("we need root to calculate slider operation")
            return;
          }

          const match = MatchNavigationItem(change, this.root);
          if (match <=0 ) {
            this.reset();
          }
        }
      }
    })
  }

  reset() {
    this.selectedRoute = undefined
  }

  openSubmenu(item: NavigationItem) {
    this.selectedRoute = item;
    this.sliderService.updateSliderNavigation(Sliders.NavSlider, item);
  }
}
