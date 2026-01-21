export default async function selectEmergencyData( db )
{
	try
	{
		const result_person = await db.getAllAsync(
		`
			SELECT 
				ENTITY_ID, 
				Entity_Name AS Name, 
				DOB,
				Sex, 
				Height, 
				Weight, 
				Blood_Type 
			FROM Entity, Person 
			WHERE Person_ID = ? 
			AND Entity_ID = ?;`, 
			[ 1, 1 ]
		);

		const result_condition = await db.getAllAsync(
		`
			SELECT
				Medical_Condition_ID,
				Condition_Name,
				Diagnosis_Date,
				Note,
				Entity_NAME AS Doctor
			FROM Medical_Condition
			JOIN Entity
			ON Entity.Entity_ID = Medical_Condition.Doctor_ID
			WHERE Condition_Name NOT LIKE ?;`, 
			[ '%Allergy%' ]
		);

		const result_medication = await db.getAllAsync(
		`
			SELECT 
				Medication_ID,
				Medication_Name, 
				Strength, 
				Frequency,
				Start_Date,
				Note,
				Entity_NAME AS Doctor
			FROM Medication
			JOIN Entity 
			ON Entity.Entity_ID = Medication.Doctor_ID;
		`);

		const result_allergy = await db.getAllAsync(
		`
			SELECT
				Allergy_ID,
				Allergen,
				Severity,
				Medication_Name,
				Diagnosis_Date,
				Medical_Condition.Note
			FROM Allergy
			LEFT JOIN Medical_Condition
			ON Medical_Condition.Medical_Condition_ID = Allergy.Allergy_ID
			LEFT JOIN Medication 
			ON Medical_Condition.Medical_Condition_ID = Medication.Medical_Condition_ID;
		`);

		const result_insurance = await db.getAllAsync(
		`
			SELECT 
				Insurance_ID,
				Entity.Entity_Name AS Company_Name, 
				Policy_Number,
				Start_Date,
				Note
				FROM Insurance
				JOIN Entity on Entity.Entity_ID = Insurance.Insurance_ID
				WHERE Insurance_Type = ?`, 
			[ 'Health' ]
		);
		console.log( 'Emergency data loaded.' );
		return (
		{
			result_person,
			result_condition,
			result_medication,
			result_allergy,			
			result_insurance
		})
	}
	catch( error )
	{
		console.log( 'Error loading Emergency data:', error );  
	}
}