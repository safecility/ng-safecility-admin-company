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
  EditAction
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

  @Input() index: number = 1;
  @Input() root: NavigationItem = {name: 'company', uid: 'company', path: [
      {name: "company", pathElement: "company"}
    ]}

  showSubmenu = "closed";

  list: Array<NavigationItem> | undefined;

  company: NavigationItem | undefined;

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
        console.log("got companies", data);
        if (data && data.length > 0) {
        }
        this.list = data;
        this.isLoadingResults = false;
      },
      error: (err: Error) => {
        console.error(err);
      }
    })
    this.sliderSubscription = this.sliderService.sliderNavigation(Sliders.NavSlider)?.subscribe({
      next: value => {
        if (!value || !value.path) {
          this.clearCompanyDisplay();
          return;
        }
        const index = value.path.length;
        if (index <= this.index) {
          this.clearCompanyDisplay();
        }
      }
    })
  }

  clearCompanyDisplay() {
    this.showSubmenu = "closed";
    timer(300).subscribe({
      next: _ => {
        this.company = undefined;
      }
    })
  }

  navigate(item: NavigationItem | undefined) {
    this.sliderService.updateSliderNavigation(Sliders.NavSlider, item);
    this.company = item;
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
