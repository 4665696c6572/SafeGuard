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
			DROP TABLE IF EXISTS True_False_Data;
			DROP TABLE IF EXISTS Multiple_Choice_Data;
			DROP TABLE IF EXISTS Matching_Data;
			DROP TABLE IF EXISTS Game_Data;

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
				Entity_ID    INTEGER    PRIMARY KEY,
				Entity_Name    TEXT    NOT NULL    UNIQUE,
				Entity_Type    TEXT    NOT NULL    CHECK ( Entity_Type IN ( 'Person', 'Doctor', 'Business' ) )
			);

			CREATE TABLE IF NOT EXISTS    Person
			( 
				Person_ID    INTEGER    PRIMARY KEY,
				DOB    TEXT,
				Sex    TEXT,
				Height    TEXT,
				Weight    TEXT,				
				Blood_Type    TEXT    CHECK ( Blood_Type IN ( 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-' ) ),
				FOREIGN KEY ( Person_ID )    REFERENCES Entity( Entity_ID )
			);

			CREATE TABLE IF NOT EXISTS    Doctor
			( 
				Doctor_ID    INTEGER    PRIMARY KEY,
				Facility_ID    INTEGER,
				Specialty    TEXT,
				Start_Date    TEXT,
				End_Date    TEXT,
				FOREIGN KEY ( Doctor_ID )    REFERENCES Entity( Entity_ID ),
				FOREIGN KEY ( Facility_ID )    REFERENCES Entity( Entity_ID )
			); 

			CREATE TABLE IF NOT EXISTS    Medical_Condition
			( 
				Medical_Condition_ID    INTEGER    PRIMARY KEY,
				Doctor_ID    INTEGER, 
				Condition_Name    TEXT    NOT NULL,
				Diagnosis_Date    TEXT,
				Note    TEXT,
				FOREIGN KEY ( Doctor_ID )    REFERENCES Entity( Entity_ID )
			);

			CREATE TABLE IF NOT EXISTS    Medication
			( 
				Medication_ID    INTEGER    PRIMARY KEY,
				Doctor_ID    INTEGER, 
				Medical_Condition_ID    INTEGER, 
				Medication_Name    TEXT    NOT NULL,
				Strength    TEXT,
				Frequency    TEXT,
				Start_Date    TEXT,
				Note    TEXT,
				FOREIGN KEY ( Medical_Condition_ID )    REFERENCES Medical_Condition( Medical_Condition_ID ),
				FOREIGN KEY ( Doctor_ID )    REFERENCES Entity( Entity_ID )    ON DELETE RESTRICT
			);

			CREATE TABLE IF NOT EXISTS    Allergy
			( 
				Allergy_ID    INTEGER    PRIMARY KEY,
				Allergen    TEXT,
				Severity    TEXT    CHECK ( Severity IN ( 'Mild','Moderate','Severe', 'Life Threatening' ) ),
				FOREIGN KEY ( Allergy_ID )    REFERENCES Medical_Condition( Medical_Condition_ID )
			);

			CREATE TABLE IF NOT EXISTS    Insurance
			( 
				Policy_Number    TEXT    PRIMARY KEY,
				Insurance_ID    INTEGER,
				Start_Date    TEXT,
				Note    TEXT,
				Insurance_Type    TEXT    CHECK ( Insurance_Type IN ( 'Health', 'Home', 'Auto', 'Life', 'Other' ) ),
				FOREIGN KEY ( Insurance_ID )    REFERENCES Entity( Entity_ID )
			);



			CREATE TABLE IF NOT EXISTS    Game_Data
			( 
				User_ID    INTEGER    PRIMARY KEY,
				Score    INTEGER    DEFAULT ( 0 ),
				Level_Status    TEXT
			);

			CREATE TABLE IF NOT EXISTS    Matching_Data
			( 
				Question_ID    INTEGER    PRIMARY KEY,
				Question    TEXT,
				Answer    TEXT,
				Last_Seen_Date    TEXT    DEFAULT ( '2025-12-01' )
			);

			CREATE TABLE IF NOT EXISTS    Multiple_Choice_Data
			( 
				Question_ID    INTEGER    PRIMARY KEY,
				Question    TEXT,
				Answer_Correct    TEXT,
				Incorrect_Answer_One    TEXT,
				Incorrect_Answer_Two    TEXT,
				Incorrect_Answer_Three    TEXT,
				Last_Seen_Date    TEXT    DEFAULT ( '2025-12-01' )
			);

			CREATE TABLE IF NOT EXISTS    True_False_Data
			( 
				Question_ID    INTEGER    PRIMARY KEY,
				Question    TEXT,
				True_Or_False    TEXT,
				Last_Seen_Date    TEXT    DEFAULT ( '2025-12-01' )
			);

		` );

		// Demo Data
		await db.runAsync( 'INSERT OR IGNORE INTO Entity ( Entity_Name, Entity_Type ) VALUES ( ?, ? )', [ 'Michael S. Baker', 'Person' ]  );
		await db.runAsync( 'INSERT OR IGNORE INTO Person ( Person_ID, DOB, Sex, Height, Weight, Blood_Type ) VALUES ( ?, ?, ?, ?, ?, ? )', [ 1, '1995-12-13', 'Male', '181 cm', '83 kg', 'A+' ]  );

		await db.runAsync( 'INSERT OR IGNORE INTO Entity ( Entity_Name, Entity_Type ) VALUES ( ?, ? )', [ 'Dr. Smith', 'Doctor' ]  );
		await db.runAsync( 'INSERT OR IGNORE INTO Doctor ( Doctor_ID, Specialty ) VALUES ( ?,? )', [ 2, 'Pulmonologist' ]  );

		await db.runAsync( 'INSERT OR IGNORE INTO Entity ( Entity_Name, Entity_Type ) VALUES ( ?, ? )', [ 'Dr. Parker', 'Doctor' ]  );
		await db.runAsync( 'INSERT OR IGNORE INTO Doctor ( Doctor_ID, Specialty ) VALUES ( ?,? )', [ 3, 'Allergist' ]  );

		await db.runAsync( 'INSERT OR IGNORE INTO Medical_Condition ( Doctor_ID, Condition_Name, Diagnosis_Date ) VALUES ( ?, ?, ? )', [ 2, 'Chronic obstructive pulmonary disease', '2021-11-15' ]  );
		await db.runAsync( 'INSERT OR IGNORE INTO Medication ( Doctor_ID, Medical_Condition_ID, Medication_Name, Strength, Frequency, Start_Date ) VALUES ( ?, ?, ?, ?, ?, ? )', [ 2, 1, 'Salbutamol', '20 mg', '2 puffs ( 200 mcg ) every 4-6 hours', '2020-11-15' ]  );

		await db.runAsync( 'INSERT OR IGNORE INTO Medical_Condition ( Condition_Name, Diagnosis_Date ) VALUES ( ?, ? )', [ 'Allergy', '2022-06-06' ]  );
		await db.runAsync( 'INSERT OR IGNORE INTO Allergy ( Allergy_ID, Allergen, Severity ) VALUES ( ?, ?, ? )', [ 2, 'Nickel', 'Moderate' ]  );

		await db.runAsync( 'INSERT OR IGNORE INTO Medical_Condition ( Condition_Name ) VALUES ( ? )', [ 'Allergy' ]  );
		await db.runAsync( 'INSERT OR IGNORE INTO Allergy ( Allergy_ID, Allergen, Severity ) VALUES ( ?, ?, ? )', [ 3, 'Pollen', 'Mild' ]  );
		await db.runAsync( 'INSERT OR IGNORE INTO Medication ( Doctor_ID, Medical_Condition_ID, Medication_Name, Strength, Frequency, Start_Date ) VALUES ( ?, ?, ?, ?, ?, ? )', [ 3, 3, 'Allegra', '180 mg', '1 tablet every 24 hours', '2015-01-03' ]  );

		await db.runAsync( 'INSERT OR IGNORE INTO Entity ( Entity_Name, Entity_Type ) VALUES ( ?, ? )', [ 'ABC Insurance', 'Business' ]  );
		await db.runAsync( 'INSERT OR IGNORE INTO Insurance ( Insurance_ID, Policy_Number, Insurance_Type ) VALUES ( ?, ?, ? )', [ 4, '1789', 'Health' ]  );

		await db.runAsync( 'INSERT OR IGNORE INTO Game_Data ( User_ID ) VALUES ( ? )', [ 1 ]  );

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
	[ 'Question 1', 'Answer 1' ],
	[ 'Question 2', 'Answer 2' ],
	[ 'Question 3', 'Answer 3' ],
	[ 'Question 4', 'Answer 4' ],
	[ 'Question 5', 'Answer 5' ],
	[ 'Question 6', 'Answer 6' ],
	[ 'Question 7', 'Answer 7' ],
	[ 'Question 8', 'Answer 8' ],
	[ 'Question 9', 'Answer 9' ],
	[ 'Question 10', 'Answer 10' ],
	[ 'Question 11', 'Answer 11' ],
	[ 'Question 12', 'Answer 12' ]
];

const match_insert = 
`
	INSERT OR IGNORE INTO Matching_Data  
	( Question, Answer ) 
	VALUES ( ?, ? );
`;

const mc_data = 
[ 
	[ 'Question 1', 'Answer 1c', 'Answer 1i1', 'Answer 1i2', 'Answer 1i3' ],
	[ 'Question 2', 'Answer 2c', 'Answer 2i1', 'Answer 2i2', 'Answer 2i3' ],
	[ 'Question 3', 'Answer 3c', 'Answer 3i1', 'Answer 3i2', 'Answer 3i3' ],
	[ 'Question 4', 'Answer 4c', 'Answer 4i1', 'Answer 4i2', 'Answer 4i3' ],
	[ 'Question 5', 'Answer 5c', 'Answer 5i1', 'Answer 5i2', 'Answer 5i3' ],
	[ 'Question 6', 'Answer 6c', 'Answer 6i1', 'Answer 6i2', 'Answer 6i3' ],
	[ 'Question 7', 'Answer 7c', 'Answer 7i1', 'Answer 7i2', 'Answer 7i3' ],
	[ 'Question 8', 'Answer 8c', 'Answer 8i1', 'Answer 8i2', 'Answer 8i3' ],
	[ 'Question 9', 'Answer 9c', 'Answer 9i1', 'Answer 9i2', 'Answer 9i3' ],
	[ 'Question 10', 'Answer 10c', 'Answer 10i1', 'Answer 10i2', 'Answer 10i3' ],
];

const mc_insert = 
`
	INSERT OR IGNORE INTO Multiple_Choice_Data
	( Question, Answer_correct, Incorrect_Answer_One, Incorrect_Answer_Two, Incorrect_Answer_Three )
	VALUES ( ?, ?, ?, ?, ? );
`;

const tf_data = 
[ 
	[ 'Question 1',  'True' ],
	[ 'Question 2',  'True' ],
	[ 'Question 3',  'True' ],
	[ 'Question 4', 'False' ],
	[ 'Question 5', 'False' ],
	[ 'Question 6',  'True' ],
	[ 'Question 7', 'False' ],
	[ 'Question 8',  'True' ],
	[ 'Question 9', 'False' ],
	[ 'Question 10', 'True' ],
	[ 'Question 10', 'True' ],
	[ 'Question 11',  'True' ],
	[ 'Question 12',  'True' ],
	[ 'Question 13',  'True' ],
	[ 'Question 14', 'False' ],
	[ 'Question 15', 'False' ],
	[ 'Question 16',  'True' ]	
];

const tf_insert = 
`
	INSERT OR IGNORE INTO True_False_Data
	( Question, True_Or_False )
	VALUES ( ?, ? );
`;