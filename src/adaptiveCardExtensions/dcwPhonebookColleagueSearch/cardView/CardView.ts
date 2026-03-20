import {
  BaseComponentsCardView,
  ComponentsCardViewParameters,
  BasicCardView,
  IExternalLinkCardAction,
  IQuickViewCardAction
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'DcwPhonebookColleagueSearchAdaptiveCardExtensionStrings';
import {
  IDcwPhonebookColleagueSearchAdaptiveCardExtensionProps,
  IDcwPhonebookColleagueSearchAdaptiveCardExtensionState,
  QUICK_VIEW_REGISTRY_ID
} from '../DcwPhonebookColleagueSearchAdaptiveCardExtension';

export class CardView extends BaseComponentsCardView<
  IDcwPhonebookColleagueSearchAdaptiveCardExtensionProps,
  IDcwPhonebookColleagueSearchAdaptiveCardExtensionState,
  ComponentsCardViewParameters
> {
  public get cardViewParameters(): ComponentsCardViewParameters {
    return BasicCardView({
      cardBar: {
        componentName: 'cardBar',
        title: this.properties.title
      },
      header: {
        componentName: 'text',
        text: this.properties.headerText
      },
      footer: {
        componentName: 'cardButton',
        title: 'Search',
        action: {
          type: 'QuickView',
          parameters: {
            view: QUICK_VIEW_REGISTRY_ID
          }
        }
      }
    });
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'QuickView',
      parameters: {
        view: QUICK_VIEW_REGISTRY_ID
      }
    };
  }
}
