import { useCallback, useState } from 'react';

import selectGameData from '../database/selectGameData.js';


// Loads non-content game data
export default function useLoadGameData( db )
{
	const [ loadedData, setLoadedData ] = useState( );
	const [ loadingData, setLoadingData ] = useState( true );


	const loadData = useCallback( async ( ) =>
	{	
		try
		{
			const game_data = await selectGameData( db );
			setLoadedData( game_data );
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

	return [ loadedData, loadingData, loadData ];
}