import * as React from 'react';
import * as ReactDom from 'react-dom';
import { BaseWebQuickView } from '@microsoft/sp-adaptive-card-extension-base';
import {
  IDcwPhonebookColleagueSearchAdaptiveCardExtensionProps,
  IDcwPhonebookColleagueSearchAdaptiveCardExtensionState
} from '../DcwPhonebookColleagueSearchAdaptiveCardExtension';
import { PhonebookQuickView, IPhonebookQuickViewProps } from './components/PhonebookQuickView';

export class QuickView extends BaseWebQuickView<
  IDcwPhonebookColleagueSearchAdaptiveCardExtensionProps,
  IDcwPhonebookColleagueSearchAdaptiveCardExtensionState
> {
  // Explicitly set the Quick View header to standard capitalization
  public get title(): string {
    return 'Phonebook';
  }

  public render(): void {
    const props: IPhonebookQuickViewProps = {
      serviceScope: this.context.serviceScope,
      loginName: this.context.pageContext.user.loginName,
      phonebookWebUrl: this.properties.phonebookWebUrl,
      profilePageUrl: this.properties.profilePageUrl,
      rowLimit: this.properties.rowLimit,
      recentMax: this.properties.recentMax
    };
    
    const element = React.createElement(PhonebookQuickView, props);
    ReactDom.render(element, this.domElement);
  }

  public onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }
}

