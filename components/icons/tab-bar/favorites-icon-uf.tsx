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

export interface FavoritesIconUFProps extends SvgProps {
    size?: number;
    color?: string;
}

export const FavoritesIconUF = ({
    size = 24,
    color = Theme.colors.text.primary, // Default to theme text color
    style,
    ...props
}: FavoritesIconUFProps) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} {...props}>
            <Path
                d="M12.62 20.8101C12.28 20.9301 11.72 20.9301 11.38 20.8101C8.48 19.8201 2 15.6901 2 8.6901C2 5.6001 4.49 3.1001 7.56 3.1001C9.38 3.1001 10.99 3.9801 12 5.3401C13.01 3.9801 14.63 3.1001 16.44 3.1001C19.51 3.1001 22 5.6001 22 8.6901C22 15.6901 15.52 19.8201 12.62 20.8101Z"
                stroke={color}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};
