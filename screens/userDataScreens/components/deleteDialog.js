
import { Text, TouchableOpacity, View } from 'react-native';
import Dialog from "react-native-dialog";

import styles from "../../../styles/styles.js";


export const DeleteDialog = ({
								buttonVisibleCondition, description, dialogVisible, handleCancel,
								handleDelete, setDialogVisible, table, title
							}) =>
{
	return(
		<View>
			{
				buttonVisibleCondition ?
				<View style={ styles.contact_button }>
					<TouchableOpacity
						accessibilityLabel='Delete button'
						accessibilityHint={ `Press to delete this ${ description }.`}
						onPress={ ( ) => setDialogVisible( true ) }
					>
						<Text style={[ styles.save_button_text, styles.alert ]}>
							Delete { description }
						</Text>
					</TouchableOpacity>
				</View>
			: null
			}

			<Dialog.Container visible={ dialogVisible }>
				<Dialog.Title style={[ styles.delete_text, { fontWeight: 900 } ]}>
					{ title }
				</Dialog.Title>

				<Dialog.Description style={ styles.delete_text }>
					Delete this { description }?
				</Dialog.Description>

				<Dialog.Description style={ styles.delete_text }>
					You cannot undo this action.
				</Dialog.Description>

				<View style={ styles.delete_dialog_button_row }>
					<Dialog.Button
						label="Cancel"
						onPress={ ( ) => handleCancel( table ?? '' ) }
						style={ styles.delete_dialog_button }
					/>
					<Dialog.Button label="Delete"
						onPress={ ( ) => handleDelete( table ?? '' ) }
						style={[ styles.delete_dialog_button, { color: '#7e0404' }]}
					/>
				</View>
			</Dialog.Container>
		</View>
	)
}
