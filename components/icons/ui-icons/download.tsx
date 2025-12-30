import { Theme } from '@/constants/theme';
import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export interface DownloadIconProps extends SvgProps {
    size?: number;
    color?: string;
}

export const DownloadIcon = ({
    size = 24,
    color = Theme.colors.text.primary,
    style,
    ...props
}: DownloadIconProps) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} {...props}>
            <Path
                d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
                stroke={color}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M9 11.51L12 14.51L15 11.51"
                stroke={color}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M12 14.51V6.51001"
                stroke={color}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M6 16.51C9.89 17.81 14.11 17.81 18 16.51"
                stroke={color}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};
