import { useCallback, useState } from 'react';

import selectEmergencyData from '../database/selectEmergencyData.js';


/*
 *	Hook for loading user input data from the db.
 *	Load function returns for data refresh.
 */
export default function useLoadEmergencyData( db, table, condition )
{
	const [ loadedData, setLoadedData ] = useState( );
	const [ loadingData, setLoadingData ] = useState( true );

		const loadData = useCallback( async ( ) =>
		{
			try
			{
				const data = await selectEmergencyData( db, table, condition );
				setLoadedData( data )
			}
			catch ( error )
			{
				console.error( error );
			}
			finally
			{
				setLoadingData( false );
			}
		}, [ db ]);

	return [ loadedData, setLoadedData, loadingData, loadData ];
}