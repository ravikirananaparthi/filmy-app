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

export interface MenuIconUFProps extends SvgProps {
    size?: number;
    color?: string;
}

export const MenuIconUF = ({
    size = 24,
    color = Theme.colors.text.primary, // Default to theme text color
    style,
    ...props
}: MenuIconUFProps) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} {...props}>
            <Path
                d="M12.1601 10.87C12.0601 10.86 11.9401 10.86 11.8301 10.87C9.45006 10.79 7.56006 8.84 7.56006 6.44C7.56006 3.99 9.54006 2 12.0001 2C14.4501 2 16.4401 3.99 16.4401 6.44C16.4301 8.84 14.5401 10.79 12.1601 10.87Z"
                stroke={color}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M7.15997 14.56C4.73997 16.18 4.73997 18.82 7.15997 20.43C9.90997 22.27 14.42 22.27 17.17 20.43C19.59 18.81 19.59 16.17 17.17 14.56C14.43 12.73 9.91997 12.73 7.15997 14.56Z"
                stroke={color}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};
