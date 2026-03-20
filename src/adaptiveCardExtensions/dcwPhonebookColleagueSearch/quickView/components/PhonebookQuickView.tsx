import * as React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Input, FluentProvider, webLightTheme, Spinner, Link, Text, tokens, makeStyles } from '@fluentui/react-components';
import { SearchRegular } from '@fluentui/react-icons';
import { debounce } from 'lodash';
import { ProfileCard, UserProfileService, SearchService, UtilityService } from '@barclays/phonebook-sp-fx-profile';
import { IColleagueProfile } from '../../../../models/IColleagueProfile';
import { ServiceScope } from '@microsoft/sp-core-library';
import { MockProfileCard, MockSearchService, MockUserProfileService, MockUtilityService } from './PhonebookMock';

// --- TOGGLE FOR TESTING ---
// Set to false to use the real internal API.
const USE_MOCK = true;
// --------------------------

export interface IPhonebookQuickViewProps {
  serviceScope: ServiceScope;
  loginName: string;
  phonebookWebUrl: string;
  profilePageUrl: string;
  rowLimit: number;
  recentMax: number;
}

const useStyles = makeStyles({
  container: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '10px', 
    padding: '16px',
    height: '100%', 
    overflow: 'hidden' // Force scroll constraint internally
  },
  searchBox: { width: '100%', flexShrink: 0 },
  results: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '8px', 
    marginTop: '10px',
    flex: '1 1 auto',
    overflowY: 'auto',
    paddingRight: '6px', // space for scrollbar
    // MacOS hover invisible style CSS
    '&::-webkit-scrollbar': {
      width: '6px',
      backgroundColor: 'transparent'
    },
    '&::-webkit-scrollbar-thumb': {
      borderRadius: '10px',
      backgroundColor: 'transparent'
    },
    '&:hover::-webkit-scrollbar-thumb': {
      backgroundColor: tokens.colorNeutralStroke1
    }
  },
  footer: { marginTop: '16px', borderTop: `1px solid ${tokens.colorNeutralStroke1}`, paddingTop: '8px' },
  resultItem: {
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: tokens.borderRadiusMedium,
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover
    }
  },
  sectionHeading: {
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase200,
    marginBottom: '8px',
    display: 'block'
  }
});

export const PhonebookQuickView: React.FC<IPhonebookQuickViewProps> = (props) => {
  const styles = useStyles();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<IColleagueProfile[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<IColleagueProfile[]>([]);
  
  const requestSeq = useRef(0);
  
  // Services Integration
  const userProfileService = useRef(
    USE_MOCK ? new MockUserProfileService(props.serviceScope) : new UserProfileService(props.serviceScope as any)
  );
  const utilityService = useRef(
    USE_MOCK ? new MockUtilityService() : new UtilityService()
  ); 
  const searchService = useRef<any>(
    USE_MOCK ? new MockSearchService() : props.serviceScope.consume((SearchService as any).serviceKey || (SearchService as any).servicekey)
  );
  
  const RECENT_KEY = `Phonebook_Recent_${props.loginName}`;
  
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_KEY);
    if (stored) {
      try { setRecentlyViewed(JSON.parse(stored)); } catch (e) {}
    }
  }, [RECENT_KEY]);
  
  const saveToRecent = (profile: IColleagueProfile) => {
    const current = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
    const updated = [profile, ...current.filter((p: any) => p.id !== profile.id)].slice(0, props.recentMax);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    setRecentlyViewed(updated);
  };
  
  const handleProfileClick = (person: IColleagueProfile) => {
    saveToRecent(person);
    const accountName = person.userPrincipalName ?? person.email ?? person.accountName ?? person.id;
    const url = `${props.profilePageUrl}?accountname=${encodeURIComponent(accountName)}`;
    window.open(url, '_blank');
  };
  
  const executeSearch = async (term: string) => {
    if (term.length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    requestSeq.current += 1;
    const currentSeq = requestSeq.current;
    
    try {
      const query = utilityService.current.fullMatchQueryBuilder(term);
      const limit = props.rowLimit;
      const response = await searchService.current.search(query, limit, '0');
      
      if (requestSeq.current === currentSeq) {
        setResults(response.results);
        setTotalRows(response.totalRows);
        setIsSearching(false);
      }
    } catch (e) {
      if (requestSeq.current === currentSeq) {
        setResults([]);
        setIsSearching(false);
      }
    }
  };
  
  const debouncedSearch = useCallback(debounce(executeSearch, 300), []);
  
  const onSearchChange = (ev: any, data: any) => {
    const val = data.value || '';
    setSearchTerm(val);
    if (val.length >= 2) {
      setIsSearching(true);
      void debouncedSearch(val);
    } else {
      setResults([]);
      setIsSearching(false);
    }
  };
  
  const renderList = (items: IColleagueProfile[]) => {
    const CardComponent = USE_MOCK ? MockProfileCard : ProfileCard;

    return items.map(person => (
      <div key={person.id} onClick={() => handleProfileClick(person)} className={styles.resultItem}>
        <CardComponent 
          idOrUpn={person.id} 
          viewType={'basic'} 
          enableHoverCardView={true} 
          userProfileService={userProfileService.current as any} 
          profile={person as any} 
          showStatus={true} 
        />
        <div style={{fontSize: '12px', color: tokens.colorNeutralForeground2}}>{person.IMH3} || {person.IMH4}</div>
      </div>
    ));
  };
  
  return (
    <FluentProvider theme={webLightTheme} style={{height: '100%'}}>
      <div className={styles.container}>
        <Input 
          className={styles.searchBox}
          placeholder="Search for a colleague"
          contentBefore={<SearchRegular />}
          value={searchTerm}
          onChange={onSearchChange}
        />
        
        <div className={styles.results}>
          {isSearching && <Spinner size="tiny" label="Searching..." />}
          
          {!isSearching && searchTerm.length >= 2 && results.length === 0 && (
            <Text className={styles.sectionHeading}>No results found.</Text>
          )}
          
          {!isSearching && searchTerm.length >= 2 && results.length > 0 && (
            <div>
               <Text className={styles.sectionHeading}>Showing {results.length} of {totalRows} results</Text>
               {renderList(results)}
            </div>
          )}
          
          {searchTerm.length < 2 && recentlyViewed.length > 0 && (
            <div>
              <Text className={styles.sectionHeading}>Recently viewed</Text>
              {renderList(recentlyViewed)}
            </div>
          )}
        </div>
        
        <div className={styles.footer}>
          <Link href={props.phonebookWebUrl} target="_blank">Go to Phonebook</Link>
        </div>
      </div>
    </FluentProvider>
  );
};
