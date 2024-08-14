import {Component, Input, OnDestroy} from '@angular/core';
import {MatDivider} from "@angular/material/divider";
import {MatIcon} from "@angular/material/icon";
import {MatListItem, MatListOption, MatSelectionList} from "@angular/material/list";
import {MatMiniFabButton} from "@angular/material/button";
import {Subscription} from "rxjs";

import { EditorService, SliderPanel, SliderService, NavigationItem, Sliders } from "safecility-admin-services";
import { CompanyService } from "../../company.service";
import { ViewRoleoutComponent } from "../view-roleout/view-roleout.component";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

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

  @Input() index = 3;

  list: Array<NavigationItem> | undefined;

  view: NavigationItem | undefined;

  @Input() set company(company: NavigationItem | undefined) {
    this._company = company;
    this.getViews();
  }
  _company: NavigationItem | undefined;

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
    this.view = item;
  }

  openEditor() {
    this.editorService.setEditor({id: "view", state: "open"})
  }

  getViews(): void {
    if (!this._company) {
      console.error("views need a company to work")
      return;
    }
    this.companyService.getViewList(this._company).subscribe({
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
          data = data.map((item: NavigationItem) => {
            let itemPath = item.path;
            if (!itemPath) {
              console.error("item should have a path", item);
              itemPath = [];
            }
            // @ts-ignore
            return {name: item.name, uid: item.uid, path: this._company.path.concat(itemPath)}
          })
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
