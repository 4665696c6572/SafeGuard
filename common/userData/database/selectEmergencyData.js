export default async function selectEmergencyData( db, table)
{
	try
	{
		{	
			var doctor = await db.getAllAsync(
			`
				SELECT 
					entity_id AS doctor_id, 
					entity_name AS doctor_name
				FROM Entity
				WHERE entity_type = ?
				ORDER BY entity_name`,	
				[ 'Doctor' ]
			);			
		}

		if ( table == 'Person' || table == 'All' )
		{
			var person = await db.getAllAsync(
			`
				SELECT
					entity_id,
					entity_name,
					Entity_type,
					dob,
					sex,
					height,
					weight,
					blood_type
				FROM Entity, Person
				WHERE person_id = ?
				AND entity_id = ?;`,
				[ 1, 1 ]
			);
		}

		if ( table == 'Medical_Condition' || table == 'All' )
		{
			var medical_condition = await db.getAllAsync(
			`
				SELECT
					condition_id,
					condition_name,
					doctor_id,
					diagnosis_date,
					condition_note,
					is_allergy,
					entity_name AS doctor_name
				FROM Medical_Condition
				LEFT JOIN Entity
				ON Entity.entity_id = Medical_Condition.doctor_id
				WHERE is_allergy = ?
				ORDER BY condition_name;`,
				[ 0 ]
			);
		}

		if ( table == 'Medication' || table == 'All' )
		{	
			var medication = await db.getAllAsync(
			`
				SELECT 
					medication_id,
					medication_name,
					condition_id,
					strength, 
					frequency,
					start_date,					
					is_life_sustaining,
					medication_note,
					doctor_id
					FROM Medication				
				ORDER BY is_life_sustaining DESC, medication_name;
			`);
		}

		if ( table == 'Allergy' || table == 'All' )
		{	
			var allergy = await db.getAllAsync(
			`
				SELECT
					allergy_id,
					allergen,
					severity,
					diagnosis_date,
					Medical_Condition.condition_name AS condition_name,
					Medical_Condition.doctor_id AS condition_doctor_id,
					Medical_Condition.condition_note AS allergy_note
				FROM Allergy
				LEFT JOIN Medical_Condition
				ON Medical_Condition.condition_id = Allergy.allergy_id
				
				ORDER BY severity ASC, allergen ASC;
			`);
		}

		if ( table == 'Insurance' || table == 'All' )
		{
			var insurance = await db.getAllAsync(
			`
				SELECT
					insurance_id,
					Entity.entity_name AS entity_name,
					policy_number,
					start_date,
					insurance_note,
					insurance_type,
					Office.phone_number_id AS phone_number_id,
					Office.phone_number AS phone_number,
					Office.phone_number_note AS phone_number_note
				FROM Insurance
				LEFT JOIN Entity on Entity.entity_id = Insurance.insurance_id
				LEFT JOIN Phone AS Office
					ON Office.entity_id = insurance_id
					AND Office.number_type = 'Office'
				WHERE insurance_type = ?
				GROUP BY insurance_id`,
				[ 'Health' ]
			);
		}
		console.log(insurance)
		
		console.log( '*** Emergency data loaded ***' );

		if ( table == 'Allergy' )    return allergy;
		if ( table == 'Doctor_Name' || table == 'Doctor' )    return doctor;
		if ( table == 'Facility_Name' )    return facility;
		if ( table == 'Insurance' )    return insurance;		
		if ( table == 'Medical_Condition' )    return medical_condition;
		if ( table == 'Medication' )    return medication;
		if ( table == 'Person' )    return person;

		if ( table == 'All' )
		{
			if ( !allergy )    allergy = [];
			if ( !doctor )    person = [];
			if ( !insurance )    insurance = [];
			if ( !medical_condition )    medical_condition = [];			
			if ( !medication )    medication = [];
			if ( !person )    person = [];

			return (
			{
				'allergy': allergy,
				'doctor': doctor,
				'insurance': insurance,
				'medical_condition': medical_condition,				
				'medication': medication,
				'person': person							
				
			})
		}
	}
	catch( error )
	{
		console.log( 'Error loading Emergency data:', error );
	}
}