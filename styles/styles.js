import { Dimensions, StyleSheet } from 'react-native';

const button_size = Dimensions.get('screen').width * 0.33;
const screen_width = Dimensions.get('screen').width;

const styles = StyleSheet.create({
	allergy_alert:
	{
		color: 'rgb(126, 4, 4)',
		fontWeight: 900
	},
	container: 
	{ 
		flex: 1,
		backgroundColor: '#D8DFE6', 
		marginTop: '10%',
		
	},
	game_area: 
	{
		justifyContent: 'center',
		marginTop: '10%',
		gap: '5%',
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
		
	},
	game_box_large: // 1 column
	{
		borderRadius: 20,
		height: '17%', 
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom: 0,
		marginBottom: 0,
		paddingTop: 0,
		marginTop: 0,
	},
	game_box_active:
	{
		backgroundColor: '#2f73ccff', 
	},
	game_column:
	{
		flex: 1, 
		gap: '5%',
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
	count_text :
	{
		color: '#0b3e82ff',
		fontSize: 16,
		fontWeight: '900',
		textAlign: 'right'
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
		alignContent: 'center'
	},
	score_row:
	{
		flexDirection: 'row',
		justifyContent: 'space-between',
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
	game_button_center:
	{
		flexDirection: 'row',
		justifyContent: 'center'
	},
	game_button_end:
	{
		flexDirection: 'row',
		justifyContent: 'flex-end'
		
	},
	game_button_text:
	{
		textAlign: 'center',
		verticalAlign: 'middle',
		color: 'white',
		fontWeight: 'bold',
		fontSize: 18,
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
	},
	progress_bar:
	{
		paddingLeft: screen_width * 0.10,
	},
	progress_bar_container: 
	{
		flexDirection:'row', 
		height: 25,
		justifyContent: 'space-between'
	},
});


export default styles;