import { makeStyles, tokens } from '@fluentui/react-components';

export const useStyles = makeStyles({
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
    transitionProperty: 'all',
    transitionDuration: '0.2s',
    transitionTimingFunction: 'cubic-bezier(0.33, 1, 0.68, 1)',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      transform: 'translateX(4px)'
    }
  },
  resultsListContainer: {
    animationName: {
      from: { opacity: 0, transform: 'translateY(10px)' },
      to: { opacity: 1, transform: 'translateY(0)' }
    },
    animationDuration: '300ms',
    animationTimingFunction: 'cubic-bezier(0.33, 1, 0.68, 1)',
    animationFillMode: 'forwards'
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
