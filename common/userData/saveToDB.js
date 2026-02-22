import insertEmergencyData from '../../common/userData/database/insertEmergencyData'
import updateEmergencyData from '../../common/userData/database/updateEmergencyData'

export default async function saveToDB( table, data, db, id, loadData, shouldNavigate )
{
	let new_id;

	if ( data?.[id] )
	{
		await updateEmergencyData( table, data, db );
	}
	else
	{
		if( shouldNavigate ) new_id = await insertEmergencyData( table, data, db );
		else await insertEmergencyData( table, data, db );
	}

	await loadData( );
	if ( shouldNavigate )    return new_id;
}