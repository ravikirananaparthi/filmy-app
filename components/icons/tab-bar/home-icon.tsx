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

export interface HomeIconProps extends SvgProps {
    size?: number;
    color?: string;
}

export const HomeIcon = ({
    size = 24,
    color = Theme.colors.text.primary, // Default to theme text color
    style,
    ...props
}: HomeIconProps) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} {...props}>
            <Path
                d="M20.0402 6.81994L14.2802 2.78994C12.7102 1.68994 10.3002 1.74994 8.79023 2.91994L3.78023 6.82994C2.78023 7.60994 1.99023 9.20994 1.99023 10.4699V17.3699C1.99023 19.9199 4.06023 21.9999 6.61023 21.9999H17.3902C19.9402 21.9999 22.0102 19.9299 22.0102 17.3799V10.5999C22.0102 9.24994 21.1402 7.58994 20.0402 6.81994ZM12.7502 17.9999C12.7502 18.4099 12.4102 18.7499 12.0002 18.7499C11.5902 18.7499 11.2502 18.4099 11.2502 17.9999V14.9999C11.2502 14.5899 11.5902 14.2499 12.0002 14.2499C12.4102 14.2499 12.7502 14.5899 12.7502 14.9999V17.9999Z"
                fill={color}
            />
        </Svg>
    );
};
