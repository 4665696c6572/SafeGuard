import deleteEmergencyData from "./database/deleteEmergencyData.js";

/*
 *	Deletes user data from db & refreshed data.
 *	Called from Screen via button press.
 */
export default async function deleteFromDB( db, table, id, loadData )
{
	await deleteEmergencyData( db, table, id );

	await loadData( );
}