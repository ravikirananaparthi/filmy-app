import React from 'react';
import Svg, { SvgProps, Line } from 'react-native-svg';

export interface UploadIconProps extends SvgProps {
    size?: number;
    color?: string;
    strokeWidth?: number;
}

export const UploadIcon = ({ size = 24, color = '#fff', strokeWidth = 2.5, style, ...props }: UploadIconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} {...props}>
        <Line x1="12" y1="4" x2="12" y2="20" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Line x1="4" y1="12" x2="20" y2="12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
);
