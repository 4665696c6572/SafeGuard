// Deletes user input data from db.
export default async function deleteEmergencyData( db, table, condition )
{
	const operations =
	{
		Address:
		`
			DELETE FROM Address
			WHERE address_id = ?
		`,

		Email:
		`
			DELETE FROM Email
			WHERE email_id = ?
		`,

		Entity:
		`
			DELETE FROM Entity
			WHERE entity_id = ?;
		`,

		Medical_Condition:
		`
			DELETE FROM Medical_Condition
			WHERE condition_id = ?
		`,

		Medication:
		`
			DELETE FROM Medication
			WHERE medication_id = ?
		`,

		// The only person is the user, who can be cleared but not deleted
		Person_1:
		`
			UPDATE Person
			SET
				dob = null,
				sex = null,
				height = null,
				weight = null,
				blood_type = null
			WHERE person_id = ?
		`,

		Person_2:
		`
			UPDATE Entity
			SET
			entity_name = null
			WHERE entity_id = ?
		`,

		Phone:
		`
			DELETE FROM Phone
			WHERE phone_number_id = ?
		`
	}


	try
	{
	// Can be deleted via button press or on cascade of owning entity
		if ( table == 'Address' )
		{
			await db.runAsync( operations.Address, condition );
		}

		// Allergy is a medical condition and deletes via cascade
		if ( table == 'Allergy' || table == 'Medical_Condition' )
		{
			await db.runAsync( operations.Medical_Condition, condition );
		}

		// Can be deleted via button press or on cascade of owning entity
		if ( table == 'Contact' )
		{
			await db.runAsync( operations.Address, condition[0] );
			await db.runAsync( operations.Email, condition[1] );
			await db.runAsync( operations.Phone, condition[2] );
			await db.runAsync( operations.Phone, condition[3] );
		}
		if ( table == 'Email' )
		{
			await db.runAsync( operations.Email, condition );
		}

		// Doctor & Insurance are deleted via cascade
		if ( table == 'Entity' || table == 'Doctor' || table == 'Insurance' )
		{
			await db.runAsync( operations.Entity, condition );
		}

		// Can be deleted via button press or on cascade of owning entity
		if ( table == 'Fax' )
		{
			await db.runAsync( operations.Phone, condition );
		}

		if ( table == 'Medication' )
		{
			await db.runAsync( operations.Medication, condition );
		}

		// The only person is the user, who can be cleared but not deleted
		if ( table == 'Person' )
		{
			await db.runAsync( operations.Person_1, condition );
			await db.runAsync( operations.Person_2, condition );
		}

		// Can be deleted via button press or on cascade of owning entity
		if ( table == 'Phone' )
		{
			await db.runAsync( operations.Phone, condition );
		}
	}
	catch ( error )
	{
		console.log( `Error deleting ${ table} data:`, error );
	}
};