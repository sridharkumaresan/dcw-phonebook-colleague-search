import * as React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Input, FluentProvider, webLightTheme, Spinner, Link, Text, Button } from '@fluentui/react-components';
import { SearchRegular, DismissRegular, ChevronRightRegular } from '@fluentui/react-icons';
import { debounce } from 'lodash';
import { ProfileCard, UserProfileService, SearchService, UtilityService } from '@barclays/phonebook-sp-fx-profile';
import { IColleagueProfile } from '../../../../models/IColleagueProfile';
import { MockProfileCard, MockSearchService, MockUserProfileService, MockUtilityService } from '../mocks/PhonebookMock';
import { IPhonebookQuickViewProps } from './IPhonebookQuickViewProps';
import { useStyles } from './PhonebookQuickView.styles';

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
    props.enableMockMode ? new MockUserProfileService(props.serviceScope) : new UserProfileService(props.serviceScope as any)
  );
  const utilityService = useRef(
    props.enableMockMode ? new MockUtilityService() : new UtilityService()
  );
  const searchService = useRef<any>(
    props.enableMockMode ? new MockSearchService() : props.serviceScope.consume((SearchService as any).serviceKey || (SearchService as any).servicekey)
  );

  const RECENT_KEY = `Phonebook_Recent_${props.loginName}`;

  useEffect(() => {
    const stored = localStorage.getItem(RECENT_KEY);
    if (stored) {
      try { setRecentlyViewed(JSON.parse(stored)); } catch (e) { }
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
    if (term.length < 3) {
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
    if (val.length >= 3) {
      setIsSearching(true);
      void debouncedSearch(val);
    } else {
      setResults([]);
      setIsSearching(false);
    }
  };

  const renderList = (items: IColleagueProfile[]) => {
    const CardComponent = props.enableMockMode ? MockProfileCard : ProfileCard;

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
      </div>
    ));
  };

  return (
    <FluentProvider theme={webLightTheme} style={{ height: '100%' }}>
      <div className={styles.container}>
        <div className={styles.searchContainer}>
          <Text className={styles.searchTitle}>Search and connect with colleagues across Barclays</Text>
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

          {!isSearching && searchTerm.length >= 3 && results.length === 0 && (
            <Text className={styles.sectionHeading}>No results found.</Text>
          )}

          {!isSearching && searchTerm.length >= 3 && results.length > 0 && (
            <div className={styles.resultsListContainer}>
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

          {searchTerm.length < 3 && recentlyViewed.length > 0 && (
            <div className={styles.resultsListContainer}>
              <Text className={styles.sectionHeading}>Last viewed</Text>
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
