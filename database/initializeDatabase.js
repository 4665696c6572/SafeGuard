/*
 *	Sets up Database on first run
 *	Includes 1 Demo Person with data
 */
export default async function initializeDatabase( db )
{
	try
	{
		await db.execAsync(
		`
			PRAGMA foreign_keys = ON;
			PRAGMA journal_mode = WAL;

			CREATE TABLE IF NOT EXISTS    Entity
			(
				entity_id    INTEGER    PRIMARY KEY,
				entity_name    TEXT,
				entity_type    TEXT    NOT NULL    CHECK ( entity_type IN ( 'Person', 'Doctor', 'Business' ) )
			);

			CREATE TABLE IF NOT EXISTS    Person
			(
				person_id    INTEGER    PRIMARY KEY,
				dob    TEXT,
				sex    TEXT,
				height    TEXT,
				weight    TEXT,
				blood_type    TEXT    CHECK ( blood_type IN ( 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown' ) ),
				FOREIGN KEY ( person_id )    REFERENCES Entity( entity_id )
			);

			CREATE TABLE IF NOT EXISTS    Doctor
			(
				doctor_id    INTEGER     PRIMARY KEY,
				facility_name    TEXT,
				specialty    TEXT,
				current    INTEGER,
				FOREIGN KEY ( doctor_id )    REFERENCES Entity( entity_id )    ON DELETE CASCADE
			);

			CREATE TABLE IF NOT EXISTS    Medical_Condition
			(
				condition_id    INTEGER    PRIMARY KEY,
				condition_name    TEXT    NOT NULL,
				doctor_id    INTEGER,
				diagnosis_date    TEXT,
				condition_note    TEXT,
				is_allergy    INTEGER    NOT NULL,
				FOREIGN KEY ( doctor_id )    REFERENCES Entity( entity_id )    ON DELETE SET NULL
			);

			CREATE TABLE IF NOT EXISTS    Medication
			(
				medication_id    INTEGER    PRIMARY KEY,
				doctor_id    INTEGER,
				condition_id    INTEGER,
				medication_name    TEXT    NOT NULL,
				strength    TEXT,
				frequency    TEXT,
				start_date    TEXT,
				is_life_sustaining    Integer     NOT NULL,
				medication_note    TEXT,
				FOREIGN KEY ( condition_id )    REFERENCES Medical_Condition( condition_id )    ON DELETE SET NULL,
				FOREIGN KEY ( doctor_id )    REFERENCES Entity( entity_id )    ON DELETE SET NULL
			);

			CREATE TABLE IF NOT EXISTS    Allergy
			(
				allergy_id    INTEGER    PRIMARY KEY,
				allergen    TEXT,
				severity    TEXT    CHECK ( severity IN ( 'Mild','Moderate','Severe', 'Life Threatening' ) ),
				FOREIGN KEY ( allergy_id )    REFERENCES Medical_Condition( condition_id )    ON DELETE CASCADE
			);

			CREATE TABLE IF NOT EXISTS    Insurance
			(
				insurance_id   INTEGER    PRIMARY KEY,
				policy_number    TEXT,
				start_date    TEXT,
				insurance_note    TEXT,
				insurance_type    TEXT    CHECK ( insurance_type IN ( 'Health', 'Home', 'Auto', 'Life', 'Other' )),
				FOREIGN KEY ( insurance_id )    REFERENCES Entity( entity_id )    ON DELETE CASCADE
			);

			CREATE TABLE IF NOT EXISTS    Address
			(
				address_id    INTEGER    PRIMARY KEY,
				entity_id    INTEGER,
				address_line_one    TEXT,
				address_line_two    TEXT,
				city    TEXT,
				state    TEXT,
				post_code    TEXT,
				country    TEXT,
				address_note    TEXT,
				FOREIGN KEY ( entity_id )    REFERENCES Entity( entity_id )    ON DELETE CASCADE
			);

			CREATE TABLE IF NOT EXISTS    Email
			(
				email_id    INTEGER    PRIMARY KEY,
				entity_id    INTEGER,
				email,
				email_note    TEXT,
				FOREIGN KEY ( entity_id )    REFERENCES Entity( entity_id )    ON DELETE CASCADE
			);

			CREATE TABLE IF NOT EXISTS    Phone
			(
				phone_number_id    INTEGER    PRIMARY KEY,
				entity_id    INTEGER,
				phone_number    TEXT    NOT NULL,
				number_type    TEXT    NOT NULL    CHECK ( number_type IN ( 'Cell', 'Fax', 'Home', 'Office', 'Other' )),
				phone_number_note    TEXT,
				FOREIGN KEY ( entity_id )    REFERENCES Entity( entity_id )    ON DELETE CASCADE
			);


			CREATE TABLE IF NOT EXISTS Game_Data
			(
				current_level    TEXT    DEFAULT ( 1 )    UNIQUE,
				score    INTEGER    DEFAULT ( 0 ),
				last_badge_seen    INTEGER    DEFAULT ( 0 ),
				PRIMARY KEY ( current_level, score )
			);

			CREATE Table IF NOT EXISTS Streak_History
			(
				streak_id     TEXT    PRIMARY KEY,
				date_played    TEXT,
				streak_seen    INTEGER    DEFAULT ( 0 )
			);

			CREATE TABLE IF NOT EXISTS    Category
			(
				category_id    INTEGER    PRIMARY KEY,
				category_name    TEXT    UNIQUE    NOT NULL
			);

			CREATE TABLE IF NOT EXISTS    Matching_Data
			(
				question_id    INTEGER    PRIMARY KEY,
				category_id    INTEGER    NOT NULL,
				question    TEXT    UNIQUE    NOT NULL,
				answer    TEXT,
				last_seen_date    TEXT    DEFAULT ( '2025-12-01' ),
				FOREIGN KEY ( category_id )    REFERENCES Category (category_id )
			);

			CREATE TABLE IF NOT EXISTS    Multiple_Choice_Data
			(
				question_id    INTEGER    PRIMARY KEY,
				category_id    TEXT    NOT NULL,
				question    TEXT    UNIQUE    NOT NULL,
				answer_correct    TEXT,
				answer_one_incorrect    TEXT,
				answer_two_incorrect    TEXT,
				answer_three_incorrect    TEXT,
				last_seen_date    TEXT    DEFAULT ( '2025-12-01' ),
				FOREIGN KEY ( category_id )    REFERENCES Category (category_id )
			);

			CREATE TABLE IF NOT EXISTS    True_False_Data
			(
				question_id    INTEGER    PRIMARY KEY,
				category_id    TEXT    NOT NULL,
				question    TEXT    UNIQUE    NOT NULL,
				answer    TEXT,
				last_seen_date    TEXT    DEFAULT ( '2025-12-01' ),
				FOREIGN KEY ( category_id )    REFERENCES Category (category_id )
			);


		` );
		// User setup
		await db.runAsync( 'INSERT OR IGNORE INTO Entity ( entity_id, entity_type ) VALUES ( ?, ? )', [ 1, 'Person' ]);


		// Game setup
		await db.runAsync( 'INSERT OR IGNORE INTO Game_Data ( current_level, score ) VALUES ( ?, ? )', [ 1, 0 ]);

		await db.runAsync( 'INSERT OR IGNORE INTO Category ( category_id, category_name ) VALUES ( ?, ? )', [ 1, 'Water' ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Category ( category_id, category_name ) VALUES ( ?, ? )', [ 2, 'Storm' ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Category ( category_id, category_name ) VALUES ( ?, ? )', [ 3, 'Temp' ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Category ( category_id, category_name ) VALUES ( ?, ? )', [ 4, 'Health' ]);

		for ( const row of match_data ) { await db.runAsync( match_insert, row ); }
		for ( const row of mc_data ) { await db.runAsync( mc_insert, row ); }
		for ( const row of tf_data ) { await db.runAsync( tf_insert, row ); }

		
		// Demo Data
		await db.runAsync( 'INSERT OR IGNORE INTO Streak_History ( streak_id, date_played, streak_seen ) VALUES ( ?, ?, ? )', [ '2026-03-08', '2026-03-08T23:00:00.000Z', 1 ]);

		await db.runAsync( 'UPDATE Entity SET entity_name = ? WHERE entity_id = ?;', [ 'Michael S. Baker', 1 ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Person ( person_id, dob, height, weight ) VALUES ( ?, ?, ?, ? )', [ 1, '1995-12-13', '181 cm', '83 kg' ]);

		await db.runAsync( 'INSERT OR IGNORE INTO Entity ( entity_id, entity_name, entity_type ) VALUES ( ?, ?, ? )', [ 2, 'Dr. Smith', 'Doctor' ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Doctor ( doctor_id, facility_name, specialty, current ) VALUES ( ?, ?, ?, ? )', [ 2, "Dr. Smiths clinic", 'Pulmonologist', 1 ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Address ( address_id, entity_id, address_line_one, city, State, post_code, country ) VALUES ( ?, ?, ?, ?, ?, ?, ? )', [ 1, 2, '13731 S. Archer Avenue', 'Lemont', 'IL', '60439', 'USA' ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Email ( email_id, entity_id, Email ) VALUES ( ?, ?, ? )', [ 1, 2, 'clinic@mail.com']);
		await db.runAsync( 'INSERT OR IGNORE INTO Phone ( phone_number_id, entity_id, phone_number, number_type ) VALUES ( ?, ?, ?, ? )', [ 1, 2, '588-2300', 'Office number']);

		await db.runAsync( 'INSERT OR IGNORE INTO Medical_Condition ( condition_id, doctor_id, condition_name, diagnosis_date, is_allergy ) VALUES ( ?, ?, ?, ?, ? )', [ 1, 2, 'Chronic obstructive pulmonary disease', '2021-11-15', 0 ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Medication ( medication_id, doctor_id, condition_id, medication_name, strength, frequency, start_date, is_life_sustaining ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ? )', [ 1, 2, 1, 'Amoxicillin', '500 mg', '1 capsule every 12 hours', '2020-11-15', 0 ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Medication ( medication_id, doctor_id, condition_id, medication_name, strength, frequency, start_date, is_life_sustaining ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ? )', [ 2, 2, 1, 'Salbutamol', '20 mg', '2 puffs ( 200 mcg ) every 4-6 hours', '2020-11-15', 1 ]);

		await db.runAsync( 'INSERT OR IGNORE INTO Medical_Condition ( condition_id, doctor_id, condition_name, diagnosis_date, is_allergy ) VALUES ( ?, ?, ?, ?, ? )', [ 2, 2, 'Diabetes', '2021-11-15', 0 ]);

		await db.runAsync( 'INSERT OR IGNORE INTO Entity ( entity_id, entity_name, entity_type ) VALUES ( ?, ?, ? )', [ 3, 'Dr. Parker', 'Doctor' ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Doctor ( doctor_id,  specialty, current ) VALUES ( ?, ?, ? )', [ 3, 'Allergist', 0 ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Address ( address_id, entity_id, address_line_one, city, State, post_code, country ) VALUES ( ?, ?, ?, ?, ?, ?, ? )', [ 2, 3, '34 Main street', 'Lockport', 'IL', '60441', 'USA' ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Email ( email_id, entity_id, Email ) VALUES ( ?, ?, ? )', [ 2, 3, 'user@email.com' ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Phone ( phone_number_id, entity_id, phone_number, number_type ) Values ( ?, ?, ?, ? )', [ 2, 3, '1 (800) 555-3333', 'Office' ]);

		await db.runAsync( 'INSERT OR IGNORE INTO Medical_Condition ( condition_id, condition_name, diagnosis_date, is_allergy ) VALUES ( ?, ?, ?, ? )', [ 3, 'Allergy', '2022-06-06', 1 ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Allergy ( allergy_id, allergen, severity ) VALUES ( ?, ?, ? )', [ 3, 'Nickel', 'Life Threatening' ]);

		await db.runAsync( 'INSERT OR IGNORE INTO Medical_Condition ( condition_id, doctor_id, condition_name, is_allergy ) VALUES ( ?, ?, ?, ? )', [ 4, 3, 'Allergy', 1 ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Allergy ( allergy_id, allergen, severity ) VALUES ( ?, ?, ? )', [ 4, 'Apple', 'Mild' ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Medication ( medication_id, doctor_id, condition_id, medication_name, strength, frequency, start_date, is_life_sustaining ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ? )', [ 3, 3, 4, 'Allegra', '180 mg', '1 tablet every 24 hours', '2015-01-03', 0 ]);

		await db.runAsync( 'INSERT OR IGNORE INTO Entity ( entity_id, entity_name, entity_type ) VALUES ( ?, ?, ? )', [ 4, 'ABC Insurance', 'Business' ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Insurance ( insurance_id, policy_number, insurance_type ) VALUES ( ?, ?, ? )', [ 4, '1789', 'Health' ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Address ( address_id, entity_id, address_line_one, address_line_two, city, State, post_code, country, address_note ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ? )', [ 3, 4, '23 Main Street', 'Unit 1', 'Lemont', 'IL', '60439', 'USA', 'Office location' ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Email ( email_id, entity_id, Email, email_note ) VALUES ( ?, ?, ?, ? )', [ 3, 4, 'abc@email.com', 'email note' ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Phone ( phone_number_id, entity_id, phone_number, number_type, phone_number_note ) Values ( ?, ?, ?, ?, ? )', [ 3, 4, '1 (800) 555-2222', 'Fax', 'Fax' ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Phone ( phone_number_id, entity_id, phone_number, number_type, phone_number_note ) Values ( ?, ?, ?, ?, ? )', [ 4, 4, '1 (800) 555-1111', 'Office', 'Office number' ]);

		await db.runAsync( 'INSERT OR IGNORE INTO Entity ( entity_id, entity_name, entity_type ) VALUES ( ?, ?, ? )', [ 5, 'DEF Insurance', 'Business' ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Insurance ( insurance_id, policy_number, insurance_type ) VALUES ( ?, ?, ? )', [ 5, 'A13989', 'Health' ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Phone ( phone_number_id, entity_id, phone_number, number_type, phone_number_note ) Values ( ?, ?, ?, ?, ? )', [ 5, 5, '1 (800) 555-4444', 'Office', 'Office number' ]);

		console.log( "Database initialized" );
	}
	catch ( error )
	{
		console.error( "Database error:", error );
	}
}

// 12 per topic
const match_data =
[
	[ 1, 1, 'Tropical Depression', '≤ 38 mph winds' ],
	[ 2, 1, 'Tropical Storm', '39 - 73 mph winds' ],
	[ 3, 1, 'Category 1 Hurricane', '74 - 95 mph winds' ],
	[ 4, 1, 'Category 2 Hurricane', '96 - 110 mph winds' ],
	[ 5, 1, 'Category 3 Hurricane', '111 - 129 mph winds' ],
	[ 6, 1, 'Category 4 Hurricane', '130 - 156 mph winds' ],
	[ 7, 1, 'Category 5 Hurricane', '≥ 157 mph winds' ],
	[ 8, 1, 'Eye of the hurricane', 'The calm center' ],
	[ 9, 1, 'Eyewall', 'Ring of intense thunderstorms' ],
	[ 10, 1, 'Hurricane Watch', 'Possible within 48 hours' ],
	[ 11, 1, 'Hurricane Warning', 'Expected within 36 hours' ],
	[ 12, 1, 'Storm surge', 'Excessive water rising water' ],
		[ 13, 2, 'Tornado Watch', 'Tornado possible' ],
		[ 14, 2, 'Tornado Warning', 'Tornado confirmed' ],
		[ 15, 2, 'Wall cloud', 'Low clouds near a thunderstorm' ],
		[ 16, 2, 'Tornado', 'Funnel shaped touching ground' ],
		[ 17, 2, 'Funnel cloud', 'Funnel shaped above ground' ],
		[ 18, 2, 'Waterspout', 'Tornado over water' ],
		[ 19, 2, 'Lightning', 'Electrical discharge' ],
		[ 20, 2, 'Thunder', 'Sound shockwave' ],
		[ 21, 2, 'Hail', 'Falling balls of ice in summer' ],
		[ 22, 2, 'Supercell', 'Severe updraft thunderstorm' ],
		[ 23, 2, 'Derecho', 'Long lived windstorm' ],
		[ 24, 2, 'Debris cloud', 'Airborne dust & debris' ],
	[ 25, 3, 'Heat wave', 'Prolonged abnormal heat' ],
	[ 26, 3, 'Cold snap', 'Sudden cold' ],
	[ 27, 3, 'Heat index', 'Feels-like heat temp' ],
	[ 28, 3, 'Wind chill', 'Feels-like cold temp' ],
	[ 29, 3, 'Dehydration', 'Excess fluid loss' ],
	[ 30, 3, 'Heat stroke', 'Severe heat illness' ],
	[ 31, 3, 'Hypothermia', 'Low body temp' ],
	[ 32, 3, 'Hyperthermia', 'High body temp' ],
	[ 33, 3, 'Black ice', 'Hard to see ice' ],
	[ 34, 3, 'Cold wave', 'Prolonged abnormal cold' ],
	[ 35, 3, 'Warm spell', 'Prolonged abnormal warmth' ],
	[ 36, 3, 'Drought', 'Abnormal dry conditions' ],
		[ 37, 4, 'Respiratory distress', 'Trouble breathing' ],
		[ 38, 4, 'Anaphylaxis', 'Severe allergic reaction' ],
		[ 39, 4, 'Abrasion', 'Scrape' ],
		[ 40, 4, 'Blood Pressure', '< 120 / < 80' ],
		[ 41, 4, 'Heart Rate', '60 to 100 bpm' ],
		[ 42, 4, 'Tachycardia', '> 100 bpm' ],
		[ 43, 4, 'Bradycardia', '< 100 bpm' ],
		[ 44, 4, 'Sleep Heart Rate', '40 - 50 bpm' ],
		[ 45, 4, 'Body Temp', '97.7 - 99.5°F' ],
		[ 46, 4, 'CPR', 'Emergency resuscitation' ],
		[ 47, 4, 'Acute', 'Sudden & severe' ],
		[ 48, 4, 'Chronic', 'Long lasting' ]
];

const match_insert =
`
	INSERT OR IGNORE INTO Matching_Data
	( question_id, category_id, question, answer )
	VALUES ( ?, ?, ?, ? );
`;

// 10 per topic
const mc_data =
[
	[ 1, 1, 'Why should hurricane planning cover more than just wind hazards?', 'Storm surge & storm tide are the deadliest hazards', 'Hurricanes cause wild fires', 'High Winds are the only threat', 'Debris left from a hurricane can be a deadly hazard' ],
	[ 2, 1, 'Which hurricane hazard causes fatalities inland?', 'Heavy rainfall & inland flooding', 'Ice storms & snow squalls', 'Dust storms & debris', 'Fallen trees' ],
	[ 3, 1, 'What is the correct response to an evacuation order?', 'Evacuate immediately', 'Wait to see if your area is affected', 'Evacuate only if your house loses power', 'Wait till the wind dies down' ],
	[ 4, 1, 'Which is the safest location inside a house during the peak of hurricane winds?', 'In a small interior room on the lowest level, away from windows', 'In a bedroom, under the bed', 'In a kitchen, under the table', 'Inside a car parked in the garage' ],
	[ 5, 1, 'Why is floodwater dangerous even when it looks shallow?', 'It may hide depth, current, debris, & contamination', 'It may contain ice', 'It may contain snakes', 'It may suddenly surge' ],
	[ 6, 1, 'What is the safest action when a road is covered by floodwater?', 'Turn around & find another route', 'Drive through slowly', 'Follow the car ahead of you', 'Check depth first' ],
	[ 7, 1, 'What is storm surge?', 'Abnormal coastal water rise pushed inland by a storm', 'Rain falling through cold air', 'A sudden drop in water level', 'Storms kicking up large amounts of dust' ],
	[ 8, 1, 'When should you return home after flooding or a hurricane?', 'As soon as authorities allow', 'As soon as the rain stops', 'As soon as the water recedes', 'As soon as the ground is dry' ],
	[ 9, 1, 'What is a Hurricane Watch?', 'Hurricane conditions are possible within 48 hours', 'Hurricane conditions are expected within 36 hours', 'Hurricane conditions may occur in 24 hours', 'Hurricane conditions have already begun' ],
	[ 10, 1, 'What is a Hurricane Warning?', 'Hurricane conditions are expected within 36 hours', 'Hurricane conditions are possible within 48 hours',  'Hurricane conditions may occur in 24 hours', 'Hurricane conditions have already begun' ],
		[ 11, 2, 'Where is the safest place during a tornado?', 'A small interior room on the lowest floor', 'In the bathtub', 'Under the bed', 'In a car' ],
		[ 12, 2, 'What does a tornado warning mean?', 'A tornado has been confirmed', 'Tornado season has started', 'The danger has ended', 'A tornado can occur soon' ],
		[ 13, 2, 'What does a tornado watch mean?', 'A tornado can occur soon', 'A tornado has been confirmed', 'Tornado season has started', 'The danger has ended' ],
		[ 14, 2, 'Which place should generally be avoided during a tornado?', 'A mobile home', 'A basement', 'A storm shelter', 'A windowless hallway' ],
		[ 15, 2, 'What should you do if you are indoors during a severe tornado warning?', 'Take shelter immediately', 'Open windows to depressurize', 'Go outside to check for signs of a tornado', 'Leave the area' ],
		[ 16, 2, 'What is a common danger after a tornado passes?', 'Downed power lines', 'Lost and frightened cows', 'Increase in traffic', 'Flooding' ],
		[ 17, 2, 'Which hazard can occur in a severe thunderstorm without a tornado?', 'Large hail', 'Volcanic ash', 'Tidal waves', 'Sandstorms' ],
		[ 18, 2, 'Why is a highway overpass dangerous in a tornado?','Wind and debris can be funneled underneath it', 'It is too dark to see where you are going', 'You may be hit by a car', 'Rain makes the road slippery' ],
		[ 19, 2, 'What is a dust devil?', 'A small, spinning column of rising air that picks up dust', 'A tornado with lightening', 'A tornado with freezing rain', 'A storm with thunder and lightening' ],
		[ 20, 2, "Which isn't a form of lightning", 'Ground to Ground', 'Intra Cloud (in a single cloud)', 'Cloud to Cloud', 'Cloud to Ground' ],
	[ 21, 3, 'What is the best drink to prevent dehydration during a heatwave?', 'Water', 'Energy drinks', 'Alcohol', 'Soup' ],
	[ 22, 3, 'Which condition is a medical emergency during extreme heat?', 'Heat stroke', 'Sunburn', 'Sweating', 'Dry lips' ],
	[ 23, 3, 'What should you wear in very cold weather?', 'Several warm layers', 'One very thick layer', 'Snowsuit', 'Parka' ],
	[ 24, 3, 'Why is black ice dangerous?', 'It can be hard to see on roads and sidewalks', 'It takes longer to melt', 'It only forms indoors', 'It is slipperier than regular ice.' ],
	[ 25, 3, 'Which group is often at higher risk during extreme heat and cold?', 'Older adults', 'Professional athletes', 'Taxi drivers', 'Office workers' ],
	[ 26, 3, 'What is a common sign of heat exhaustion?', 'Heavy sweating and weakness', 'Blue lips and stiff muscles', 'Loss of hearing', 'Sudden headache' ],
	[ 27, 3, 'What should you do first if indoor heating fails in freezing weather?', 'Use safe alternative warmth and conserve heat', 'Put up a tent', 'Take a warm shower', 'Turn on the oven' ],
	[ 28, 3, 'Why should you avoid using outdoor grills indoors during heating outages?', 'They can produce dangerous carbon monoxide', 'They heat rooms too quickly', 'They are too expensive', 'They are perfectly fine to use' ],
	[ 29, 3, 'What does wind chill describe?', 'How it feels on exposed skin', 'How much snow has fallen', 'The actual temperature', 'The forecast low temperature' ],
	[ 30, 3, 'Which action helps reduce heat inside a home?', 'Closing curtains during the hottest part of the day', 'Turning on a fan', 'Opening windows', 'Cooking' ],
		[ 31, 4, 'Why is hand washing important after a disaster?', 'To reduce the spread of infection', 'It removes bad odors', 'It removes stains', 'To flush the plumbing' ],
		[ 32, 4, 'Why should people keep a written medication list?', 'It helps if medical care is needed during an emergency', 'It can be used at the pharmacy to request an emergency refill', 'It explains illness', 'It notes need for refrigeration' ],
		[ 33, 4, 'If you think someone is having a stroke you should...', 'Call 911', 'Drive to the hospital', 'Have them lay down', 'Give them a drink' ],
		[ 34, 4, 'Which of the following is a heart attack symptom?', 'Chest pain', 'Diarrhea', 'Hiccupping', 'Flatulence' ],
		[ 35, 4, 'Which of the following is a stroke symptom?', 'Confusion & slurred speech', 'Suddenly feeling calm', 'Seizure or fainting', 'Bruising and tenderness' ],
		[ 36, 4, 'What does asymptomatic mean?', 'Without symptoms', 'With mild symptoms', 'With moderate symptoms', 'With severe symptoms' ],
		[ 37, 4, 'What does A stand for in First Aid ABC?', 'Airway', 'Apple', 'Antibiotics', 'Ambulance' ],
		[ 38, 4, 'What does B stand for in First Aid ABC?', 'Breathing', 'Bandage', 'Brain', 'Balance' ],
		[ 39, 4, 'What does C stand for in First Aid ABC?', 'Circulation', 'Cough', 'Cushion', 'Call 911' ],
		[ 40, 4, 'What do you do if someone is bleeding?', 'Apply pressure', 'Wash the injury', 'Stitch the injury', 'Apply salt' ],
];

const mc_insert =
`
	INSERT OR IGNORE INTO Multiple_Choice_Data
	( 
		question_id, category_id, question,
		answer_correct, answer_one_Incorrect,
		answer_two_Incorrect, answer_three_Incorrect
	)
	VALUES ( ?, ?, ?, ?, ?, ?, ? );
`;

// 6 per topic
const tf_data =
[
	[ 1, 1, 'A hurricane can remain dangerous far inland because heavy rainfall, flooding, tornadoes, and power outages may continue after landfall.', 'True' ],
	[ 2, 1, 'People should avoid driving through floodwater because it may be deeper, faster, and more contaminated than it appears.', 'True' ],
	[ 3, 1, 'Hurricanes are classified only by how much rain falls in total, so wind speed is not important in calculating storm strength.', 'False' ],
	[ 4, 1, 'A storm surge is a concern for ships at sea and is not dangerous for people living on land.', 'False' ],
	[ 5, 1, 'If floodwater looks calm and shallow, it is generally safe for cars to cross slowly without risk.', 'False' ],
	[ 6, 1, 'Contact with floodwater should be avoided because it may contain sewage, chemicals, sharp debris, and potential electrical dangers.', 'True' ],
		[ 7, 2, 'People in cars are generally safer if they drive closer to the tornado so they can judge its path more accurately.', 'False' ],
		[ 8, 2, 'If a tornado warning is issued, moving to a basement or a small interior room on the lowest floor is safer than staying near windows to watch the storm.', 'True' ],
		[ 9, 2, 'A highway overpass is considered one of the safest places to shelter during a tornado because the concrete blocks the wind.', 'False' ],
		[ 10, 2, 'Opening windows during a tornado does not protect a building and wastes time that should be used to take shelter immediately.', 'True' ],
		[ 11, 2, 'Severe thunderstorms can produce tornadoes, dangerous lightning, large hail, and destructive winds even when no funnel cloud is visible.', 'True' ],
		[ 12, 2, 'After a tornado has passed, sharp debris, gas leaks, and downed power lines can still cause serious injuries.', 'True' ],
	[ 13, 3, 'Power outages and disrupted services can worsen health risks during heatwaves because people may lose cooling, refrigeration, communications, and access to medical support.', 'True' ],
	[ 14, 3, 'During a cold snap, wearing several loose layers is often more effective than wearing one very thick layer because layers trap warm air.', 'True' ],
	[ 15, 3, 'People are only at serious risk from heat illness if they are exercising outdoors, so indoor heat is not dangerous.', 'False' ],
	[ 16, 3, 'Alcohol is a reliable way to warm the body in freezing weather because it increases internal body temperature for a long period.', 'False' ],
	[ 17, 3, 'Wind chill can increase the rate at which the body loses heat, even when the air temperature stays the same.', 'True' ],
	[ 18, 3, 'Ice storms can be especially disruptive because they may damage power lines, block roads, and reduce access to emergency services.', 'True' ],
		[ 19, 4, 'People who depend on prescription medicines, insulin, inhalers, or medical devices may face increased danger during disasters if supplies or electricity are interrupted.', 'True' ],
		[ 20, 4, 'Food that has been left unrefrigerated for many hours during a power outage can become unsafe even if it still looks and smells normal.', 'True' ],
		[ 21, 4, 'Hand hygiene and safe drinking water are important after disasters because damaged infrastructure can increase the risk of infection and gastrointestinal illness.', 'True' ],
		[ 22, 4, 'Stress, anxiety, poor sleep, and difficulty concentrating can occur after emergencies and may require support just like physical health problems do.', 'True' ],
		[ 23, 4, 'If a person feels dizzy, weak, and unusually thirsty during hot conditions, continuing activity slowly is usually the best way to help the body adjust.', 'False' ],
		[ 24, 4, 'A first aid kit is only useful for major injuries, so minor cuts, blisters, and burns usually do not need supplies or attention.', 'False' ],
];

const tf_insert =
`
	INSERT OR IGNORE INTO True_False_Data
	( question_id, category_id, question, answer )
	VALUES ( ?, ?, ?, ? );
`;
