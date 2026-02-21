
export default async function updateEmergencyData( table, emergencyData, db )
{
	const data =
	{
		Address:
		[
			emergencyData.address_line_one,
			emergencyData.address_line_two,
			emergencyData.city,
			emergencyData.state,
			emergencyData.post_code,
			emergencyData.country,
			emergencyData.address_note,
			emergencyData.address_id
		],

		Allergy:
		[
			emergencyData.allergen,
			emergencyData.severity,
			emergencyData.condition_id
		],

		Doctor:
		[
			emergencyData.facility_name,
			emergencyData.specialty,
			emergencyData.current,
			emergencyData.entity_id
		],

		Email:
		[
			emergencyData.email,
			emergencyData.email_note,
			emergencyData.email_id
		],

		Entity:
		[
			emergencyData.entity_name,
			emergencyData.entity_id ?? emergencyData.insurance_id
		],

		Fax:
		[
			emergencyData.fax_number,
			emergencyData.fax_number_type,
			emergencyData.fax_number_note,
			emergencyData.fax_number_id
		],

		Insurance:
		[
			emergencyData.policy_number,
			emergencyData.start_date,
			emergencyData.insurance_note,
			emergencyData.insurance_type,
			emergencyData.insurance_id
		],

		Medical_Condition:
		[
			emergencyData.condition_name,
			emergencyData.diagnosis_date,
			emergencyData.doctor_id,
			emergencyData.condition_note,
			emergencyData.condition_id
		],

		Medication:
		[
			emergencyData.doctor_id,
			emergencyData.condition_id,
			emergencyData.medication_name,
			emergencyData.strength,
			emergencyData.frequency,
			emergencyData.start_date,
			emergencyData.is_life_sustaining,
			emergencyData.medication_note,
			emergencyData.medication_id
		],

		Person:
		[
			emergencyData.dob,
			emergencyData.sex,
			emergencyData.height,
			emergencyData.weight,
			emergencyData.blood_type,
			emergencyData.entity_id
		],

		Phone:
		[
			emergencyData.phone_number,
			emergencyData.phone_number_type,
			emergencyData.phone_number_note,
			emergencyData.phone_number_id
		]
	}

	const queries =
	{
		Address:
		`
			UPDATE Address
			SET
				address_line_one = ?,
				address_line_two = ?,
				city = ?,
				state = ?,
				post_code = ?,
				country = ?,
				address_note = ?
			WHERE address_id = ?
		`,

		Allergy:
		`
			UPDATE Allergy
			SET
				allergen = ?,
				severity = ?
			WHERE allergy_id = ?
		`,

		Doctor:
		`
		UPDATE Doctor
		SET
			facility_name = ?,
			specialty = ?,
			current = ?
		WHERE doctor_id = ?;
		`,

		Email:
		`
			UPDATE Email
			SET
				email = ?,
				email_note = ?
			WHERE email_id = ?
		`,

		Entity:
		`
			UPDATE Entity
			SET entity_name = ?
			WHERE entity_id = ?;
		`,

		Insurance:
		`
			UPDATE Insurance
			SET
				policy_number = ?,
				start_date = ?,
				insurance_note = ?,
				insurance_type = ?
			WHERE insurance_id = ?;
		`,

		Medical_Condition:
		`
			UPDATE Medical_Condition
			SET
				condition_name = ?,
				diagnosis_date = ?,
				doctor_id = ?,
				condition_note = ?
			WHERE condition_id = ?
		`,

		Medication:
		`
			UPDATE Medication
			SET
				doctor_id = ?,
				condition_id = ?,
				medication_name = ?,
				strength = ?,
				frequency = ?,
				start_date = ?,
				is_life_sustaining = ?,
				medication_note = ?
			WHERE medication_id = ?
		`,

		Person:
		`
			UPDATE Person
			SET
				dob = ?,
				sex = ?,
				height = ?,
				weight = ?,
				blood_type = ?
			WHERE person_id = ?
		`,

		Phone:
		`
			UPDATE Phone
			SET
				phone_number = ?,
				number_type = ?,
				phone_number_note = ?
			WHERE phone_number_id = ?
		`
	}


	try
	{
		if (table == 'Address' )
		{
			await db.runAsync( queries.Address, data.Address );
		}

		if ( table == 'Allergy' )
		{
			await db.runAsync( queries.Medical_Condition, data.Medical_Condition );
			await db.runAsync( queries.Allergy, data.Allergy );
		}

		if (table == 'Email')
		{
			await db.runAsync( queries.Email, data.Email );
		}

		if (table == 'Entity')
		{
			await db.runAsync( queries.Entity, data.Entity );
		}

		if (table == 'Fax')
		{
			await db.runAsync( queries.Phone, data.Fax );
		}

		if ( table == 'Doctor' )
		{
			await db.runAsync( queries.Entity, data.Entity );
			await db.runAsync( queries.Doctor, data.Doctor );
			console.log( `${table} data updated.` );
		}

		if (table == 'Insurance' )
		{
			await db.runAsync( queries.Entity, data.Entity );
			await db.runAsync( queries.Insurance, data.Insurance );
		}

		if ( table == 'Medical_Condition' )
		{
			await db.runAsync( queries.Medical_Condition, data.Medical_Condition );
		}

		if ( table == 'Medication' )
		{
			await db.runAsync( queries.Medication, data.Medication );
		}

		if (table == 'Person')
		{
			await db.runAsync( queries.Entity, data.Entity );
			await db.runAsync( queries.Person, data.Person );
		}

		if (table == 'Phone')
		{
			await db.runAsync( queries.Phone, data.Phone );
		}
	}
	catch ( error )
	{
		console.log( `Error updating ${table} data:`, error );
	}
};