/** 
 * TECHNICAL DATA MAPPING 
 * Based on @barclays/phonebook-sp-fx-profile 
 */
export interface IColleagueProfile {
  id: string;
  displayName: string;
  jobTitle?: string;
  department?: string;
  email?: string;
  userPrincipalName?: string;
  accountName?: string;
  photoUrl?: string;
  IMH3?: string; // Location / Branch
  IMH4?: string; // Business Unit / Segment
}

export interface ISearchResponse {
  results: IColleagueProfile[];
  totalRows: number;
  seq: number; 
}
