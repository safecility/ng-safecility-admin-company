import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {MatListItem, MatListOption, MatSelectionList} from "@angular/material/list";
import {MatDivider} from "@angular/material/divider";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton, MatMiniFabButton} from "@angular/material/button";
import {Subscription, timer} from "rxjs";

import {
  EditAction,
  fadeTrigger,
  MatchNavigationItem,
  NavigationItem,
  SliderPanel,
  Sliders,
  SliderService
} from "safecility-admin-services";
import {ViewNavRoleoutComponent} from "../../../view/components/view-nav-roleout/view-nav-roleout.component";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {
  LocationNavRoleoutComponent
} from "../../../location/components/location-nav-roleout/location-nav-roleout.component";
import {JsonPipe} from "@angular/common";

const companySubMenus: Array<NavigationItem> = [
  {name: "views", uid: "views", path: [
    {name: "views", uid: "views"}]},
  {name: "locations", uid: "locations", path: [
    {name: "locations", uid: "locations"}]},
  {name: "users", uid: "users" , path: [
    {name: "users", uid: "users"}]}]

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
    MatMenuItem,
    LocationNavRoleoutComponent,
    JsonPipe
  ],
  templateUrl: './company-roleout.component.html',
  styleUrl: './company-roleout.component.css',
  animations: [fadeTrigger],
})
export class CompanyRoleoutComponent implements SliderPanel, OnDestroy {

  @Input() parent: NavigationItem | undefined
  root: NavigationItem | undefined;
  loaded: boolean = false;

  @Input() set setCompany(company: NavigationItem | undefined) {
    this.loaded = false;
    if (!this.parent || !this.parent.path) {
      console.warn("we need parent before company")
      return;
    }
    if (!company) {
      this.root = undefined;
      this.company = undefined;
      this.loaded = true;
      return;
    }
    const path = this.parent.path.map(x => x).concat({name: company.name, uid: company.uid})
    this.root = {name: company.name, uid: company.uid, path};

    this.company = company;

    timer(200).subscribe(_ => {
      this.loaded = true;
    })

    this.companySubMenuOptions = companySubMenus.map((item: NavigationItem) => {
      let itemPath = item.path;
      if (!itemPath) {
        console.error("item should have a path", item);
        itemPath = [];
      }
      const submenuPath = {name: item.name, uid: item.uid, path: path.map(x=>x).concat(itemPath)};
      console.log("submenu path", submenuPath.path)
      return submenuPath;
    })
  };
  company: NavigationItem | undefined;

  @Output() companyChanged = new EventEmitter<EditAction>();

  companySubMenuOptions: Array<NavigationItem> | undefined;

  submenuSelection: NavigationItem | undefined;

  showSubmenu = "closed";

  sliderSubscription: Subscription | undefined;

  constructor(
    private sliderService: SliderService,
  ) {
    this.sliderSubscription = this.sliderService.sliderNavigation(Sliders.NavSlider)?.subscribe({
      next: value => {
        const match = MatchNavigationItem(value, this.root);
        console.log("matching ", value, this.root, match);
        if (match <=0)
          this.reset();
      }
    })
  }

  reset() {
    timer(300).subscribe({
      next: _ => {
        this.submenuSelection = undefined
      }
    })
  }

  openSubmenu(item: NavigationItem) {
    this.sliderService.updateSliderNavigation(Sliders.NavSlider, item);
    this.submenuSelection = item;
    this.showSubmenu = "open";
  }

  ngOnDestroy(): void {
    this.sliderSubscription?.unsubscribe();
  }

  archiveCompany() {
    this.companyChanged.emit({action: "archive", item: this.company})
  }
}
