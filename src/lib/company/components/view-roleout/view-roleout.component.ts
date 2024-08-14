import {Component, Input} from '@angular/core';
import {EditorService, SliderPanel, SliderService, NavigationItem, Sliders} from "safecility-admin-services";

@Component({
  selector: 'lib-view-roleout',
  standalone: true,
  imports: [],
  templateUrl: './view-roleout.component.html',
  styleUrl: './view-roleout.component.css'
})
export class ViewRoleoutComponent implements SliderPanel{

  @Input() index = 4;

  @Input() set view(view: NavigationItem | undefined) {
    this._view = view;
  };
  _view: NavigationItem | undefined;

  list: Array<NavigationItem> | undefined;

  listSelection: NavigationItem | undefined;

  constructor(private sliderService: SliderService,
  ) {
    this.sliderService.sliderNavigation(Sliders.NavSlider)?.subscribe({
      next: value => {
        if (!value || !value.path) {
          this._view = undefined;
          return;
        }
        const index = value.path.length;
        if (index < this.index) {
          this._view = undefined;
        }
      }
    })
  }

  listChange(item: NavigationItem) {
    this.sliderService.updateSliderNavigation(Sliders.NavSlider, item);
    this.listSelection = item;
  }

}
