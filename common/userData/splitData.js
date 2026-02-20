export default function splitData( entityData, condition )
{
	let address =
	{
		entity_id: entityData[0]?.entity_id,
		address_id: entityData[0]?.address_id,
		address_line_one: entityData[0]?.address_line_one,
		address_line_two: entityData[0]?.address_line_two,
		city: entityData[0]?.city,
		state: entityData[0]?.state,
		post_code: entityData[0]?.post_code,
		country: entityData[0]?.country,
		address_note: entityData[0]?.address_note
	};

	let email =
	{
		entity_id: entityData[0]?.entity_id,
		email_id: entityData[0]?.email_id,
		email: entityData[0]?.email,
		email_note: entityData[0]?.email_note
	};

	let fax =
	{
		entity_id: entityData[0]?.entity_id,
		fax_number_id: entityData[0]?.fax_number_id,
		fax_number: entityData[0]?.fax_number,
		fax_number_type: entityData[0]?.fax_number_type,
		fax_number_note: entityData[0]?.fax_number_note
	};

	let phone =
	{
		entity_id: entityData[0]?.entity_id,
		phone_number_id: entityData[0]?.phone_number_id,
		phone_number_type: entityData[0]?.phone_number_type,
		phone_number: entityData[0]?.phone_number,
		phone_number_note: entityData[0]?.phone_number_note
	};

	return {
		entity_id: entityData[0]?.entity_id,
		entity_name: entityData[0]?.entity_name,
		address: address,
		email: email,
		fax: fax,
		phone: phone
	};
}