// Inserts user input data into db.
export default async function insertEmergencyData( db, table, emergencyData )
{
	/*
	 *	Allows user to remove a single item in a form
	 *	while still allowing for greater flexibility of use.
	 *	It sets items the user backspaced or set to a space as null.
	 */
	for ( const [ key, value ] of Object.entries( emergencyData ))
	{
		if ( value == '' || value == ' ' ) emergencyData[key] = null;
	}

	const data =
	{
		Address:
		[
			emergencyData.entity_id,
			emergencyData?.address_line_one ? emergencyData?.address_line_one : null,
			emergencyData?.address_line_two ? emergencyData.address_line_two : null,
			emergencyData?.city ? emergencyData?.city : null,
			emergencyData?.state ? emergencyData?.state : null,
			emergencyData?.post_code ? emergencyData?.post_code : null,
			emergencyData?.country ? emergencyData?.country : null,
			emergencyData?.address_note ? emergencyData?.address_note : null
		],

		Allergy:
		[
			emergencyData?.allergen ? emergencyData?.allergen : null,
			emergencyData?.severity ? emergencyData?.severity : null
		],

		Doctor:
		[
			emergencyData?.facility_name ? emergencyData?.facility_name : null,
			emergencyData?.specialty ? emergencyData?.specialty : null,
			emergencyData?.current ? emergencyData?.current : null
		],

		Email:
		[
			emergencyData.entity_id,
			emergencyData?.email ? emergencyData?.email : null,
			emergencyData?.email_note ? emergencyData?.email_note : null
		],

		Entity:
		[
			emergencyData.entity_name,
			emergencyData.entity_type,
		],

		Fax:
		[
			emergencyData.entity_id,
			emergencyData?.fax_number ? emergencyData?.fax_number : null,
			emergencyData?.fax_number_type,
			emergencyData?.fax_number_note ? emergencyData?.fax_number_note : null
		],

		Insurance:
		[
			emergencyData?.policy_number ? emergencyData?.policy_number : null,
			emergencyData?.start_date ? emergencyData?.start_date : null,
			emergencyData?.insurance_note ? emergencyData?.insurance_note : null
		],

		Medical_Condition:
		[
			emergencyData?.doctor_id ? emergencyData?.doctor_id : null,
			emergencyData?.condition_name ? emergencyData?.condition_name : null,
			emergencyData?.diagnosis_date ? emergencyData?.diagnosis_date : null,
			emergencyData?.condition_note ? emergencyData?.condition_note : null,
			emergencyData?.is_allergy ? emergencyData?.is_allergy : 0
		],

		Medication:
		[
			emergencyData?.doctor_id ? emergencyData?.doctor_id : null,
			emergencyData?.condition_id ? emergencyData?.condition_id : null,
			emergencyData?.medication_name ? emergencyData?.medication_name : null,
			emergencyData?.strength ? emergencyData?.strength : null,
			emergencyData?.frequency ? emergencyData?.frequency : null,
			emergencyData?.start_date ? emergencyData?.start_date : null,
			emergencyData?.is_life_sustaining ? 1 : 0,
			emergencyData?.medication_note ? emergencyData?.medication_note : null
		],

		Person:
		[
			emergencyData?.dob ? emergencyData?.dob : null,
			emergencyData?.sex ? emergencyData?.sex : null,
			emergencyData?.height ? emergencyData?.height : null,
			emergencyData?.weight ? emergencyData?.weight : null,
			emergencyData?.blood_type ? emergencyData?.blood_type : null
		],

		Phone:
		[
			emergencyData.entity_id,
			emergencyData?.phone_number ? emergencyData?.phone_number: null,
			emergencyData?.phone_number_type,
			emergencyData?.phone_number_note ? emergencyData?.phone_number_note : null
		]
	}


	const operations =
	{
		Address:
		`
			INSERT OR IGNORE INTO address
			(
				entity_id, address_line_one, address_line_two, city,
				State, post_code, country, address_note
			)
			VALUES ( ?, ?, ?, ?, ?, ?, ?, ? );
		`,

		Allergy:
		`
			INSERT OR IGNORE INTO Allergy
			( allergy_id, allergen, severity )
			VALUES ( ?, ?, ? );
		`,

		Doctor:
		`
			INSERT OR IGNORE INTO Doctor
			( doctor_id, facility_name, specialty, current )
			VALUES ( ?, ?, ?, ? );
		`,

		Email:
		`
			INSERT OR IGNORE INTO Email
			( entity_id, Email, email_note )
			VALUES ( ?, ?, ? );
		`,

		Entity:
		`
			INSERT OR IGNORE INTO Entity
			( entity_name, entity_type )
			VALUES ( ?, ? );
		`,

		Fax:
		`
			INSERT OR IGNORE INTO Phone
			( entity_id, phone_number, number_type, phone_number_note )
			VALUES ( ?, ?, ?, ? );
		`,

		Insurance:
		`
			INSERT OR IGNORE INTO Insurance
			( insurance_Id, policy_number, start_date, insurance_note )
			VALUES ( ?, ?, ?, ? );
		`,

		Medical_Condition:
		`
			INSERT OR IGNORE INTO Medical_Condition
			(
				doctor_id, condition_name, diagnosis_date,
				condition_note, is_allergy
			)
			VALUES ( ?, ?, ?, ?, ? );
		`,

		Medication:
		`
			INSERT OR IGNORE INTO Medication
			(
				doctor_id, condition_id,
				medication_name, strength, frequency,
				start_date, is_life_sustaining, medication_note
			)
			VALUES ( ?, ?, ?, ?, ?, ?, ?, ? );
		`,

		Person:
		`
			INSERT OR IGNORE INTO Person
			( person_id, dob, sex, height, weight, blood_type )
			VALUES ( ?, ?, ?, ?, ?, ? );
		`,

		Phone:
		`
			INSERT OR IGNORE INTO Phone
			( entity_id, phone_number, number_type, phone_number_note )
			VALUES ( ?, ?, ?, ? );
		`
	}


	try
	{
		if ( table == 'Address' )
		{
			const result = await db.runAsync( operations.Address, data.Address );
			if ( result.changes != 0 )    return result.lastInsertRowId;
		}

		if ( table == 'Allergy' )
		{
			const result = await db.runAsync( operations.Medical_Condition, data.Medical_Condition );
			await db.runAsync( operations.Allergy, [ result.lastInsertRowId, ...data.Allergy ]);
			if ( result.changes != 0 )    return result.lastInsertRowId;
		}

		if ( table == 'Doctor' )
		{
			const result = await db.runAsync( operations.Entity, data.Entity );
			await db.runAsync( operations.Doctor, [ result.lastInsertRowId, ...data.Doctor ]);
			if ( result.changes != 0 )    return result.lastInsertRowId;
		}

		if ( table == 'Email' )
		{
			const result = await db.runAsync( operations.Email, data.Email );
			if ( result.changes != 0 )    return result.lastInsertRowId;
		}

		if ( table == "Entity" )
		{
			await db.runAsync( operations.Entity, data.Entity );
		}

		if ( table == 'Fax' )
		{
			const result = await db.runAsync( operations.Fax, data.Fax );
			if ( result.changes != 0 )    return result.lastInsertRowId;
		}

		if ( table == 'Insurance' )
		{
			const result = await db.runAsync( operations.Entity, [ emergencyData.entity_name, 'Business' ]);
			await db.runAsync( operations.Insurance, [ result.lastInsertRowId, ...data.Insurance ]);
			if ( result.changes != 0 )    return result.lastInsertRowId;
		}

		if ( table == 'Medical_Condition' )
		{
			const result = await db.runAsync( operations.Medical_Condition, data.Medical_Condition );
			if ( result.changes != 0 )    return result.lastInsertRowId
		}

		if ( table == 'Medication' )
		{
			const result = await db.runAsync( operations.Medication, data.Medication );
			if ( result.changes != 0 )     return result.lastInsertRowId;
		}


		if ( table == "Person" )
		{
			const result = await db.runAsync( operations.Entity, data.Entity );
			if ( Object.keys( emergencyData ).length > 1 )
			{
				await db.runAsync( operations.Person, [ result.lastInsertRowId, ...data.Person ]);
			}
		}

		if ( table == 'Phone' )
		{
			const result = await db.runAsync( operations.Phone, data.Phone );
			if ( result.changes != 0 )    return result.lastInsertRowId;
		}
	}
	catch ( error )
	{
		console.log( `Error inserting ${ table } data:`, error );
	}
};