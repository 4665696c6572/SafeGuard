import insertEmergencyData from '../../common/userData/database/insertEmergencyData'
import updateEmergencyData from '../../common/userData/database/updateEmergencyData'

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