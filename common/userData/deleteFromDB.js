import deleteEmergencyData from "./database/deleteEmergencyData.js";

export default async function deleteFromDB( db, table, id, loadData )
{
	await deleteEmergencyData( db, table, id );

	await loadData( );
}