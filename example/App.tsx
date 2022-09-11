import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, PopUp } from '../src';

const App: React.FC = () => {
	return (
		<View style={styles.container}>
			<Card
				messageColor="blue"
				type="warn"
				duration={5000}
				message="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
				endOpacityTiming={1500}
				endTranslateTiming={1200}
				initOpacityTiming={1200}
				initTranslateTiming={1500}
			/>
			<PopUp
				duration={3000}
				endOpacityTiming={1}
				initOpacityTiming={0}
				message="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export default App;
