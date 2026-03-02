import { Dimensions, StyleSheet } from 'react-native';

const screen_height = Dimensions.get('screen' ).height;
const screen_width = Dimensions.get('screen' ).width;
const button_size = Dimensions.get('screen' ).width * 0.33;

const styles = StyleSheet.create(
{
	alert:
	{
		color: '#7e0404',
		fontWeight: 900
	},
	alert_row:
	{
		alignItems: 'center',
		paddingTop: 20
	},
	bottom_tab_container:
	{
		backgroundColor: '#d1dce4ff',
		flex: 1,
		marginTop: 38
	},
	button_chrome_grey:
	{
		backgroundColor: '#DBE2E9',
		marginBottom: 10,
		marginTop: 10
	},
	checkbox_row:
	{
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 30,
		marginTop: 30
	},
	cheer_container:
	{
		backgroundColor: '#d1dce4ff',
		flex: 1,
		paddingTop: 100
	},
	cheer_image:
	{
		alignSelf: 'center'
	},
	contact_button:
	{
		alignItems: 'center',
		paddingBottom: 25
	},
	container:
	{
		backgroundColor: '#d1dce4ff',
		flex: 1,
		marginBottom: 45,
		marginTop: 38
	},
	count_text:
	{
		color: '#0b3e82ff',
		fontSize: 16,
		fontWeight: '900',
		textAlign: 'right'
	},
	data_button_size:
	{
		marginBottom: 20,
		marginTop: 20,
		paddingBottom: 20,
		paddingTop: 20
	},
	data_condition_height:
	{
		height: screen_height * 0.37
	},
	
	data_container_edit:
	{
		backgroundColor: '#d1dce4ff',
		flex: 1,
		paddingLeft: '4%',
		paddingRight: '4%',
		paddingTop: '4%'
	},
	data_container_view:
	{
		backgroundColor: '#d1dce4ff',
		flex: 1,
		paddingLeft: '4%',
		paddingRight: '4%',
		paddingTop: '10%'
	},
	data_section:
	{
		marginBottom: 20,
		marginTop: 20
	},
	data_section_small:
	{
		marginBottom: 10,
		marginTop: 10
	},
	expand_button:
	{
		alignItems: 'flex-end',
		fontSize: 18,
		marginRight: 5
	},
	game_area:
	{
		backgroundColor: 'green',
		flex: 1,
		justifyContent: 'center',
		marginBottom: 45,
		marginTop: 38,
		paddingLeft: '5%',
		paddingRight: '5%'
	},
	game_box_active:
	{
		backgroundColor: '#2f73ccff'
	},
	game_box_small: // 2 columns
	{
		alignItems: 'center',
		borderRadius: 20,
		height: '80%',
		justifyContent: 'center',
		marginBottom: 0,
		marginTop: 0,
		paddingBottom: 0,
		paddingTop: 0,
		width: '45%'
	},
	game_box_large: // 1 column
	{
		alignItems: 'center',
		borderRadius: 20,
		height: '17%',
		justifyContent: 'center',
		marginBottom: 0,
		marginTop: 0,
		paddingBottom: 0,
		paddingTop: 0
	},
	game_box_disabled:
	{
		opacity: 0.7
	},
	game_box_selected:
	{
		backgroundColor: '#1152a7ff',
		borderColor: 'white',
		borderWidth: 2,
		opacity: 1
	},
	game_button:
	{
		alignContent: 'center',
		borderRadius: '50%',
		height: button_size,
		justifyContent: 'center',
		width: button_size
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
	game_button_start:
	{
		flexDirection: 'row',
		justifyContent: 'flex-start'
	},
	game_button_text:
	{
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
		textAlign: 'center',
		verticalAlign: 'middle'
	},
	game_column:
	{
		flex: 1,
		gap: '5%',
		marginBottom: 0,
		marginTop: 0,
		paddingBottom: '10%',
		paddingTop: 0
	},
	game_frog:
	{
		left: 0,
		position: 'absolute',
		top: 0
	},
	game_level_area:
	{
		gap: '5%',
		justifyContent: 'center',
		marginBottom: '15%',
		marginLeft: '5%',
		marginRight: '5%',
		marginTop: '5%'
	},
	game_lily:
	{
		left: 0,
		position: 'absolute',
		top: 0
	},
	game_lily_container:
	{
		height: '100%',
		width: '100%'
	},
	game_row:
	{
		flex: 1,
		flexDirection: 'row',
		gap: '10%',
		marginBottom: 0,
		marginTop: 0,
		paddingBottom: 0,
		paddingTop: 0
	},
	game_screen_container:
	{
		flex: 1,
		marginBottom: 0,
		marginTop: 38
	},
	game_text:
	{
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold'
	},
	grass:
	{
		height: 50,
		marginTop: -40,
		width: screen_width * 0.9
	},
	heading_text:
	{
		fontSize: 18,
		marginBottom: 3
	},
	home_button:
	{
		backgroundColor: '#0054FF',
		borderRadius: 20,
		height: screen_width * 0.45 ,
		width: screen_width * 0.45 ,
		justifyContent: 'center'
	},
	home_button_image:
	{
		
		borderRadius: 20,
		height: screen_width * 0.44 ,
		marginLeft: 2,
		width: screen_width * 0.44,
		// justifyContent: 'center'
	},
	home_container:
	{
		gap: screen_width * 0.05,
		height: screen_height * 0.5,
		paddingTop: screen_height * 0.035
	},
	home_extra_margin:
	{
		marginTop: 100
	},
	home_container_weather:
	{
		height: screen_height * 0.3
	},
	home_container_alert:
	{
		height: screen_height * 0.1,
		justifyContent: 'flex-end',
		paddingBottom: screen_height * 0.03
	},
	home_row:
	{
		flexDirection: 'row',
		gap: screen_width * 0.05,
		paddingLeft: 10,
		paddingRight: 10
	},
	menu:
	{
		backgroundColor: '#d1dce4ff',
		borderBottomWidth: 0.75,
		paddingBottom: 20,
		paddingLeft: 15,
		paddingTop: 15
	},
	menu_text:
	{
		color: '#454545'
	},
	multiple_choice_question:
	{
		alignItems: 'flex-start',
		justifyContent: 'flex-start'
	},
	multiple_choice_question_text:
	{
		color: '#0b3e82ff',
		fontSize: 26,
		fontWeight: '900'
	},
	picker:
	{
		color: '#454545'
	},
	picker_view:
	{
		backgroundColor: '#d1dce4ff',
		borderBottomWidth: 0.75,
		paddingLeft: 22,
		paddingRight: 15
	},
	progress_bar:
	{
		paddingLeft: screen_width * 0.10
	},
	progress_bar_container:
	{
		flexDirection:'row',
		height: 25,
		justifyContent: 'space-between'
	},
	river:
	{
		backgroundColor: '#0054FF',
		borderTopLeftRadius: 50,
		borderTopRightRadius: 50,
		borderWidth: 0,
		marginTop: -20,
		paddingLeft: 5,
		paddingRight: 5,
		paddingTop: 20
	},
	save_button_text:
	{
		color: '#0b3e82ff',
		fontSize: 20,
		fontWeight: '900'
	},
	save_row:
	{
		flexDirection: 'row',
		gap: 5,
		justifyContent: 'space-between',
		marginTop: 20
	},
	score:
	{
		alignContent: 'center'
	},
	score_text:
	{
		color: '#0054FF',
		fontSize: 24,
		fontWeight: '900',
		textAlign: 'center'
	},
	score_text_green:
	{
		color: '#90e2ac'
	},
	streak_columns:
	{
		alignItems: "center",
		justifyContent: 'space-between',
		marginHorizontal: 2
	},
	streak_container:
	{
		alignItems: 'center',
		backgroundColor: '#0054FF'
	},
	streak_day_text:
	{
		fontSize: 16,
		color: '#90e298',
		marginTop: 4,
		textAlign: 'center'
	},
	streak_icon_size:
	{
		height: screen_width * 0.13,
		width: screen_width * 0.13
	},
	streak_text:
	{
		color: '#90e298',
		fontSize: 26,
		fontWeight: '900',
		marginBottom: 20,
		textAlign: 'center'
	},
	text:
	{
		flexShrink: 1,
		fontSize: 16,
		marginBottom: 2
	},
	text_button:
	{
		color: 'black',
		fontSize: 20,
		textAlign: 'center'
	},
	text_input:
	{
		backgroundColor: '#d1dce4ff',
		color: '#000',
		fontSize: 17,
		fontWeight: 400,
		paddingLeft: 15
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
	title_bar:
	{
		borderBottomWidth: 2,
		borderColor: '#0054FF',
		fontSize: 22,
		marginBottom: 10,
		paddingBottom: 2
	},
	weather_forecast:
	{
		alignItems: 'center',
		flexDirection: 'column',
		width: screen_width * 0.45
	},
	weather_image:
	{
		height: 50,
		width: 50
	}
});

export default styles;