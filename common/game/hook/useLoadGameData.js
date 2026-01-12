import { useState, useEffect } from 'react';


import formatLevelData from '../formatLevelData.js';
import selectLevelData from '../database/selectLevelData.js';


export default function useLoadGameData( db, screen_name, questions_per_level ) 
{
	const [ loadedData, setLoadedData ] = useState( );
	const [ loadingData, setLoadingData ] = useState( true );

	useEffect( () => {
		async function loadData() 
		{
			try 
			{
				const unformatted_data = await selectLevelData( db, screen_name, questions_per_level );
				const formatted_data = await formatLevelData( unformatted_data, screen_name );
				setLoadedData( formatted_data )
			} 
			catch ( error ) 
			{
				console.error( error );
			} 
			finally 
			{
				setLoadingData( false );
			}
		}
		loadData();
	}, []);

	return  [ loadedData, loadingData ];
}