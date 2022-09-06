import React, { useCallback, useEffect, useState } from 'react';
import {
	Text,
	Animated,
	Platform,
	PixelRatio,
	useWindowDimensions,
} from 'react-native';

export interface NotifyPopUpProps {
	message: string;
	duration: number;
	endOpacityTiming: number;
	initOpacityTiming: number;
}

export const PopUp: React.FC<NotifyPopUpProps> = ({
	message,
	duration,
	endOpacityTiming,
	initOpacityTiming,
}) => {
	const { height, width } = useWindowDimensions();
	const scale = width / 320;

	const [opacity] = useState(new Animated.Value(0));

	const closeBadgeNotification = useCallback(() => {
		Animated.timing(opacity, {
			toValue: 0,
			useNativeDriver: false,
			duration: endOpacityTiming,
		}).start();
	}, [endOpacityTiming, opacity]);

	const normalize = useCallback(
		(size: number) => {
			const newSize = size * scale;
			if (Platform.OS === 'ios') {
				return Math.round(PixelRatio.roundToNearestPixel(newSize));
			} else {
				return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
			}
		},
		[scale]
	);

	useEffect(() => {
		let timeout: NodeJS.Timeout;

		Animated.timing(opacity, {
			toValue: 1,
			useNativeDriver: false,
			duration: initOpacityTiming,
		}).start((end) => {
			if (end.finished) {
				timeout = setTimeout(() => {
					closeBadgeNotification();
				}, duration);
			}
		});

		return () => clearTimeout(timeout);
	}, [opacity, closeBadgeNotification, initOpacityTiming, duration]);

	return (
		<Animated.View
			style={{
				opacity,
				padding: 8,
				height: 50,
				borderRadius: 10,
				top: height - 120,
				flexDirection: 'row',
				position: 'absolute',
				alignItems: 'center',
				backgroundColor: '#999898',
				justifyContent: 'space-between',
				width: width - message.length * 100,
			}}
		>
			<Text
				style={{ fontSize: normalize(17), color: 'white' }}
				numberOfLines={1}
			>
				{message}
			</Text>
		</Animated.View>
	);
};
