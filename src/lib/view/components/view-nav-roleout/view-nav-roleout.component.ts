import {Component, Input, OnDestroy} from '@angular/core';
import {MatDivider} from "@angular/material/divider";
import {MatIcon} from "@angular/material/icon";
import {MatListItem, MatListOption, MatSelectionList} from "@angular/material/list";
import {MatMiniFabButton} from "@angular/material/button";
import {Subscription} from "rxjs";

import {
  EditorService,
  SliderPanel,
  SliderService,
  NavigationItem,
  Sliders,
  Resource,
  MatchNavigationItem
} from "safecility-admin-services";
import { ViewRoleoutComponent } from "../view-roleout/view-roleout.component";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { CompanyService } from "../../../company/company.service";
import {View} from "../../view.model";

@Component({
  selector: 'lib-view-nav-roleout',
  standalone: true,
  imports: [
    MatDivider,
    MatIcon,
    MatListItem,
    MatListOption,
    MatMiniFabButton,
    MatSelectionList,
    ViewRoleoutComponent,
    MatProgressSpinner
  ],
  templateUrl: './view-nav-roleout.component.html',
  styleUrl: './view-nav-roleout.component.css'
})
export class ViewNavRoleoutComponent implements SliderPanel, OnDestroy {

  @Input() parent: NavigationItem | undefined;
  root: NavigationItem | undefined;

  viewOptions: Array<View> | undefined;

  selectedView: View | undefined;


  @Input() set setCompany(company: NavigationItem | undefined) {
    if (!company) {
      this.company = undefined;
      return;
    }
    this.company = {name: company.name, uid: company.uid, path: company.path?.map(x => x)};
    this.getViews();
    if (!company) {
      this.root = undefined;
      return;
    }
    if (!this.parent || !this.parent.path) {
      console.warn("need parent to calculate root")
      return;
    }
    const path = this.parent.path.map(x => x).concat( {name: "view", uid: "view"})
    console.log("view path ", path);
    this.root = {name: "view", uid: "view", path};
  }
  company: NavigationItem | undefined;

  ngOnDestroy(): void {
    this.sliderSubscription?.unsubscribe();
  }

  sliderSubscription: Subscription | undefined;
  isLoadingResults: boolean = true;

  constructor(
    private companyService: CompanyService,
    private editorService: EditorService,
    private sliderService: SliderService,
  ) {
    this.sliderSubscription = this.sliderService.sliderNavigation(Sliders.NavSlider)?.subscribe({
      next: value => {
        const match = MatchNavigationItem(value, this.root)
        if (match <= 0)
          this.reset();
      }
    })
  }

  reset() {
    this.selectedView = undefined;
  }

  navigate(item: View | undefined) {
    this.sliderService.updateSliderNavigation(Sliders.NavSlider, item);
    this.selectedView = item;
  }

  openEditor() {
    this.editorService.setEditor({id: "view", state: "open"})
  }

  getViews(): void {

    if (!this.company) {
      this.viewOptions = undefined;
      return;
    }

    this.isLoadingResults = true;
    this.companyService.getViewList(this.company).subscribe({
      complete(): void {
      },
      next: (data: Array<NavigationItem> | undefined) => {
        if (data && data.length > 0) {
          if (!this.company){
            console.error("company must be set")
            return
          }
          let path: Array<Resource> = []
          if (!this.root || !this.root.path) {
            console.log("we need root for slider navigation")
          } else {
            path = this.root.path.map(x => x);
          }
          data = data.map((item: NavigationItem) => {
            let viewPath = path.map(x => x).concat({name: item.name, uid: item.uid})
            return {name: item.name, uid: item.uid, path: viewPath, company: this.company}
          })
        }
        this.viewOptions = data as Array<View>;
        this.isLoadingResults = false;
      },
      error: (err: Error) => {
        console.error(err);
      }
    })
  }

}
