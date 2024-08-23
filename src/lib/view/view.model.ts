import {NavigationItem} from "safecility-admin-services";

export interface View extends NavigationItem{
  company: NavigationItem;
  active?: boolean;
  app?: string;
  viewType?: string;
  groups?: Map<string, any>;
  roles?: Array<any>;
}
