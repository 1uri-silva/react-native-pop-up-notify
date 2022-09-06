import React, { useCallback, useEffect, useState } from 'react';
import {
	Text,
	Animated,
	Platform,
	PixelRatio,
	useWindowDimensions,
	TouchableOpacity,
} from 'react-native';

export interface NotifyCardProps {
	message: string;
	duration: number;
	messageColor?: string;
	endOpacityTiming: number;
	initOpacityTiming: number;
	endTranslateTiming: number;
	initTranslateTiming: number;
	type?: 'error' | 'warn' | 'success';
}

export const Card: React.FC<NotifyCardProps> = ({
	type,
	message,
	duration,
	endOpacityTiming,
	initOpacityTiming,
	endTranslateTiming,
	initTranslateTiming,
	messageColor = 'white',
}) => {
	const { height, width } = useWindowDimensions();
	const scale = width / 320;

	const [translate] = useState(new Animated.Value(-100));
	const [opacity] = useState(new Animated.Value(0));

	const closeBadgeNotification = useCallback(() => {
		Animated.parallel([
			Animated.timing(translate, {
				toValue: -500,
				useNativeDriver: false,
				duration: endTranslateTiming,
			}),

			Animated.timing(opacity, {
				toValue: 0,
				useNativeDriver: false,
				duration: endOpacityTiming,
			}),
		]).start();
	}, [endOpacityTiming, endTranslateTiming, opacity, translate]);

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

	const switchType = useCallback(() => {
		switch (type) {
			case 'success':
				return 'rgb(154,205,50)';
			case 'warn':
				return 'rgb(240,230,140)';
			case 'error':
				return 'rgb(220,20,60)';

			default:
				return '#999898';
		}
	}, [type]);

	useEffect(() => {
		let timeout: NodeJS.Timeout;
		Animated.parallel([
			Animated.timing(translate, {
				toValue: 0,
				duration: initTranslateTiming,
				useNativeDriver: false,
			}),

			Animated.timing(opacity, {
				toValue: 1,
				duration: initOpacityTiming,
				useNativeDriver: false,
			}),
		]).start((end) => {
			if (end.finished) {
				timeout = setTimeout(() => {
					closeBadgeNotification();
				}, duration);
			}
		});

		return () => clearTimeout(timeout);
	}, [
		opacity,
		duration,
		translate,
		initOpacityTiming,
		initTranslateTiming,
		closeBadgeNotification,
	]);

	return (
		<Animated.View
			style={{
				opacity,
				padding: 8,
				height: 50,
				borderRadius: 5,
				top: height - 57,
				width: width - 10,
				flexDirection: 'row',
				alignItems: 'center',
				position: 'absolute',
				backgroundColor: switchType(),
				justifyContent: 'space-between',
				transform: [
					{
						translateX: translate,
					},
				],
			}}
		>
			<Text
				style={{ fontSize: normalize(17), color: messageColor }}
				numberOfLines={1}
			>
				{message}
			</Text>
			<TouchableOpacity
				style={{
					width: 70,
					height: 30,
					borderRadius: 8,
					justifyContent: 'center',
					backfaceVisibility: 'hidden',
				}}
				onPress={closeBadgeNotification}
			>
				<Text
					style={{
						color: 'white',
						textAlign: 'center',
						fontSize: normalize(15),
					}}
				>
					Close
				</Text>
			</TouchableOpacity>
		</Animated.View>
	);
};
