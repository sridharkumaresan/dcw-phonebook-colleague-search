import { ServiceScope } from '@microsoft/sp-core-library';

export interface IPhonebookQuickViewProps {
  serviceScope: ServiceScope;
  loginName: string;
  phonebookWebUrl: string;
  profilePageUrl: string;
  rowLimit: number;
  recentMax: number;
  enableMockMode?: boolean;
}
