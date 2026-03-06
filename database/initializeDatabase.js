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
			DROP TABLE IF EXISTS Address;
			DROP TABLE IF EXISTS Phone;
			DROP TABLE IF EXISTS Email;

			DROP TABLE IF EXISTS True_False_Data;
			DROP TABLE IF EXISTS Multiple_Choice_Data;
			DROP TABLE IF EXISTS Matching_Data;
			DROP TABLE IF EXISTS Game_Data;
			DROP TABLE IF EXISTS Streak_History;

			DROP TABLE IF EXISTS Insurance;
			DROP TABLE IF EXISTS Allergy;
			DROP TABLE IF EXISTS Medication;
			DROP TABLE IF EXISTS Medical_Condition;
			DROP TABLE IF EXISTS Doctor;
			DROP TABLE IF EXISTS Person;
			DROP TABLE IF EXISTS Entity;

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

			CREATE TABLE IF NOT EXISTS    Phone
			(
				phone_number_id    INTEGER    PRIMARY KEY,
				entity_id    INTEGER,
				phone_number    TEXT    NOT NULL,
				number_type    TEXT    NOT NULL    CHECK ( number_type IN ( 'Cell', 'Fax', 'Home', 'Office', 'Other' )),
				phone_number_note    TEXT,
				FOREIGN KEY ( entity_id )    REFERENCES Entity( entity_id )    ON DELETE CASCADE
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


			CREATE TABLE IF NOT EXISTS    Category
			(
				category_id    INTEGER    PRIMARY KEY,
				category_name    TEXT
			);

			CREATE TABLE IF NOT EXISTS    Game_Data
			(
				user_id    INTEGER    PRIMARY KEY,
				current_level    TEXT    DEFAULT ( 1 )    UNIQUE,
				score    INTEGER    DEFAULT ( 0 ),
				last_badge    INTEGER    DEFAULT ( 0 ),
				FOREIGN KEY ( user_id )    REFERENCES Entity( entity_id )
			);

			CREATE Table IF NOT EXISTS Streak_History
			(
				streak_id     TEXT    PRIMARY KEY,
				date_played    TEXT,
				streak_seen    INTEGER    DEFAULT ( 0 )
			);

			CREATE TABLE IF NOT EXISTS    Matching_Data
			(
				question_id    INTEGER    PRIMARY KEY,
				category_id    INTEGER    NOT NULL,
				question    TEXT,
				answer    TEXT,
				last_seen_date    TEXT    DEFAULT ( '2025-12-01' ),
				FOREIGN KEY ( category_id )    REFERENCES Category (category_id )
			);

			CREATE TABLE IF NOT EXISTS    Multiple_Choice_Data
			(
				question_id    INTEGER    PRIMARY KEY,
				category_id    TEXT    NOT NULL,
				question    TEXT,
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
				question    TEXT,
				answer    TEXT,
				last_seen_date    TEXT    DEFAULT ( '2025-12-01' ),
				FOREIGN KEY ( category_id )    REFERENCES Category (category_id )
			);


		` );
		// User setup
		await db.runAsync( 'INSERT OR IGNORE INTO Entity ( entity_name, entity_type ) VALUES ( ?, ? )', [ 'Full Name', 'Person' ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Game_Data ( user_id, current_level, score ) VALUES ( ?, ?, ? )', [ 1, 1, 0 ]);

		await db.runAsync( 'INSERT OR IGNORE INTO Streak_History ( streak_id, date_played, streak_seen ) VALUES ( ?, ?, ? )', [ '2026-03-02', '2026-03-02T23:00:00.000Z', 1 ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Streak_History ( streak_id, date_played, streak_seen ) VALUES ( ?, ?, ? )', [ '2026-03-03', '2026-03-03T23:00:00.000Z', 1 ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Streak_History ( streak_id, date_played, streak_seen ) VALUES ( ?, ?, ? )', [ '2026-03-04', '2026-03-04T23:00:00.000Z', 1 ]);
		// await db.runAsync( 'INSERT OR IGNORE INTO Streak_History ( streak_id, date_played, streak_seen ) VALUES ( ?, ?, ? )', [ '2026-02-24', '2026-02-24T23:00:00.000Z', 1 ]);
		// await db.runAsync( 'INSERT OR IGNORE INTO Streak_History ( streak_id, date_played, streak_seen ) VALUES ( ?, ?, ? )', [ '2026-02-25', '2026-02-25T23:00:00.000Z', 1 ]);



		// Demo Data
		await db.runAsync( 'UPDATE Entity SET entity_name = ? WHERE entity_id = ?;', [ 'Michael S. Baker', 1 ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Person ( person_id, dob, height, weight ) VALUES ( ?, ?, ?, ? )', [ 1, '1995-12-13', '181 cm', '83 kg' ]);

		await db.runAsync( 'INSERT OR IGNORE INTO Entity ( entity_name, entity_type ) VALUES ( ?, ? )', [ 'Dr. Smith', 'Doctor' ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Doctor ( doctor_id, facility_name, specialty, current ) VALUES ( ?, ?, ?, ? )', [ 2, "Dr. Smiths clinic", 'Pulmonologist', 1 ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Address ( entity_id, address_line_one, city, State, post_code, country ) VALUES ( ?, ?, ?, ?, ?, ? )', [ 2, '13731 S. Archer Avenue', 'Lemont', 'IL', '60439', 'USA' ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Email ( entity_id, Email ) VALUES ( ?, ? )', [ 2, 'clinic@mail.com']);
		await db.runAsync( 'INSERT OR IGNORE INTO Phone ( entity_id, phone_number, number_type ) VALUES ( ?, ?, ? )', [ 2, '588-2300', 'Office number']);

		await db.runAsync( 'INSERT OR IGNORE INTO Medical_Condition ( doctor_id, condition_name, diagnosis_date, is_allergy ) VALUES ( ?, ?, ?, ? )', [ 2, 'Chronic obstructive pulmonary disease', '2021-11-15', 0 ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Medication ( doctor_id, condition_id, medication_name, strength, frequency, start_date, is_life_sustaining ) VALUES ( ?, ?, ?, ?, ?, ?, ? )', [ 2, 1, 'Amoxicillin', '500 mg', '1 capsule every 12 hours', '2020-11-15', 0 ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Medication ( doctor_id, condition_id, medication_name, strength, frequency, start_date, is_life_sustaining ) VALUES ( ?, ?, ?, ?, ?, ?, ? )', [ 2, 1, 'Salbutamol', '20 mg', '2 puffs ( 200 mcg ) every 4-6 hours', '2020-11-15', 1 ]);

		await db.runAsync( 'INSERT OR IGNORE INTO Medical_Condition ( doctor_id, condition_name, diagnosis_date, is_allergy ) VALUES ( ?, ?, ?, ? )', [ 2, 'Condition 2', '2021-11-15', 0 ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Medication ( doctor_id, condition_id, medication_name, strength, frequency, start_date, is_life_sustaining ) VALUES ( ?, ?, ?, ?, ?, ?, ? )', [ 2, 2, 'Med 3', '50 mg', '1 capsule every 8 hours', '2020-11-15', 0 ]);

		await db.runAsync( 'INSERT OR IGNORE INTO Entity ( entity_name, entity_type ) VALUES ( ?, ? )', [ 'Dr. Parker', 'Doctor' ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Doctor ( doctor_id,  specialty, current ) VALUES ( ?, ?, ? )', [ 3, 'Allergist', 0 ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Address ( entity_id, address_line_one, city, State, post_code, country ) VALUES ( ?, ?, ?, ?, ?, ? )', [ 3, '34', 'Lockport', 'IL', '60441', 'USA' ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Email ( entity_id, Email ) VALUES (?, ? )', [ 3, 'user@email.com' ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Phone ( entity_id, phone_number, number_type ) Values ( ?, ?, ? )', [ 3, '1 (800) 555-3333', 'Office' ]);

		await db.runAsync( 'INSERT OR IGNORE INTO Medical_Condition ( condition_name, diagnosis_date, is_allergy ) VALUES ( ?, ?, ? )', [ 'Allergy', '2022-06-06', 1 ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Allergy ( allergy_id, allergen, severity ) VALUES ( ?, ?, ? )', [ 3, 'Nickel', 'Life Threatening' ]);

		await db.runAsync( 'INSERT OR IGNORE INTO Medical_Condition (  doctor_id, condition_name, is_allergy ) VALUES ( ?, ?, ? )', [ 3, 'Allergy', 1 ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Allergy ( allergy_id, allergen, severity ) VALUES ( ?, ?, ? )', [ 4, 'Apple', 'Mild' ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Medication ( doctor_id, condition_id, medication_name, strength, frequency, start_date, is_life_sustaining ) VALUES ( ?, ?, ?, ?, ?, ?, ? )', [ 3, 4, 'Allegra', '180 mg', '1 tablet every 24 hours', '2015-01-03', 0 ]);

		await db.runAsync( 'INSERT OR IGNORE INTO Entity ( entity_name, entity_type ) VALUES ( ?, ? )', [ 'ABC Insurance', 'Business' ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Insurance ( insurance_id, policy_number, insurance_type ) VALUES ( ?, ?, ? )', [ 4, '1789', 'Health' ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Address ( entity_id, address_line_one, address_line_two, city, State, post_code, country, address_note ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ? )', [ 4, '23 Main Street', 'Unit 1', 'Lemont', 'IL', '44', 'USA', 'Office location' ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Email ( entity_id, Email, email_note ) VALUES (?, ?, ? )', [ 4, 'abc@email.com', 'email note' ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Phone ( entity_id, phone_number, number_type, phone_number_note ) Values ( ?, ?, ?, ? )', [ 4, '1 (800) 555-2222', 'Fax', 'Fax' ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Phone ( entity_id, phone_number, number_type, phone_number_note ) Values ( ?, ?, ?, ? )', [ 4, '1 (800) 555-1111', 'Office', 'Office number' ]);

		await db.runAsync( 'INSERT OR IGNORE INTO Entity ( entity_name, entity_type ) VALUES ( ?, ? )', [ 'DEF Insurance', 'Business' ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Insurance ( insurance_id, policy_number, insurance_type ) VALUES ( ?, ?, ? )', [ 5, 'A13989', 'Health' ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Phone ( entity_id, phone_number, number_type, phone_number_note ) Values ( ?, ?, ?, ? )', [ 5, '1 (800) 555-4444', 'Office', 'Office number' ]);

		await db.runAsync( ' INSERT OR IGNORE INTO Category ( category_name ) VALUES ( ? )', [ 'Hurricane' ]);

		for ( const row of match_data ) { await db.runAsync(  match_insert, row ); }
		for ( const row of mc_data ) { await db.runAsync( mc_insert, row ); }
		for ( const row of tf_data ) { await db.runAsync( tf_insert, row ); }

		console.log( "Database initialized" );
	}
	catch ( error )
	{
		console.error( "Database error:", error );
	}
}

const match_data =
[
	// Hurricane Data
	[ 1, 'Tropical Depression', '≤ 38 mph winds' ],
	[ 1, 'Tropical Storm', ' 39 – 73 mph winds' ],	
	[ 1, 'Category 1 Hurricane', '74 – 95 mph winds' ],
	[ 1, 'Category 2 Hurricane', '96 – 110 mph winds' ],
	[ 1, 'Category 3 Hurricane', '111 - 129 mph winds' ],
	[ 1, 'Category 4 Hurricane', '130 - 156 mph winds' ],
	[ 1, 'Category 5 Hurricane', '≥ 157 mph winds' ],
	[ 1, 'Eye of the hurricane', 'The calm center' ],
	[ 1, 'Eyewall', 'Ring of intense thunderstorms' ],
	[ 1, 'Hurricane Watch', 'Possible within 48 hours' ],
	[ 1, 'Hurricane Warning', 'Expected within 36 hours' ],
	[ 1, 'Storm surge', 'Excessive water rising water' ],
	[ 2, 'question 1', 'answer 1' ],
	[ 2, 'question 2', 'answer 2' ],
	[ 2, 'question 3', 'answer 3' ],
	[ 2, 'question 4', 'answer 4' ],
	[ 2, 'question 5', 'answer 5' ],
	[ 2, 'question 6', 'answer 6' ],
	[ 2, 'question 7', 'answer 7' ],
	[ 2, 'question 8', 'answer 8' ],
	[ 2, 'question 9', 'answer 9' ],
	[ 2, 'question 10', 'answer 10' ],
	[ 2, 'question 11', 'answer 11' ],
	[ 2, 'question 12', 'answer 12' ]
];

const match_insert =
`
	INSERT OR IGNORE INTO Matching_Data
	( category_id, question, answer )
	VALUES ( ?, ?, ? );
`;

const mc_data =
[
	[ 1, 'Why should hurricane planning cover more than just wind hazards?', 'Storm surge and storm tide are the deadliest hazards.', 'Hurricanes cause wild fires.', 'High Winds are the only threat.', 'Debris left from a hurricane can be a deadly hazard.' ],
	[ 1, 'Which hurricane hazard causes fatalities inland?', 'Heavy rainfall and inland flooding', 'Ice storms and snow squalls', 'Dust storms and debris', 'Fallen trees' ],
	[ 1, 'What is the correct response to an evacuation order?', 'Evacuate immediately.', 'Wait to see if your area is affected.', 'Evacuate only if your house loses power.', 'Wait till the wind dies down.' ],
	[ 1, 'Which is the safest location inside a house during the peak of hurricane winds?', 'In a small interior room on the lowest level, away from windows.', 'In a bedroom, under the bed.', 'In a kitchen, under the table.', 'Inside a car parked in the garage.' ],
	[ 1, 'What is the primary reason you should not open windows to equalize pressure?', 'answer 5c', 'answer 5i1', 'answer 5i2', 'answer 5i3' ],
	[ 1, 'question 6', 'answer 6c', 'answer 6i1', 'answer 6i2', 'answer 6i3' ],
	[ 1, 'question 7', 'answer 7c', 'answer 7i1', 'answer 7i2', 'answer 7i3' ],
	[ 1, 'question 8', 'answer 8c', 'answer 8i1', 'answer 8i2', 'answer 8i3' ],
	[ 1, 'question 9', 'answer 9c', 'answer 9i1', 'answer 9i2', 'answer 9i3' ],
	[ 1, 'question 10', 'answer 10c', 'answer 10i1', 'answer 10i2', 'answer 10i3' ],
	[ 2, 'question 10', 'answer 10c', 'answer 10i1', 'answer 10i2', 'answer 10i3' ],
];

const mc_insert =
`
	INSERT OR IGNORE INTO Multiple_Choice_Data
	( category_id, question, answer_correct, answer_one_Incorrect, answer_two_Incorrect, answer_three_Incorrect )
	VALUES ( ?, ?, ?, ?, ?, ? );
`;

const tf_data =
[
	[ 1, 'question 1', 'True' ],
	[ 1, 'question 2', 'True' ],
	[ 1, 'question 3', 'True' ],
	[ 1, 'question 4', 'False' ],
	[ 1, 'question 5', 'False' ],
	[ 1, 'question 6', 'True' ],
	[ 1, 'question 7', 'False' ],
	[ 1, 'question 8', 'True' ],
	[ 1, 'question 9', 'False' ],
	[ 1, 'question 10', 'True' ],
	[ 1, 'question 10', 'True' ],
	[ 1, 'question 11', 'True' ],
	[ 1, 'question 12', 'True' ],
	[ 1, 'question 13', 'True' ],
	[ 1, 'question 14', 'False' ],
	[ 1, 'question 15', 'False' ],
	[ 1, 'question 16', 'True' ]
];

const tf_insert =
`
	INSERT OR IGNORE INTO True_False_Data
	( category_id, question, answer )
	VALUES ( ?, ?, ? );
`;