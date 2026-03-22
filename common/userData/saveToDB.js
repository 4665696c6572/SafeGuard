import insertEmergencyData from '../../common/userData/database/insertEmergencyData'
import updateEmergencyData from '../../common/userData/database/updateEmergencyData'

/*
 *	If an ID exists the data is updated, if not it is inserted in the database.
 *	If the ID is needed for the following screen ( contact screen ) then it is
 *	returned.  Data refresh is also called.
 */
export default async function saveToDB( db, table, data, id, loadData, shouldNavigate )
{
	let new_id;

	if ( data?.[id] )
	{
		await updateEmergencyData( db, table, data );
	}
	else
	{
		if( shouldNavigate ) new_id = await insertEmergencyData( db, table, data );
		else await insertEmergencyData( db, table, data );
	}

	await loadData( );

	if ( shouldNavigate )    return new_id;
}