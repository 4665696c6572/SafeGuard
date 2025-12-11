/*
*	Sets up Database on first run
*	Includes 2 Demo tables
*/
export default async function initializeDatabase(db)
{
	try
	{
		await db.execAsync(
		`
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
				Entity_Type    TEXT    NOT NULL    CHECK (Entity_Type IN ('Person', 'Doctor', 'Pharmacy'))
			);

			CREATE TABLE IF NOT EXISTS    Person
			(
				Person_ID    INTEGER    PRIMARY KEY,
				DOB    TEXT,
				Sex   TEXT,
				Height    TEXT,
				Weight    TEXT,				
				Blood_Type    TEXT    CHECK (Blood_Type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
				FOREIGN KEY (Person_ID)    REFERENCES Entity(Entity_ID)
			);

			CREATE TABLE IF NOT EXISTS    Doctor 
			(
				Doctor_ID  INTEGER  PRIMARY KEY,
				Facility_Name    TEXT,
				Specialty    TEXT,
				Start_Date    TEXT,
				End_Date    TEXT,
				FOREIGN KEY (Doctor_ID)    REFERENCES Entity(Entity_ID)
			); 

			CREATE TABLE IF NOT EXISTS    Medical_Condition 
			(
				Medical_Condition_ID  INTEGER  PRIMARY KEY,
				Doctor_ID    INTEGER, 
				Condition_Name    TEXT    NOT NULL,
				Diagnosis_Date    TEXT,
				Note    TEXT,    
				FOREIGN KEY (Doctor_ID)    REFERENCES Entity(Entity_ID)
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
				End_Date    TEXT,
				Note    TEXT,
				FOREIGN KEY (Medical_Condition_ID)    REFERENCES Medical_Condition(Medical_Condition_ID),
				FOREIGN KEY (Doctor_ID)    REFERENCES Entity(Entity_ID)    ON DELETE RESTRICT
			);
		`);

		// Demo Data
		await db.runAsync('INSERT OR IGNORE INTO Entity (Entity_Name, Entity_Type) VALUES (?, ?)', ['Person 1', 'Person']);
		await db.runAsync('INSERT OR IGNORE INTO Entity (Entity_Name, Entity_Type) VALUES (?, ?)', ['Doctor 1', 'Doctor']);
		await db.runAsync('INSERT OR IGNORE INTO Person (Person_ID, DOB, Sex, Height, Weight) VALUES (?, ?, ?, ?, ?)', [1, '2000-01-01',  'Male', `5' 2"`, '160 lbs.'] );
		await db.runAsync('INSERT OR IGNORE INTO Doctor (Doctor_ID, Specialty) VALUES (?,?)', [2, 'Urologist'] );
		await db.runAsync('INSERT OR IGNORE INTO Medical_Condition (Doctor_ID, Condition_Name) VALUES (?, ?)', [2, 'UTI'] );
		await db.runAsync('INSERT OR IGNORE INTO Medication (Doctor_ID, Medical_Condition_ID, Medication_Name, Strength, Frequency, Start_Date, End_Date) VALUES (?, ?, ?, ?, ?, ?, ?)', [2, 1, 'SMT', '960mg', '1 capsule BID', '2025-12-06', '2025-12-16' ] );

		console.log("Database initialized");
	}
	catch (error)
	{
		console.error("Database error:", error);
	}
}