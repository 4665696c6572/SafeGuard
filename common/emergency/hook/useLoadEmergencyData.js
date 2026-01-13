import { useState, useEffect } from 'react';

import formatEmergencyData from '../formatEmergencyData.js'
import selectEmergencyData from '../database/selectEmergencyData.js';


export default function useLoadEmergencyData( db ) 
{
	const [ loadedData, setLoadedData ] = useState( );
	const [ loadingData, setLoadingData ] = useState( true );

	useEffect( () => {
		async function loadData() 
		{
			try 
			{
				const unformatted_data = await selectEmergencyData( db );
				const formatted_data = formatEmergencyData( unformatted_data );
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