import { IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import * as strings from 'DcwPhonebookColleagueSearchAdaptiveCardExtensionStrings';

export class DcwPhonebookColleagueSearchPropertyPane {
  public getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupFields: [
                PropertyPaneTextField('title', {
                  label: strings.TitleFieldLabel
                }),
                PropertyPaneTextField('headerText', {
                  label: 'Header Text'
                }),
                PropertyPaneTextField('phonebookWebUrl', {
                  label: 'Phonebook Web URL'
                }),
                PropertyPaneTextField('profilePageUrl', {
                  label: 'Profile Page URL'
                }),
                PropertyPaneTextField('rowLimit', {
                  label: 'Row Limit'
                }),
                PropertyPaneTextField('recentMax', {
                  label: 'Recent Max'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
