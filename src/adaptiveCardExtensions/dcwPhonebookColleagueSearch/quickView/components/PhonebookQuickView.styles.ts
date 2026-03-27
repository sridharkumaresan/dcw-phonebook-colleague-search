import { makeStyles, tokens } from '@fluentui/react-components';

export const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    // 1. Establish this root as a layout Container. All inner child elements can now natively use @container Queries!
    containerType: 'inline-size',
    
    // 2. Mobile-First Default: 100% fluid footprint safely prevents overflowing the iOS/Android Teams App
    width: '100%',
    height: '100%',
    
    // 3. UX Compromise: Mathematically freeze the boundary layout ONLY when the user is safely on a Desktop screen
    '@media (min-width: 480px) and (min-height: 680px)': {
      height: '570px',
      minHeight: '570px',
      maxHeight: '570px',
      minWidth: '360px',
      width: '100%',
      maxWidth: '100%'
    },

  },
  searchContainer: {
    backgroundColor: tokens.colorNeutralBackground2,
    padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalL}`,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingHorizontalL,
    position: 'sticky',
    top: 0,
    zIndex: 10
  },
  quickViewHeader: {
    fontFamily: tokens.fontFamilyBase,
    fontSize: tokens.fontSizeBase400,
    lineHeight: tokens.lineHeightBase400,
    fontWeight: tokens.fontWeightSemibold,
  },
  searchTitle: {
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground1
  },
  searchBox: { width: '100%', flexShrink: 0 },
  results: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1, // Crucial: pushes the footer to the bottom of the 600px container when there are no items
    gap: tokens.spacingVerticalS,
    padding: `0px ${tokens.spacingHorizontalL}`,
    paddingBottom: tokens.spacingVerticalL, // Prevents the last item from hitting exactly flush with the sticky footer boundary
    
    // 'scroll' permanently reserves the 6px space natively, completely fixing the horizontal width jumping when results populate!
    overflowY: 'scroll',
    
    // macOS Style Auto-Hiding Scrollbar (Supported by Chromium/Edge/Teams)
    '&::-webkit-scrollbar': {
      width: '6px',
      backgroundColor: 'transparent',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'transparent', // Invisible track
    },
    '&::-webkit-scrollbar-thumb': {
      borderRadius: '10px',
      backgroundColor: 'transparent', // Hidden by default
    },
    // The thumb background color turns grey ONLY when hovering over the results container
    '&:hover::-webkit-scrollbar-thumb': {
      backgroundColor: tokens.colorNeutralStroke1Hover, 
    }
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
    
    // Demonstration of your new Component Library Container Query power!
    // If the parent Phonebook container gets violently squished (e.g. on a tiny phone), dynamically shrink this inner card padding instantly:
    '@container (max-width: 340px)': {
      padding: '2px 4px',
    },
    borderRadius: tokens.borderRadiusMedium,
    transitionProperty: 'all',
    transitionDuration: '0.2s',
    transitionTimingFunction: 'cubic-bezier(0.33, 1, 0.68, 1)',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      transform: 'translateX(4px)'
    },
    // Deep CSS overrides for the internal ProfileCard component avatar
    '& .fui-Avatar': {
      // Override Fluent UI v9 Avatar size
      width: '44px !important',
      height: '44px !important',
    },
    // Deep CSS overrides for the internal ProfileCard component title
    '& .fui-Persona__primaryText, & .fui-Persona__primaryText span': {
      // Increase title font size (targeting inner spans directly to bypass Fluent UI's own font overrides)
      fontSize: '16px !important',
      fontWeight: `${tokens.fontWeightSemibold} !important`,
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
    fontWeight: tokens.fontWeightSemibold,
    display: 'inline-flex',
    alignItems: 'center'
  },
  viewAllIcon: {
    marginLeft: '4px'
  },
  fullWidthButton: {
    width: '100%',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL}`,
    fontFamily: tokens.fontFamilyBase,
    fontSize: tokens.fontSizeBase400,
    lineHeight: tokens.lineHeightBase400,
    fontWeight: tokens.fontWeightSemibold,
  }
});
