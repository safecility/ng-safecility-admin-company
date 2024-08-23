import { Component, Input, OnDestroy } from '@angular/core';
import { MatList, MatListItem, MatListOption, MatSelectionList } from "@angular/material/list";
import { CompanyService } from "../../company.service";
import { CompanyRoleoutComponent} from "../company-roleout/company-roleout.component";
import { MatDivider} from "@angular/material/divider";
import { MatButton, MatMiniFabButton} from "@angular/material/button";
import { MatIcon} from "@angular/material/icon";
import {
  EditorService,
  SliderPanel,
  SliderService,
  NavigationItem,
  Sliders,
  fadeTrigger,
  EditAction, Resource, MatchNavigationItem
} from "safecility-admin-services";
import {Subscription, timer} from "rxjs";
import { JsonPipe } from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'lib-company-nav-roleout',
  standalone: true,
  imports: [
    MatList,
    MatListItem,
    MatListOption,
    MatSelectionList,
    CompanyRoleoutComponent,
    MatDivider,
    MatButton,
    MatIcon,
    MatMiniFabButton,
    JsonPipe,
    MatProgressSpinner,
  ],
  templateUrl: './company-nav-roleout.component.html',
  styleUrl: './company-nav-roleout.component.css',
  animations: [fadeTrigger],
})
export class CompanyNavRoleoutComponent implements SliderPanel, OnDestroy {

  @Input() set setParent(parent: NavigationItem | undefined) {
    console.log("setting company nav roleout", parent);
    if (!parent || !parent.path) {
      return;
    }
    const path = parent.path.map(x => x).concat({name: "company", uid: "company"});
    this.root = {name: 'company', uid: 'company', path}
  }
  root: NavigationItem | undefined

  showSubmenu = "closed";

  companyOptions: Array<NavigationItem> | undefined;

  selectedCompany: NavigationItem | undefined;

  isLoadingResults: boolean = true;

  ngOnDestroy(): void {
    this.sliderSubscription?.unsubscribe();
  }

  sliderSubscription: Subscription | undefined;

  constructor(
    private companyService: CompanyService,
    private sliderService: SliderService,
    private editorService: EditorService,
  ) {
    companyService.getCompanyList().subscribe({
      complete(): void {
      },
      next: (data: Array<NavigationItem> | undefined) => {
        if (!data) {
          this.companyOptions = undefined;
          return;
        }
        let path: Array<Resource> = []
        if (!this.root || !this.root.path) {
          console.log("we need root to set slider navigation")
        } else {
          path = this.root.path.map(x => x);
        }

        this.companyOptions = data.map(x => {
          const companyPath = path.concat({name: x.name, uid: x.uid});
          return{name: x.name, uid: x.uid, path: companyPath}
        });
        this.isLoadingResults = false;
      },
      error: (err: Error) => {
        console.error(err);
      }
    })
    this.sliderSubscription = this.sliderService.sliderNavigation(Sliders.NavSlider)?.subscribe({
      next: value => {
        const match = MatchNavigationItem(value, this.root);
        if (match <=0)
          this.reset();
      }
    })
  }

  reset() {
    this.showSubmenu = "closed";
    timer(300).subscribe({
      next: _ => {
        this.selectedCompany = undefined;
      }
    })
  }

  selectCompany(item: NavigationItem | undefined) {
    this.sliderService.updateSliderNavigation(Sliders.NavSlider, item);
    this.selectedCompany = item;
    this.showSubmenu = "open";
  }

  openEditor() {
    this.editorService.setEditor({id: "company", state: "open"})
  }

  companyChanged($event: EditAction) {
    if (!$event.item)
      return;
    if ($event.action === 'archive') {
      this.companyService.archiveCompany($event.item?.uid).subscribe({
        next: _ => {
          this.isLoadingResults = false;
          this.sliderService.updateSliderNavigation(Sliders.NavSlider, this.root);
        },
        error: err => {
          console.error(err);
        }
      })
    }
  }
}
