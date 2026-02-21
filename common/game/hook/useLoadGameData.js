import { useCallback, useState, useEffect } from 'react';

import selectGameData from '../database/selectGameData.js';

export default function useLoadGameData( db )
{
	const [ totalScore, setTotalScore ] = useState( );
	const [ loadingData, setLoadingData ] = useState( true );

	const loadData = useCallback(async () =>
	{	
		try
		{
			const game_data = await selectGameData( db );
			setTotalScore( game_data[0].score );
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

	return [ totalScore, setTotalScore, loadingData, loadData ];
}