import {Component, Input, OnDestroy} from '@angular/core';
import {EditorService, NavigationItem, SliderPanel, Sliders, SliderService} from "safecility-admin-services";
import {Subscription} from "rxjs";
import {LocationsService} from "../../locations.service";
import {MatDivider} from "@angular/material/divider";
import {MatIcon} from "@angular/material/icon";
import {MatListItem, MatListOption, MatSelectionList} from "@angular/material/list";
import {MatMiniFabButton} from "@angular/material/button";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {ViewRoleoutComponent} from "../../../view/components/view-roleout/view-roleout.component";
import {LocationRoleoutComponent} from "../location-roleout/location-roleout.component";

@Component({
  selector: 'lib-location-nav-roleout',
  standalone: true,
  imports: [
    MatDivider,
    MatIcon,
    MatListItem,
    MatListOption,
    MatMiniFabButton,
    MatProgressSpinner,
    MatSelectionList,
    ViewRoleoutComponent,
    LocationRoleoutComponent
  ],
  templateUrl: './location-nav-roleout.component.html',
  styleUrl: './location-nav-roleout.component.css'
})
export class LocationNavRoleoutComponent implements SliderPanel, OnDestroy {

  @Input() set setParent(parent: NavigationItem | undefined) {
    if (!parent || !parent.path)
      return;
    const path = parent.path.map(x => x).concat({name: "locations", uid: "locations"})
    this.root = {name: "locations", uid: "locations", path}
  }
  root: NavigationItem | undefined;
  selectedLocation: NavigationItem | undefined;

  locationOptions: Array<NavigationItem> | undefined;

  @Input() set setCompany(company: NavigationItem | undefined) {
    this.company = company;
    this.getLocations();
  }
  company: NavigationItem | undefined;

  ngOnDestroy(): void {
    this.sliderSubscription?.unsubscribe();
  }

  sliderSubscription: Subscription | undefined;
  isLoadingResults: boolean = true;

  constructor(
    private locationService: LocationsService,
    private editorService: EditorService,
    private sliderService: SliderService,
  ) {
    this.sliderSubscription = this.sliderService.sliderNavigation(Sliders.NavSlider)?.subscribe({
      next: value => {
        if (!value || !value.path) {
          this.company = undefined;
          return;
        }
        if (!this.root || !this.root.path) {
          console.warn("we need root to update state")
          return
        }
        const componentSliderIndex = this.root?.path?.length;
        const navigationIndex = value.path.length;
        if (navigationIndex < componentSliderIndex) {
          this.company = undefined;
        }
      }
    })
  }

  navigate(item: NavigationItem | undefined) {
    this.sliderService.updateSliderNavigation(Sliders.NavSlider, item);
    this.selectedLocation = item;
  }

  openEditor() {
    this.editorService.setEditor({id: "view", state: "open"})
  }

  getLocations(): void {
    if (!this.company) {
      console.error("locations need a company to work")
      return;
    }
    this.locationService.getLocationList(this.company).subscribe({
      complete(): void {
      },
      next: (data: Array<NavigationItem> | undefined) => {
        if (data && data.length > 0) {
          if (!this.company){
            console.error("company must be set")
            return
          }
          if (!this.company.path){
            console.error("company path must be set")
            return
          }

        }
        this.locationOptions = data;
        this.isLoadingResults = false;
      },
      error: (err: Error) => {
        console.error(err);
      }
    })
  }

}
