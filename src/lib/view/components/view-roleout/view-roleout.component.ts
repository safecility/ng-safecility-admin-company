import {Component, Input} from '@angular/core';
import {
  EditorService,
  SliderPanel,
  SliderService,
  NavigationItem,
  Sliders,
  MatchNavigationItem
} from "safecility-admin-services";
import {MatDivider} from "@angular/material/divider";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatMiniFabButton} from "@angular/material/button";
import {ViewService} from "../../view.service";
import {View} from "../../view.model";

@Component({
  selector: 'lib-view-roleout',
  standalone: true,
  imports: [
    MatDivider,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatMiniFabButton,
    MatMenuTrigger
  ],
  templateUrl: './view-roleout.component.html',
  styleUrl: './view-roleout.component.css'
})
export class ViewRoleoutComponent implements SliderPanel{

  @Input() parent: NavigationItem | undefined;
  root: NavigationItem | undefined;

  loading: boolean = true;

  @Input() set setView(view: View | undefined) {
    this.view = view;
    if (!view) {
      this.root = undefined;
      return;
    }
    if (!this.parent || !this.parent.path) {
      console.log("we need parent to calculate root");
      return;
    }
    const path = this.parent.path.map(x => x).concat({name: view.name, uid: view.uid});
    this.root = {name: view.name, uid: view.uid, path};
    this.getView();
  };
  view: View | undefined;

  list: Array<NavigationItem> | undefined;

  listSelection: NavigationItem | undefined;

  constructor(
    private sliderService: SliderService,
    private viewService: ViewService,
  ) {
    this.sliderService.sliderNavigation(Sliders.NavSlider)?.subscribe({
      next: value => {
        const match = MatchNavigationItem(value, this.root);
        if (match <=0)
          this.reset();
      }
    })
  }

  reset() {
    this.listSelection = undefined;
  }

  listChange(item: NavigationItem) {
    this.sliderService.updateSliderNavigation(Sliders.NavSlider, item);
    this.listSelection = item;
  }

  getView() {
    if (!this.view)
      return
    this.loading = true;
    this.viewService.getView(this.view).subscribe({
      next: value => {
        if (!this.view)
          return
        this.loading = false;
        this.view.active = value?.active;
        this.view.app = value?.app;
      },
      error: err => {
        console.error(err)
      }
    })
  }

  archiveView() {

  }
}
