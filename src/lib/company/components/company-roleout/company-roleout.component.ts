import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {MatListItem, MatListOption, MatSelectionList} from "@angular/material/list";
import {MatDivider} from "@angular/material/divider";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton, MatMiniFabButton} from "@angular/material/button";
import {Subscription, timer} from "rxjs";

import {EditAction, fadeTrigger, NavigationItem, SliderPanel, Sliders, SliderService} from "safecility-admin-services";
import {ViewNavRoleoutComponent} from "../view-nav-roleout/view-nav-roleout.component";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";

const roots: Array<NavigationItem> = [
  {name: "views", uid: "views", path: [
    {name: "views", pathElement: "views"}]},
  {name: "locations", uid: "locations", path: [
    {name: "locations", pathElement: "locations"}]},
  {name: "users", uid: "users" , path: [
    {name: "users", pathElement: "users"}]}]

@Component({
  selector: 'lib-company-roleout',
  standalone: true,
  imports: [
    MatListItem,
    MatListOption,
    MatSelectionList,
    ViewNavRoleoutComponent,
    MatDivider,
    MatIcon,
    MatMiniFabButton,
    MatIconButton,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem
  ],
  templateUrl: './company-roleout.component.html',
  styleUrl: './company-roleout.component.css',
  animations: [fadeTrigger],
})
export class CompanyRoleoutComponent implements SliderPanel, OnDestroy {

  @Input() index = 2;

  @Input() set company(company: NavigationItem | undefined) {
    if (!company)
      return;
    if (!company.path) {
      console.error("company must have a path", company);
      return;
    }
    this.list = roots.map((item: NavigationItem) => {
      let itemPath = item.path;
      if (!itemPath) {
        console.error("item should have a path", item);
        itemPath = [];
      }
      // @ts-ignore
      return {name: item.name, uid: item.uid, path: company.path.concat(itemPath)};
    })
    this._company = company;
  };
  _company: NavigationItem | undefined;

  @Output() companyChanged = new EventEmitter<EditAction>();

  list: Array<NavigationItem> | undefined;

  listSelection: NavigationItem | undefined;

  showSubmenu = "closed";

  sliderSubscription: Subscription | undefined;

  constructor(
    private sliderService: SliderService,
  ) {
    this.sliderSubscription = this.sliderService.sliderNavigation(Sliders.NavSlider)?.subscribe({
      next: value => {
        if (!value || !value.path) {
          this.clearCompanyDisplay();
          return;
        }
        const index = value.path.length;
        if (index < this.index) {
          this.clearCompanyDisplay();
        }
        if (index <= this.index) {
          this.showSubmenu = "closed";
          timer(300).subscribe({
            next: _ => {
              this.listSelection = undefined;
            }
          })
        }
      }
    })
  }

  clearCompanyDisplay() {
    timer(300).subscribe({
      next: _ => {
        this._company = undefined
      }
    })
  }

  listChange(item: NavigationItem) {
    this.sliderService.updateSliderNavigation(Sliders.NavSlider, item);
    this.listSelection = item;
    this.showSubmenu = "open";
  }

  ngOnDestroy(): void {
    this.sliderSubscription?.unsubscribe();
  }

  archiveCompany() {
    this.companyChanged.emit({action: "archive", item: this._company})
  }
}
