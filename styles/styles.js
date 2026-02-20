import { Dimensions, StyleSheet } from 'react-native';

const screen_width = Dimensions.get('screen').width;
const button_size = Dimensions.get('screen').width * 0.33;

const styles = StyleSheet.create({
	container:
	{
		flex: 1,
		backgroundColor: '#d1dce4ff',
		paddingTop: '10%'
	},
	edit_container:
	{
		flex: 1,
		backgroundColor: '#d1dce4ff',
		paddingTop: '2%'
	},
	data_container:
	{
		marginLeft: '4%',
		marginRight: '4%',
	},
	game_area:
	{
		marginBottom: '10%',
		justifyContent: 'center',
		marginTop: '5%',
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
	// category:
	// {
	// 	marginBottom: 10,
	// 	fontSize: 18,
	// },

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
	},
	progress_bar:
	{
		paddingLeft: screen_width * 0.10
	},
	progress_bar_container: // Games
	{
		flexDirection:'row',
		height: 25,
		justifyContent: 'space-between'
	},
	scroll_bar: // Emergency Data Form
	{
		flexDirection: 'row',
		flex: 0.1,
		backgroundColor: '#DBE2E9',
		alignContent: 'flex-end',
		marginBottom: '12%'
	},
	scroll_bar_button:
	{
		width: screen_width / 3,
		justifyContent: 'center',
		borderColor: 'blue',
		borderWidth: 2,
		paddingLeft: 2,
		paddingRight: 2
	},
	accordion_list:
	{
		backgroundColor: '#d1dce4ff',
		marginLeft: '10%',
		width: '80%',
		fontSize: 30
	},
	picker_view:
	{
		backgroundColor: '#d1dce4ff',
		borderBottomWidth: 0.75, 
		paddingLeft: 22,
		paddingRight: 15,
	},
	picker:
	{
		color: '#454545'
	},
	alert:
	{
		color: 'rgb(126, 4, 4)',
		fontWeight: 900
	},
	menu:
	{
		backgroundColor: '#d1dce4ff',
		borderBottomWidth: 0.75,
		paddingBottom: 20,
		paddingLeft: 15,
		paddingTop: 15,
	},
	menu_text:
	{
		color: '#454545'
	},
	text_input:
	{
		backgroundColor: '#d1dce4ff',
		color: '#000',
		fontSize: 17,
		fontWeight: 400,
		paddingLeft: 15
	
	},
	text_line:
	{
		paddingBottom: 20,
		paddingLeft: 15,
		paddingTop: 15
	},
	save_button_text:
	{
		color: '#0b3e82ff',
		fontSize: 20,
		fontWeight: '900',
	},
	modal:
	{
		flex: 1,
		backgroundColor: '#D8DFE6',
		paddingTop: '5%'
	},
	title_bar:
	{
		borderBottomWidth: 2,
		borderColor: 'blue',
		fontSize: 22,
		marginBottom: 10,
		paddingBottom: 2
	},
	text:
	{
		flexShrink: 1,
		fontSize: 16,
		marginBottom: 2
	},
	heading_text:
	{
		fontSize: 18,
		marginBottom: 3
	},
	heading_row:
	{
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	save_row:
	{
		flexDirection: 'row',
		gap: 5,
		justifyContent: 'space-between',
		marginTop: 20,
		// marginLeft: 20,
		// marginRight: 20
	},
	section:
	{
		marginBottom: 20,
		marginTop: 20,
	},
	section_small:
	{
		marginBottom: 10,
		marginTop: 10,
	},
	row_height:
	{
		height: 40
	},
	data_button_size:
	{
		marginBottom: 20,
		marginTop: 20,
		paddingBottom: 20,
		paddingTop: 20
	},
	text_list:
	{
		alignItems: 'center',
		borderBottomWidth: 0.75,
		flexDirection: 'row',
		height: 50,
		justifyContent: 'space-between',
		paddingLeft: 10,
		paddingRight: 10
	},
	expand_button:
	{
		alignItems: 'flex-end',
		fontSize: 18,
		flex: 0.1,
		marginRight: 5
	},
	contact_button:
	{
		marginBottom: 5,
		marginTop: 5,
		paddingBottom: 5,
		paddingTop: 5
	},
	alert_row:
	{
		alignItems: 'center',
		paddingTop: 20
	},
	checkbox_row:
	{ 		
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 30,
		marginTop: 30
	}
});

export default styles;