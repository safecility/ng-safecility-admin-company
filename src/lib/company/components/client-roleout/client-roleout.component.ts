import {Component, Input} from '@angular/core';
import {NavigationItem, Sliders, SliderService} from "safecility-admin-services";
import {MatDivider} from "@angular/material/divider";
import {MatListItem, MatListOption, MatSelectionList} from "@angular/material/list";
import {ViewNavRoleoutComponent} from "../view-nav-roleout/view-nav-roleout.component";
import {JsonPipe} from "@angular/common";
import {
  LocationNavRoleoutComponent
} from "../../../location/components/location-nav-roleout/location-nav-roleout.component";

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
export class ClientRoleoutComponent {

  @Input() company: NavigationItem | undefined;

  @Input() clientRoots: Array<NavigationItem> = [
    {name:"views", uid:"views", path: [
        {name: "clients", pathElement: "clients"}, {name: "views", pathElement: "views"}
      ]}, {name:"locations", uid:"locations", path: [
        {name: "clients", pathElement: "clients"}, {name: "locations", pathElement: "locations"}
      ]}];

  @Input() index = 1;

  nav: NavigationItem | undefined

  constructor(private sliderService: SliderService,
  ) {
    this.sliderService.sliderNavigation(Sliders.NavSlider)?.subscribe({
      next: (change: NavigationItem | undefined) => {
        if (change && change.path) {
          console.log("path change", change.path.length);
          if (change.path.length <= this.index) {
            this.nav = undefined;
            return;
          }
          else if (change.path.length !== this.index + 1)
            return;
        }
        if (!this.nav || !change || (change.uid !== this.nav.uid)) {
          this.nav = change;
        }
      }
    })
  }

  subMenu(item: NavigationItem) {
    this.sliderService.updateSliderNavigation(Sliders.NavSlider, item);
  }
}
