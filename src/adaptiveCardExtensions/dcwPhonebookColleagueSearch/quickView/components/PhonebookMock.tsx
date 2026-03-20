import * as React from 'react';
import { IColleagueProfile, ISearchResponse } from '../../../../models/IColleagueProfile';
import { Text, Avatar } from '@fluentui/react-components';

export class MockUserProfileService {
  constructor(serviceScope: any) {}
}

export class MockUtilityService {
  public fullMatchQueryBuilder(searchTerm: string): string {
    return searchTerm; // Just return the term for the mock
  }
}

export class MockSearchService {
  public static readonly serviceKey: any = 'MockSearchService';
  
  public async search(searchTerm: string, limit: number, startRow: string, filters: any): Promise<ISearchResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const dummyData: IColleagueProfile[] = [
          { id: '1', displayName: 'John Barbaro', jobTitle: 'Lead UI Designer - DCE', email: 'john.barbaro@mock.com', IMH3: 'New York', IMH4: 'Retail Banking' },
          { id: '2', displayName: 'John Barron', jobTitle: 'Head of product development GTIS', email: 'john.barron@mock.com', IMH3: 'London', IMH4: 'Investment Banking' },
          { id: '3', displayName: 'John Barutia', jobTitle: 'Business Analyst', email: 'john.barutia@mock.com', IMH3: 'Pune', IMH4: 'Operations' },
          { id: '4', displayName: 'Kevin Lisbie', jobTitle: 'Lead UI Designer - DCE', email: 'kevin.lisbie@mock.com', IMH3: 'London', IMH4: 'DCE' },
          { id: '5', displayName: 'Paul Santos', jobTitle: 'Head of product development GTIS', email: 'paul.santos@mock.com', IMH3: 'London', IMH4: 'GTIS' }
        ];
        
        const filtered = dummyData.filter(p => p.displayName.toLowerCase().includes(searchTerm.toLowerCase()));
        
        resolve({
          results: filtered.slice(0, limit),
          totalRows: filtered.length,
          seq: 1
        });
      }, 500); // simulate network delay
    });
  }
}

export const MockProfileCard: React.FC<any> = (props) => {
  const { profile } = props;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0' }}>
      <Avatar name={profile.displayName} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Text weight="semibold">{profile.displayName}</Text>
        <Text size={200}>{profile.jobTitle}</Text>
      </div>
    </div>
  );
};
