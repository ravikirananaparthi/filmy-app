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

export interface SearchIconProps extends SvgProps {
    size?: number;
    color?: string;
}

export const SearchIcon = ({
    size = 24,
    color = Theme.colors.text.primary, // Default to theme text color
    style,
    ...props
}: SearchIconProps) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} {...props}>
            <Path
                d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                fill={color}
            />
            <Path
                d="M21.3 22.0001C21.12 22.0001 20.94 21.9301 20.81 21.8001L18.95 19.9401C18.68 19.6701 18.68 19.2301 18.95 18.9501C19.22 18.6801 19.66 18.6801 19.94 18.9501L21.8 20.8101C22.07 21.0801 22.07 21.5201 21.8 21.8001C21.66 21.9301 21.48 22.0001 21.3 22.0001Z"
                fill={color}
            />
        </Svg>
    );
};
