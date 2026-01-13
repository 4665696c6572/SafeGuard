export default function formatEmergencyData( unformatted_data ) 
{
	const emergency_data =
	{
		id: unformatted_data.result_person[0]?.Entity_ID,
		person:
		{
			name: unformatted_data.result_person[0]?.Name,
			dob: unformatted_data.result_person[0]?.DOB,
			sex: unformatted_data.result_person[0]?.Sex,
			height: unformatted_data.result_person[0]?.Height,
			weight: unformatted_data.result_person[0]?.Weight,
			blood_type: unformatted_data.result_person[0]?.Blood_Type
		},
		medical_condition:
		(
			unformatted_data.result_condition || []).map(condition => 
			({
				id: condition.Medical_Condition_ID,
				condition_name: condition.Condition_Name,
				diagnosis_date: condition.Diagnosis_Date,
				note: condition.Note,
				doctor: condition.Doctor,
			})
		),
		
		medication:
		(
			unformatted_data.result_medication || []).map(medication => 
			({
				id: medication.Medication_ID,
				medication_name: medication.Medication_Name,
				strength: medication.Strength,
				frequency: medication.Frequency,
				start_date: medication.Start_Date,
				note: medication.Note,
				doctor: medication.Doctor
			})
		),
		allergy:
		(
			unformatted_data.result_allergy || []).map(allergy => 
			({
				id: allergy.Allergy_ID,
				allergen: allergy.Allergen,
				severity: allergy.Severity,
				medication_name: allergy.Medication_Name,
				diagnosis_date: allergy.Diagnosis_Date,
				note: allergy.Note
			})
		),
		health_insurance:
		(
			unformatted_data.result_insurance || []).map(insurance => 
			({
				id: insurance.Insurance_ID,
				company: insurance.Company_Name,
				policy_number: insurance.Policy_Number,
				start_date: insurance.Start_Date,
				note: insurance.Note
			})
		)
	}
	return emergency_data
};