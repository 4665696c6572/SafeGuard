export default function updateStateData( key, value, emergencyData )
{	
	
	if (typeof key == 'string')    return (([{ ...emergencyData?.[0], [key]: value }]))
	else
	{
		return	(([{ ...emergencyData?.[0], [key[0]]: value[0], [key[1]]: value[1] }]))
	}
}

