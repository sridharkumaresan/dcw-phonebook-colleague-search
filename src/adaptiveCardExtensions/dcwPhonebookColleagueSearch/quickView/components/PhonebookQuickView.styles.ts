import { makeStyles, tokens } from '@fluentui/react-components';

export const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '600px', // Prevent layout jumping on empty/loading states
    minWidth: 'min(375px, 100vw)', // Ensure a minimum width without breaking smaller devices
    height: '100%',
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
    },
    // Deep CSS overrides for the internal ProfileCard component avatar
    // Replace '.ms-Persona-coin' with the actual class inspected from the dev tools if different
    '& .ms-Persona-coin': {
      // Add your avatar CSS customizations here 
      // width: '40px !important',
      // height: '40px !important',
    },
    // Deep CSS overrides for the internal ProfileCard component title
    // Replace '.ms-Persona-primaryText' with the actual class inspected from the dev tools if different
    '& .ms-Persona-primaryText': {
      // Add your title CSS customizations here
      // fontWeight: tokens.fontWeightSemibold,
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
