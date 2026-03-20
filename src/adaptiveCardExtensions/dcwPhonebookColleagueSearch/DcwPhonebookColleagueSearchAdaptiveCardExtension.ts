import type { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { DcwPhonebookColleagueSearchPropertyPane } from './DcwPhonebookColleagueSearchPropertyPane';

export interface IDcwPhonebookColleagueSearchAdaptiveCardExtensionProps {
  title: string;
  headerText: string;
  phonebookWebUrl: string;
  profilePageUrl: string;
  rowLimit: number;
  recentMax: number;
}

export interface IDcwPhonebookColleagueSearchAdaptiveCardExtensionState {
}

const CARD_VIEW_REGISTRY_ID: string = 'DcwPhonebookColleagueSearch_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'DcwPhonebookColleagueSearch_QUICK_VIEW';

export default class DcwPhonebookColleagueSearchAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IDcwPhonebookColleagueSearchAdaptiveCardExtensionProps,
  IDcwPhonebookColleagueSearchAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: DcwPhonebookColleagueSearchPropertyPane | undefined;

  public onInit(): Promise<void> {
    this.state = { };

    // registers the card view to be shown in a dashboard
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    // registers the quick view to open via QuickView action
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'DcwPhonebookColleagueSearch-property-pane'*/
      './DcwPhonebookColleagueSearchPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.DcwPhonebookColleagueSearchPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  public get iconProperty(): string {
    return 'Phone';
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane?.getPropertyPaneConfiguration() ?? super.getPropertyPaneConfiguration();
  }
}
