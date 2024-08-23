import {Component, Input} from '@angular/core';
import {NavigationItem, SliderPanel} from "safecility-admin-services";
import {MatDivider} from "@angular/material/divider";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatMiniFabButton} from "@angular/material/button";
import {LocationsService} from "../../locations.service";

@Component({
  selector: 'lib-location-roleout',
  standalone: true,
  imports: [
    MatDivider,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatMiniFabButton,
    MatMenuTrigger
  ],
  templateUrl: './location-roleout.component.html',
  styleUrl: './location-roleout.component.css'
})
export class LocationRoleoutComponent implements SliderPanel {

  @Input() parent: NavigationItem | undefined
  root: NavigationItem | undefined;

  @Input() set setLocation(location: NavigationItem | undefined) {
    this.location = location;
    if (!this.parent || ! this.parent.path) {
      console.warn("we need parent path to calculate root")
      return;
    }
    if (!location) {
      this.root = undefined;
      return;
    }
    const path = this.parent.path.map(x => x).concat({name: location.name, uid: location.uid});
    this.root = {name: location.name, uid: location.uid, path};
  }
  location: NavigationItem | undefined

  constructor(private locationsService: LocationsService) {
  }

  archiveLocation() {
    if (!this.location)
      return
    this.locationsService.archiveLocation(this.location.uid)
  }

}
