import {
  BaseComponentsCardView,
  ComponentsCardViewParameters,
  ImageCardView,
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
    return ImageCardView({
      cardBar: {
        componentName: 'cardBar',
        title: this.properties.title ? this.properties.title.toUpperCase() : 'PHONEBOOK'
      },
      header: {
        componentName: 'text',
        text: this.properties.headerText
      },
      image: {
        url: require('../assets/phonebook-gradient.svg'),
        altText: 'Phonebook Illustration'
      },
      footer: {
        componentName: 'cardButton',
        title: 'Search Directory',
        style: 'positive',
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
