import { Dimensions, StyleSheet } from 'react-native';

const screen_height = Dimensions.get( 'screen' ).height;
const screen_width = Dimensions.get( 'screen' ).width;
const button_size = Dimensions.get( 'screen' ).width * 0.33;

const blue = '#0b3e82ff';
const blue_light = '#d1dce4ff';
const blue_river = '#0054FF';
const gold = '#ebb221';
const green = '#008000';
const green_light = '#98FB98';
const red = '#7e0404';

const styles = StyleSheet.create(
{
	alert:
	{
		color: red,
		fontWeight: 900
	},
	alert_row:
	{
		alignItems: 'center',
		paddingTop: 20
	},
	badge_large:
	{
		borderColor: gold,
		borderRadius: 60,
		borderWidth: 3,
		height: 120,
		width: 120
	},
	badge_small:
	{
		borderColor: gold,
		borderRadius: 40,
		borderWidth: 2,
		height: 80,
		width: 80
	},
	badge_container:
	{
		flexDirection: 'column',
		marginBottom: 30,
		marginTop: 10
	},
	badge_modal_container:
	{
		alignItems: 'center',
		alignSelf: 'center',
		backgroundColor: blue_light,
		flex: 1,
		gap: 20,
		paddingTop: 100
	},
	badge_row_lower:
	{
		flexDirection: 'row',
		gap: 20,
		height: 80,
		justifyContent: 'space-between',
		paddingLeft: 10,
		paddingRight: 10
	},
	badge_row_upper:
	{
		flexDirection: 'row',
		gap: 10,
		height: 60,
		justifyContent: 'center'
	},
	bottom_tab_container:
	{
		backgroundColor: blue_light,
		borderColor: blue,
		borderTopWidth: 5,
		flex: 1
	},
	button_end:
	{
		flexDirection: 'row',
		justifyContent: 'flex-end'
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
		backgroundColor: blue_light,
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
		backgroundColor: blue_light,
		borderBottomWidth: 5,
		borderColor: blue,
		borderTopWidth: 5,
		flex: 1
	},
	count_text:
	{
		color: blue,
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
		backgroundColor: blue_light,
		flex: 1,
		paddingLeft: '4%',
		paddingRight: '4%',
		paddingTop: '4%'
	},
	data_container_view:
	{
		backgroundColor: blue_light,
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
	delete_dialog_button:
	{
		color: '#000',
		fontWeight: 900
	},
	delete_dialog_button_row:
	{
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	delete_text:
	{
		color: 'black',
		fontSize: 18,
		fontWeight: 400,
		textAlign: 'center'
	},
	expand_button:
	{
		alignItems: 'flex-end',
		fontSize: 18,
		marginRight: 5
	},
	game_area:
	{
		backgroundColor: green,
		flex: 1,
		justifyContent: 'center',
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
	game_button_round:
	{
		borderRadius: 50,
		flex: 1,
		height: 65
	},
	game_button_text:
	{
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
		paddingLeft: 10,
		paddingRight: 10,
		textAlign: 'center'
	},
	game_mc_answers:
	{
		alignItems: 'center',
		flex: 1,
		flexDirection: 'row',
		gap: 10
	},
	game_mc_column:
	{
		flex: 3,
		gap: 5,
		justifyContent: 'space-between',
		marginBottom: 10,
		marginTop: 0,
		paddingTop: 0
	},
	game_mc_question:
	{
		alignItems: 'flex-start',
		justifyContent: 'flex-start'
	},
	game_mc_question_text:
	{
		color: blue,
		fontSize: 20,
		fontWeight: '900'
	},
	game_frog:
	{
		left: 0,
		position: 'absolute',
		top: 0
	},
	game_level_area:
	{
		flex: 1,
		gap: '5%',
		justifyContent: 'flex-start',
		marginBottom: '15%',
		marginLeft: '5%',
		marginRight: '5%',
		marginTop: '10%'
	},
	game_lily:
	{
		left: 0,
		position: 'absolute',
		top: 0
	},
	game_lily_container:
	{
		height: 80,
		width: 80
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
		marginBottom: 0
	},
	game_mc_text:
	{
		color: blue,
		fontSize: 18,
		fontWeight: 'bold',
		textAlign: 'left'
	},
	game_text_container:
	{
		flex: 4,
		justifyContent: 'space-evenly'
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
		backgroundColor: blue_river,
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
		width: screen_width * 0.44
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
	home_row:
	{
		flexDirection: 'row',
		gap: screen_width * 0.05,
		paddingLeft: 10,
		paddingRight: 10
	},
	menu:
	{
		backgroundColor: blue_light,
		borderBottomWidth: 0.75,
		paddingBottom: 20,
		paddingLeft: 15,
		paddingTop: 15
	},
	menu_text:
	{
		color: '#454545'
	},
	person_row:
	{
		flexDirection: 'row',
		justifyContent: 'space-between',
		gap: 5, backgroundColor:'red'
	},
	picker_item:
	{
		backgroundColor: blue_light,
		color: '#454545'
	},
	picker_view:
	{
		backgroundColor: blue_light,
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
		flexDirection: 'row',
		height: 25,
		justifyContent: 'space-between'
	},
	river:
	{
		backgroundColor: blue_river,
		borderTopLeftRadius: 50,
		borderTopRightRadius: 50,
		borderWidth: 0,
		marginTop: -20,
		paddingLeft: 5,
		paddingRight: 5,
		paddingTop: 20
	},
	river_column:
	{
		flex: 0.3,
		flexDirection:'column',
		height: 100,
		marginBottom: 10
	},
	river_container:
	{
		flex: 1/8,
		flexDirection:'row',
		gap: 10,
		marginBottom: 10
	},
	save_button_text:
	{
		color: blue,
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
		color: blue_river,
		fontSize: 24,
		fontWeight: '900',
		textAlign: 'center'
	},
	score_text_green:
	{
		color: green
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
		backgroundColor: blue_river
	},
	streak_day_text:
	{
		fontSize: 16,
		color:green_light,
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
		color:green_light,
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
		backgroundColor: blue_light,
		color: '#000',
		fontSize: 17,
		fontWeight: 400,
		minHeight: 20,
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
		borderColor: blue_river,
		fontSize: 22,
		marginBottom: 10,
		paddingBottom: 2
	},
	validation_container:
	{
		paddingBottom: 10,
		paddingLeft: 15,
		paddingTop: 10
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
	},
	weather_temp_column:
	{
		alignItems: 'center',
		flex: 1/4,
		justifyContent: 'space-between'
	},
	weather_temp_image:
	{
		height: 75,
		width: 75
	},
	weather_temp_row:
	{
		flexDirection:'row',
		justifyContent: 'space-between'
	}
});

export default styles;