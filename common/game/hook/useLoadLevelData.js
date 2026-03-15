import { useCallback, useState } from 'react';

import selectLevelData from '../database/selectLevelData.js';


// Loads level content data
export default function useLoadLevelData( db, screen_name, level_category, questions_per_level )
{
	const [ loadedData, setLoadedData ] = useState( );
	const [ loadingData, setLoadingData ] = useState( true );

	const loadData = useCallback( async ( ) =>
	{
		try
		{
			const level_data = await selectLevelData( db, screen_name, level_category, questions_per_level );
			setLoadedData( level_data );
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

	return    [ loadedData, loadingData, loadData ];
}