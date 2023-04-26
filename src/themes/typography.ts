/**
 * Typography used in theme
 * @param {JsonObject} theme theme customization object
 */

interface TypographyProps {
    mainContent: CSSProperties
    commonAvatar: CSSProperties
    mediumAvatar: CSSProperties
    subMenuCaption: CSSProperties
    menuCaption: CSSProperties
    customInput: CSSProperties
}

declare module '@mui/material/styles' {
  interface TypographyOptions extends TypographyProps {}
}

declare module "@mui/material/styles/createTypography" {
  interface Typography extends TypographyProps {}
}

import { CSSProperties } from "react";

export default function themeTypography(theme: any) {
    return {
        fontFamily: "Poppins, sans-serif",
        h6: {
            fontWeight: 500,
            color: theme.heading as string,
            fontSize: '0.69rem'
        },
        h5: {
            fontSize: '0.8rem',
            color: theme.heading as string,
            fontWeight: 500
        },
        h4: {
            fontSize: '0.92rem',
            color: theme.heading as string,
            fontWeight: 600
        },
        h3: {
            fontSize: '1.13rem',
            color: theme.heading as string,
            fontWeight: 600
        },
        h2: {
            fontSize: '1.25rem',
            color: theme.heading as string,
            fontWeight: 700
        },
        h1: {
            fontSize: '1.9rem',
            color: theme.heading,
            fontWeight: 700
        },
        subtitle1: {
            fontSize: '0.8rem',
            fontWeight: 500,
            color: theme.textDark
        },
        subtitle2: {
            fontSize: '0.67rem',
            fontWeight: 400,
            color: theme.darkTextSecondary
        },
        caption: {
            fontSize: '0.69rem',
            color: theme.darkTextSecondary,
            fontWeight: 400
        },
        body1: {
            fontSize: '0.79rem',
            fontWeight: 400,
            lineHeight: '1.334em'
        },
        body2: {
            letterSpacing: '0em',
            fontWeight: 400,
            lineHeight: '1.3em',
            color: theme.darkTextPrimary
        },
        button: {
            // textTransform: 'capitalize'
        },
        customInput: {
            marginTop: 1,
            marginBottom: 1,
            '& > label': {
                top: 23,
                left: 0,
                color: theme.grey500,
                '&[data-shrink="false"]': {
                    top: 5
                }
            },
            '& > div > input': {
                padding: '30.5px 14px 11.5px !important'
            },
            '& legend': {
                display: 'none'
            },
            '& fieldset': {
                top: 0
            }
        },
        mainContent: {
            backgroundColor: theme.background,
            width: '100%',
            minHeight: 'calc(100vh - 70px)',
            flexGrow: 1,
            padding: '20px',
            marginTop: '88px',
            marginRight: '20px',
            borderRadius: `${theme?.customization?.borderRadius}px`
        },
        menuCaption: {
            fontSize: '0.79rem',
            fontWeight: 500,
            color: theme.heading,
            padding: '6px',
            // textTransform: 'capitalize',
            marginTop: '10px'
        },
        subMenuCaption: {
            fontSize: '0.6rem',
            fontWeight: 500,
            color: theme.darkTextSecondary,
            // textTransform: 'capitalize'
        },
        commonAvatar: {
            cursor: 'pointer',
            borderRadius: '8px'
        },
        smallAvatar: {
            width: '22px',
            height: '22px',
            fontSize: '1rem'
        },
        mediumAvatar: {
            width: '34px',
            height: '34px',
            fontSize: '1.2rem'
        },
        largeAvatar: {
            width: '44px',
            height: '44px',
            fontSize: '1.5rem'
        }
    };
}
