import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export interface UploadIconProps extends SvgProps {
    size?: number;
    color?: string;
}

export const UploadIcon = ({ size = 24, color = '#fff', style, ...props }: UploadIconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} {...props}>
        <Path
            d="M12 3L7 8H10V16H14V8H17L12 3Z"
            fill={color}
        />
        <Path
            d="M5 18H19V20H5V18Z"
            fill={color}
        />
    </Svg>
);
