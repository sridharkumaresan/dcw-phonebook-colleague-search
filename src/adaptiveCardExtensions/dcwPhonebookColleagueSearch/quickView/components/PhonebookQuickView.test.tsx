import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PhonebookQuickView } from './PhonebookQuickView';
import { IPhonebookQuickViewProps } from './IPhonebookQuickViewProps';

// Inform Jest to take control of setTimeout (since the component uses lodash debounce for search)
jest.useFakeTimers();

describe('PhonebookQuickView Organism Component', () => {
  // Setup default mock props
  const defaultProps: IPhonebookQuickViewProps = {
    enableMockMode: true, // This intentionally bypasses live SPFx services and uses your Mock classes!
    profilePageUrl: '/sites/hub/SitePages/Profile.aspx',
    phonebookWebUrl: '/sites/hub/SitePages/Phonebook.aspx',
    serviceScope: {} as any, // Completely ignored when enableMockMode is true
    loginName: 'test.user@barclays.com',
    recentMax: 5,
    rowLimit: 10
  };

  beforeEach(() => {
    // Clear the localStorage 'recent views' tracking before every test run
    localStorage.clear();
  });

  afterEach(() => {
    // Clear any pending debounced timers to prevent test memory leaks
    jest.clearAllTimers();
  });

  it('renders the initial empty search state correctly', () => {
    render(<PhonebookQuickView {...defaultProps} />);
    
    // Verify structural elements are mounted natively
    expect(screen.getByText('Search and connect with colleagues across Barclays')).toBeTruthy();
    expect(screen.getByPlaceholderText('Enter a name or BRID')).toBeTruthy();
    
    // Verify that the footer button is present
    const footerButton = screen.getByText('Go to Phonebook');
    expect(footerButton).toBeTruthy();
    
    // We expect no results to be showing initially
    expect(screen.queryByText('Showing')).toBeNull();
  });

  it('triggers a mock search sequence when the user types 3+ characters', async () => {
    render(<PhonebookQuickView {...defaultProps} />);
    const searchInput = screen.getByPlaceholderText('Enter a name or BRID');
    
    // 1. Simulate the user typing 'sri'
    fireEvent.change(searchInput, { target: { value: 'sri' } });
    
    // 2. The component sets state to 'isSearching' instantly
    expect(await screen.findByText('Searching...')).toBeTruthy();
    
    // 3. Fast-forward the 300ms Lodash Debounce background timer
    jest.advanceTimersByTime(300);
    
    // 4. Wait for the mocked asynchronous Promise logic to resolve and update the DOM
    await waitFor(() => {
      // The spinner should be unmounted once the mock data resolves
      expect(screen.queryByText('Searching...')).toBeNull();
      
      // Since it's MockMode, it falls back to whatever your mock services return. 
      // This is proof the UI lifecycle handles the exact state sequence properly!
    });
  });

  it('ignores searches under 3 characters', () => {
    render(<PhonebookQuickView {...defaultProps} />);
    const searchInput = screen.getByPlaceholderText('Enter a name or BRID');
    
    // Simulate user typing only 2 letters
    fireEvent.change(searchInput, { target: { value: 'sr' } });
    
    // The spinner should never appear because the logic explicitly blocks lengths < 3
    expect(screen.queryByText('Searching...')).toBeNull();
  });
});
