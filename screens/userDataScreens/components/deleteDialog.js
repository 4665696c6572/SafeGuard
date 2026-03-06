
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
						<Text style={[ styles.save_button_text, styles.alert ]}>Delete { description }</Text>
					</TouchableOpacity>
				</View>
			: null
			}

			<Dialog.Container visible={ dialogVisible }>
				<Dialog.Title>{ title }</Dialog.Title>
				<Dialog.Description style={ styles.delete }>
					Do you want to delete this { description }? { "\n" }
					You cannot undo this action.
				</Dialog.Description>
				<Dialog.Button label="Cancel" onPress={ ( ) => handleCancel( table ?? '' ) } style={{color: '#000' }}/>
				<Dialog.Button label="Delete" onPress={ ( ) => handleDelete( table ?? '' ) } style={{color: '#7e0404' }}/>
			</Dialog.Container>
		</View>
	)
}
