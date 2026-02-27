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
				entity_name    TEXT    NOT NULL    UNIQUE,
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
				FOREIGN KEY ( doctor_id )    REFERENCES Entity( entity_id )
			);

			CREATE TABLE IF NOT EXISTS    Medical_Condition
			(
				condition_id    INTEGER    PRIMARY KEY,
				condition_name    TEXT    NOT NULL,
				doctor_id    INTEGER,
				diagnosis_date    TEXT,
				condition_note    TEXT,
				is_allergy    INTEGER    NOT NULL,
				FOREIGN KEY ( doctor_id )    REFERENCES Entity( entity_id )
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
				FOREIGN KEY ( condition_id )    REFERENCES Medical_Condition( condition_id ),
				FOREIGN KEY ( doctor_id )    REFERENCES Entity( entity_id )    ON DELETE RESTRICT
			);

			CREATE TABLE IF NOT EXISTS    Allergy
			(
				allergy_id    INTEGER    PRIMARY KEY,
				allergen    TEXT,
				severity    TEXT    CHECK ( severity IN ( 'Mild','Moderate','Severe', 'Life Threatening' ) ),
				FOREIGN KEY ( allergy_id )    REFERENCES Medical_Condition( condition_id )
			);

			CREATE TABLE IF NOT EXISTS    Insurance
			(
				insurance_id   INTEGER    PRIMARY KEY,
				policy_number    TEXT,
				start_date    TEXT,
				insurance_note    TEXT,
				insurance_type    TEXT    CHECK ( insurance_type IN ( 'Health', 'Home', 'Auto', 'Life', 'Other' )),
				FOREIGN KEY ( insurance_id)    REFERENCES Entity( entity_id )
			);

			CREATE TABLE IF NOT EXISTS    Phone
			(
				phone_number_id    INTEGER    PRIMARY KEY,
				entity_id    INTEGER,
				phone_number    TEXT    NOT NULL,
				number_type    TEXT    NOT NULL    CHECK ( number_type IN ( 'Cell', 'Fax', 'Home', 'Office', 'Other' )),
				phone_number_note    TEXT,
				FOREIGN KEY ( entity_id )    REFERENCES Entity( entity_id )
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
				FOREIGN KEY ( entity_id )    REFERENCES Entity( entity_id )
			);

			CREATE TABLE IF NOT EXISTS    Email
			(
				email_id    INTEGER    PRIMARY KEY,
				entity_id    INTEGER,
				email,
				email_note    TEXT,
				FOREIGN KEY ( entity_id )    REFERENCES Entity( entity_id )
			);



			CREATE TABLE IF NOT EXISTS    Game_Data
			(
				user_id    INTEGER    PRIMARY KEY,
				current_level    TEXT    DEFAULT ( 1 )    UNIQUE,
				score    INTEGER    DEFAULT ( 0 ),
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
				question    TEXT,
				answer    TEXT,
				last_seen_date    TEXT    DEFAULT ( '2025-12-01' )
			);

			CREATE TABLE IF NOT EXISTS    Multiple_Choice_Data
			(
				question_id    INTEGER    PRIMARY KEY,
				question    TEXT,
				answer_correct    TEXT,
				answer_one_incorrect    TEXT,
				answer_two_incorrect    TEXT,
				answer_three_incorrect    TEXT,
				last_seen_date    TEXT    DEFAULT ( '2025-12-01' )
			);

			CREATE TABLE IF NOT EXISTS    True_False_Data
			(
				question_id    INTEGER    PRIMARY KEY,
				question    TEXT,
				answer    TEXT,
				last_seen_date    TEXT    DEFAULT ( '2025-12-01' )
			);
		` );

		// User setup
		await db.runAsync( 'INSERT OR IGNORE INTO Entity ( entity_name, entity_type ) VALUES ( ?, ? )', [ 'Full Name', 'Person' ]);
		await db.runAsync( 'INSERT OR IGNORE INTO Game_Data ( user_id, current_level, score ) VALUES ( ?, ?, ? )', [ 1, 1, 0 ]);

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
	[ 5, 'question 1', 'answer 1' ],
	[ 6, 'question 2', 'answer 2' ],
	[ 7, 'question 3', 'answer 3' ],
	[ 8, 'question 4', 'answer 4' ],
	[ 9, 'question 5', 'answer 5' ],
	[ 10, 'question 6', 'answer 6' ],
	[ 11, 'question 7', 'answer 7' ],
	[ 12, 'question 8', 'answer 8' ],
	[ 13, 'question 9', 'answer 9' ],
	[ 14, 'question 10', 'answer 10' ],
	[ 15, 'question 11', 'answer 11' ],
	[ 16, 'question 12', 'answer 12' ]
];

const match_insert =
`
	INSERT OR IGNORE INTO Matching_Data
	( question_id, question, answer )
	VALUES ( ?, ?, ? );
`;

const mc_data =
[
	[ 'question 1', 'answer 1c', 'answer 1i1', 'answer 1i2', 'answer 1i3' ],
	[ 'question 2', 'answer 2c', 'answer 2i1', 'answer 2i2', 'answer 2i3' ],
	[ 'question 3', 'answer 3c', 'answer 3i1', 'answer 3i2', 'answer 3i3' ],
	[ 'question 4', 'answer 4c', 'answer 4i1', 'answer 4i2', 'answer 4i3' ],
	[ 'question 5', 'answer 5c', 'answer 5i1', 'answer 5i2', 'answer 5i3' ],
	[ 'question 6', 'answer 6c', 'answer 6i1', 'answer 6i2', 'answer 6i3' ],
	[ 'question 7', 'answer 7c', 'answer 7i1', 'answer 7i2', 'answer 7i3' ],
	[ 'question 8', 'answer 8c', 'answer 8i1', 'answer 8i2', 'answer 8i3' ],
	[ 'question 9', 'answer 9c', 'answer 9i1', 'answer 9i2', 'answer 9i3' ],
	[ 'question 10', 'answer 10c', 'answer 10i1', 'answer 10i2', 'answer 10i3' ],
];

const mc_insert =
`
	INSERT OR IGNORE INTO Multiple_Choice_Data
	( question, answer_correct, answer_one_Incorrect, answer_two_Incorrect, answer_three_Incorrect )
	VALUES ( ?, ?, ?, ?, ? );
`;

const tf_data =
[
	[ 'question 1',  'True' ],
	[ 'question 2',  'True' ],
	[ 'question 3',  'True' ],
	[ 'question 4', 'False' ],
	[ 'question 5', 'False' ],
	[ 'question 6',  'True' ],
	[ 'question 7', 'False' ],
	[ 'question 8',  'True' ],
	[ 'question 9', 'False' ],
	[ 'question 10', 'True' ],
	[ 'question 10', 'True' ],
	[ 'question 11',  'True' ],
	[ 'question 12',  'True' ],
	[ 'question 13',  'True' ],
	[ 'question 14', 'False' ],
	[ 'question 15', 'False' ],
	[ 'question 16',  'True' ]
];

const tf_insert =
`
	INSERT OR IGNORE INTO True_False_Data
	( question, answer )
	VALUES ( ?, ? );
`;