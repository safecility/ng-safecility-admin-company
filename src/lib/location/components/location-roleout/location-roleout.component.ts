import {Component, Input} from '@angular/core';
import {NavigationItem} from "safecility-admin-services";
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
export class LocationRoleoutComponent {

  @Input() location: NavigationItem | undefined;

  constructor(private locationsService: LocationsService) {
  }

  archiveLocation() {
    if (!this.location)
      return
    this.locationsService.archiveLocation(this.location.uid)
  }
}
