declare module '@barclays/phonebook-sp-fx-profile' {
  export interface IColleagueProfile {
    id: string;
    displayName: string;
    jobTitle?: string;
    department?: string;
    email?: string;
    userPrincipalName?: string;
    accountName?: string;
    photoUrl?: string;
    IMH3?: string;
    IMH4?: string;
  }

  export interface ISearchResponse {
    results: IColleagueProfile[];
    totalRows: number;
    seq: number;
  }

  export class UserProfileService {
    constructor(serviceScope: any);
  }

  export class SearchService {
    static readonly serviceKey: any;
    search(searchTerm: string, limit: number, startRow: string, filters: any): Promise<ISearchResponse>;
  }

  export class UtilityService {
    fullMatchQueryBuilder(searchTerm: string): string;
  }

  export const ProfileCard: any;
}
