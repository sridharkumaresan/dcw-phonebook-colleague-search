import * as React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Input, FluentProvider, webLightTheme, Spinner, Link, Text, tokens, makeStyles, Button } from '@fluentui/react-components';
import { SearchRegular, DismissRegular, ChevronRightRegular } from '@fluentui/react-icons';
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
  },
  searchContainer: {
    backgroundColor: '#f5f5f5',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    position: 'sticky',
    top: 0,
    zIndex: 10
  },
  searchTitle: {
    fontWeight: 600,
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground1
  },
  searchBox: { width: '100%', flexShrink: 0 },
  results: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '8px', 
    padding: '16px',
  },
  footer: { 
    borderTop: `1px solid ${tokens.colorNeutralStroke1}`, 
    padding: '16px',
    display: 'flex',
    position: 'sticky',
    bottom: 0,
    zIndex: 10,
    backgroundColor: tokens.colorNeutralBackground1
  },
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
  },
  resultSubText: {
    fontSize: '12px', 
    color: tokens.colorNeutralForeground2
  },
  viewAllContainer: {
    marginTop: '16px', 
    paddingTop: '16px', 
    borderTop: `1px solid ${tokens.colorNeutralStroke1}`, 
    display: 'flex', 
    justifyContent: 'flex-start'
  },
  viewAllLink: {
    fontWeight: 600, 
    display: 'inline-flex', 
    alignItems: 'center'
  },
  viewAllIcon: {
    marginLeft: '4px'
  },
  fullWidthButton: {
    width: '100%'
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
      <div key={person.id} onClickCapture={(e) => { e.preventDefault(); e.stopPropagation(); handleProfileClick(person); }} className={styles.resultItem}>
        <CardComponent 
          idOrUpn={person.id} 
          viewType={'basic'} 
          enableHoverCardView={true} 
          userProfileService={userProfileService.current as any} 
          profile={person as any} 
          showStatus={true} 
        />
        <div className={styles.resultSubText}>{person.IMH3} || {person.IMH4}</div>
      </div>
    ));
  };
  
  return (
    <FluentProvider theme={webLightTheme} style={{height: '100%'}}>
      <div className={styles.container}>
        <div className={styles.searchContainer}>
          <Text className={styles.searchTitle}>Search for a colleague</Text>
          <Input 
            className={styles.searchBox}
            placeholder="Enter a name or BRID"
            contentBefore={<SearchRegular />}
            contentAfter={searchTerm.length > 0 ? <DismissRegular style={{ cursor: 'pointer' }} onClick={() => {
              setSearchTerm('');
              setResults([]);
              setIsSearching(false);
            }} /> : null}
            value={searchTerm}
            onChange={onSearchChange}
          />
        </div>
        
        <div className={styles.results}>
          {isSearching && <Spinner size="tiny" label="Searching..." />}
          
          {!isSearching && searchTerm.length >= 2 && results.length === 0 && (
            <Text className={styles.sectionHeading}>No results found.</Text>
          )}
          
          {!isSearching && searchTerm.length >= 2 && results.length > 0 && (
            <div>
               <Text className={styles.sectionHeading}>Showing {results.length} of {totalRows} results</Text>
               {renderList(results)}
               {totalRows > 10 && (
                 <div className={styles.viewAllContainer}>
                   <Link href={`${props.profilePageUrl.replace(/Profile\.aspx/i, 'Search.aspx')}?q=${encodeURIComponent(searchTerm)}`} target="_blank" className={styles.viewAllLink}>
                     View all results <ChevronRightRegular fontSize={16} className={styles.viewAllIcon} />
                   </Link>
                 </div>
               )}
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
          <Button className={styles.fullWidthButton} onClick={() => window.open(props.phonebookWebUrl, '_blank')}>
            Go to Phonebook
          </Button>
        </div>
      </div>
    </FluentProvider>
  );
};
