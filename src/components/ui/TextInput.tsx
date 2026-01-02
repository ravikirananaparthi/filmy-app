import React from 'react';
import { TextInput as RNTextInput, TextInputProps as RNTextInputProps } from 'react-native';

export interface TextInputProps extends RNTextInputProps {
    weight?: 'regular' | 'medium' | 'semibold' | 'bold';
}

const fontFamilyMap = {
    regular: 'GoogleSansFlex_400Regular',
    medium: 'GoogleSansFlex_500Medium',
    semibold: 'GoogleSansFlex_600SemiBold',
    bold: 'GoogleSansFlex_700Bold',
} as const;

/**
 * Custom TextInput component with Google Sans Flex font applied by default.
 * Use this instead of the native TextInput component throughout the app.
 */
export const TextInput = React.forwardRef<RNTextInput, TextInputProps>(
    ({ style, weight = 'regular', ...props }, ref) => {
        return (
            <RNTextInput
                ref={ref}
                {...props}
                style={[
                    { fontFamily: fontFamilyMap[weight] },
                    style,
                ]}
            />
        );
    }
);

TextInput.displayName = 'TextInput';

export default TextInput;
