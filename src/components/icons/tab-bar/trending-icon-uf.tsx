import { Theme } from '@/constants/theme';
import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

/**
 * -----------------------------------------------------------------------------
 * 🎨 CUSTOM ICON TEMPLATE
 * -----------------------------------------------------------------------------
 * 
 * 1. Duplicate this file.
 * 2. Rename the component (e.g., `MyCustomIcon`).
 * 3. Replace the <Path /> content with your SVG path from Figma.
 * 
 * Tips:
 * - Ensure your Figma icon is inside a 24x24 frame for best results.
 * - Right-click the icon in Figma > "Copy as SVG".
 * - Use a converter like https://react-svgr.com/playground/ (select "Native")
 *   OR just manually copy the 'd' attribute from the path.
 * -----------------------------------------------------------------------------
 */

export interface TrendingIconProps extends SvgProps {
    size?: number;
    color?: string;
}

export const TrendingIconUF = ({
    size = 24,
    color = Theme.colors.text.primary, // Default to theme text color
    style,
    ...props
}: TrendingIconProps) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} {...props}>
            <Path
                d="M21.68 16.9599L18.55 9.64988C17.49 7.16988 15.54 7.06988 14.23 9.42988L12.34 12.8399C11.38 14.5699 9.59 14.7199 8.35 13.1699L8.13 12.8899C6.84 11.2699 5.02 11.4699 4.09 13.3199L2.37 16.7699C1.16 19.1699 2.91 21.9999 5.59 21.9999H18.35C20.95 21.9999 22.7 19.3499 21.68 16.9599Z"
                stroke={color}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M6.97 8C8.62686 8 9.97 6.65685 9.97 5C9.97 3.34315 8.62686 2 6.97 2C5.31315 2 3.97 3.34315 3.97 5C3.97 6.65685 5.31315 8 6.97 8Z"
                stroke={color}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};
