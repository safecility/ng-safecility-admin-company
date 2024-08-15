import {Component, Input} from '@angular/core';
import {EditorService, NavigationItem, Sliders, SliderService} from "safecility-admin-services";
import {Subscription} from "rxjs";
import {LocationsService} from "../../locations.service";
import {MatDivider} from "@angular/material/divider";
import {MatIcon} from "@angular/material/icon";
import {MatListItem, MatListOption, MatSelectionList} from "@angular/material/list";
import {MatMiniFabButton} from "@angular/material/button";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {ViewRoleoutComponent} from "../../../company/components/view-roleout/view-roleout.component";
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
export class LocationNavRoleoutComponent {

  @Input() index = 3;

  list: Array<NavigationItem> | undefined;

  location: NavigationItem | undefined;

  @Input() set company(company: NavigationItem | undefined) {
    this._company = company;
    this.getLocations();
  }
  _company: NavigationItem | undefined;

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
          this._company = undefined;
          return;
        }
        const index = value.path.length;
        if (index < this.index) {
          this._company = undefined;
        }
      }
    })
  }

  navigate(item: NavigationItem | undefined) {
    this.sliderService.updateSliderNavigation(Sliders.NavSlider, item);
    this.location = item;
  }

  openEditor() {
    this.editorService.setEditor({id: "view", state: "open"})
  }

  getLocations(): void {
    if (!this._company) {
      console.error("locations need a company to work")
      return;
    }
    this.locationService.getLocationList(this._company).subscribe({
      complete(): void {
      },
      next: (data: Array<NavigationItem> | undefined) => {
        if (data && data.length > 0) {
          if (!this._company){
            console.error("company must be set")
            return
          }
          if (!this._company.path){
            console.error("company path must be set")
            return
          }

        }
        this.list = data;
        this.isLoadingResults = false;
      },
      error: (err: Error) => {
        console.error(err);
      }
    })
  }

}
