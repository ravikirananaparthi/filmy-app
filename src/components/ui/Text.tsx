import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';

export interface TextProps extends RNTextProps {
    weight?: 'regular' | 'medium' | 'semibold' | 'bold';
}

const fontFamilyMap = {
    regular: 'GoogleSansFlex_400Regular',
    medium: 'GoogleSansFlex_500Medium',
    semibold: 'GoogleSansFlex_600SemiBold',
    bold: 'GoogleSansFlex_700Bold',
} as const;

/**
 * Custom Text component with Google Sans Flex font applied by default.
 * Use this instead of the native Text component throughout the app.
 */
export function Text({ style, weight = 'regular', ...props }: TextProps) {
    return (
        <RNText
            {...props}
            style={[
                { fontFamily: fontFamilyMap[weight] },
                style,
            ]}
        />
    );
}

// Re-export for convenience
export default Text;
