import { Dimensions, StyleSheet } from 'react-native';

const button_size = Dimensions.get('screen').width * 0.33;

const styles = StyleSheet.create({
	container: 
	{ 
		flex: 1,
		backgroundColor: '#D8DFE6', 
		marginTop: '10%',
		
	},
	game_area: 
	{
		// alignItems: 'center',
		justifyContent: 'center',
		marginTop: '10%',
		// marginBottom: '15%',
		gap: '5%',
		// backgroundColor: 'purple',
		marginLeft: '5%',
		marginRight: '5%',
	},
	game_box_small: // 2 columns
	{
		borderRadius: 20,
		width: '45%', 
		height: '80%', 
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom: 0,
		marginBottom: 0,
		paddingTop: 0,
		marginTop: 0,
		// backgroundColor: 'red'
		// gap: '50%',
		// marginLeft: '10%',
		// marginRight: '10%'
		
	},
	game_box_large: // 1 column
	{
		borderRadius: 20,

		height: '17%', 
		// width: '90%',
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom: 0,
		marginBottom: 0,
		paddingTop: 0,
		marginTop: 0,
		// marginLeft: '10%',
		// marginRight: '10%'

	},
	game_box_active:
	{
		backgroundColor: '#2f73ccff', 
	},
	game_column:
	{
		flex: 1, 
		// flexDirection: 'row', 
		gap: '5%',
		// backgroundColor: 'pink',
		paddingBottom: '10%',
		marginBottom: 0,
		paddingTop: 0,
		marginTop: 0,
	},
	game_row:
	{
		flex: 1, 
		flexDirection: 'row', 
		gap: '10%',
		paddingBottom: 0,
		marginBottom: 0,
		paddingTop: 0,
		marginTop: 0,
	},
	game_text:
	{
		color: 'white',
		fontWeight: 'bold',
		fontSize: 18
	},
	game_box_selected:
	{
		backgroundColor: '#1152a7ff', 
		opacity: 1,
		borderColor: 'white',
		borderWidth: 2
	},
	game_box_disabled:
	{
		opacity: 0.7
	},
	count:
	{
		
		// backgroundColor: 'green',
		// alignSelf: 'flex-end',
		// marginRight: '10%',
		// width: '50%'
		// paddingRight: '10%'
		// marginBottom: '5%'
	},
	score_text:
	{
		color: '#0b3e82ff',
		fontSize: 26,
		fontWeight: '900',
		textAlign: 'center'
		
	},
	score:
	{
		// backgroundColor: 'red',
		// alignSelf: 'flex-start',
		// width: '50%'
		// marginLeft: '10%',
		// marginBottom: '5%'
	},
	score_row:
	{
		flexDirection: 'row',
		justifyContent: 'space-between',
		// backgroundColor: 'purple'
			marginBottom: '5%',
		gap: '25%'
	}, 
	multiple_choice_question:
	{
		justifyContent: 'flex-start',
		alignItems: 'flex-start'
	},
	text_button:
	{
		color: 'black',
		fontSize: 20,
		textAlign: 'center'
	},
	button_chrome_grey:
	{
		backgroundColor: '#DBE2E9',
		marginTop: 10,
		marginBottom: 10
	},
	multiple_choice_question_text:
	{
		color: '#0b3e82ff',
		fontSize: 26,
		fontWeight: '900',
	},
	category: 
	{
		marginBottom: 10,
		fontSize: 18,
	},
	text:
	{
		fontSize: 16
	},
	game_button:
	{
		height: button_size,
		width: button_size,
		borderRadius: '50%',
		backgroundColor: 'blue',
		justifyContent: 'center', 
		alignContent: 'center',
		
	},
	game_button_start:
	{
		// flexDirection: 'row',
		// justifyContent: 'flex-start',

		// backgroundColor: 'purple'
		
	},
	game_button_center:
	{
		flexDirection: 'row',
		justifyContent: 'center', 
			// alignContent: 'center',
		// alignSelf: 'center'
		// backgroundColor: 'pink',
		// marginLeft: 0,


	},
	game_button_end:
	{
		flexDirection: 'row',
		justifyContent: 'flex-end',
		// alignSelf: 'flex-end'
		// alignContent: 'flex_end',
		// alignItems: 'flex-end'
		// backgroundColor: 'orange'
		
	},
	game_button_text:
	{
		textAlign: 'center',
		verticalAlign: 'middle',
		color: 'white',
		fontWeight: 'bold',
		fontSize: 18,
		// backgroundColor: 'red'
	},
	image:
	{
		backgroundColor: 'orange',
		alignSelf: 'center',

	},
	blue_01:
	{
		backgroundColor: '#63edffff', 
	},
	blue_02:
	{
		backgroundColor: '#639affff'
	}


});





export default styles;