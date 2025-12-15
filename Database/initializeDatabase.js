/*
*	Sets up Database on first run
*	Includes 1 Demo Person with data
*/
export default async function initializeDatabase(db)
{
	try
	{
		await db.execAsync(
		`
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
				Entity_Type    TEXT    NOT NULL    CHECK (Entity_Type IN ('Person', 'Doctor', 'Pharmacy'))
			);

			CREATE TABLE IF NOT EXISTS    Person
			(
				Person_ID    INTEGER    PRIMARY KEY,
				DOB    TEXT,
				Sex    TEXT,
				Height    TEXT,
				Weight    TEXT,				
				Blood_Type    TEXT    CHECK (Blood_Type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
				FOREIGN KEY (Person_ID)    REFERENCES Entity(Entity_ID)
			);

			CREATE TABLE IF NOT EXISTS    Doctor
			(
				Doctor_ID    INTEGER    PRIMARY KEY,
				Facility_Name    TEXT,
				Specialty    TEXT,
				Start_Date    TEXT,
				End_Date    TEXT,
				FOREIGN KEY (Doctor_ID)    REFERENCES Entity(Entity_ID)
			); 

			CREATE TABLE IF NOT EXISTS    Medical_Condition
			(
				Medical_Condition_ID    INTEGER    PRIMARY KEY,
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
				Note    TEXT,
				FOREIGN KEY (Medical_Condition_ID)    REFERENCES Medical_Condition(Medical_Condition_ID),
				FOREIGN KEY (Doctor_ID)    REFERENCES Entity(Entity_ID)    ON DELETE RESTRICT
			);

			CREATE TABLE IF NOT EXISTS    Allergy
			(
				Allergy_ID    INTEGER    PRIMARY KEY,
				Allergen    TEXT,
				Note    TEXT,
				Severity    TEXT    CHECK (Severity IN ('Mild','Moderate','Severe', 'Life Threatening')),
				FOREIGN KEY (Allergy_ID)    REFERENCES Medical_Condition(Medical_Condition_ID)
			);

			CREATE TABLE IF NOT EXISTS    Insurance
			(
				Insurance_ID    INTEGER    PRIMARY KEY,
				Company_Name    TEXT    NOT NULL,
				Policy_Number    TEXT,
				Phone_Number    TEXT,
				Start_Date    TEXT,
				Note    TEXT,
				Insurance_Type    TEXT    CHECK (Insurance_Type IN ('Health', 'Home', 'Auto', 'Life', 'Other'))
			);


		`);

		// Demo Data
		await db.runAsync('INSERT OR IGNORE INTO Entity (Entity_Name, Entity_Type) VALUES (?, ?)', ['Michael S. Baker', 'Person'] );
		await db.runAsync('INSERT OR IGNORE INTO Person (Person_ID, DOB, Sex, Height, Weight, Blood_Type) VALUES (?, ?, ?, ?, ?, ?)', [1, '1995-12-13', 'Male', '181 cm', '83 kg', 'A+'] );

		await db.runAsync('INSERT OR IGNORE INTO Entity (Entity_Name, Entity_Type) VALUES (?, ?)', ['Dr. Smith', 'Doctor'] );
		await db.runAsync('INSERT OR IGNORE INTO Doctor (Doctor_ID, Specialty) VALUES (?,?)', [2, 'Pulmonologist'] );

		await db.runAsync('INSERT OR IGNORE INTO Entity (Entity_Name, Entity_Type) VALUES (?, ?)', ['Dr. Parker', 'Doctor'] );
		await db.runAsync('INSERT OR IGNORE INTO Doctor (Doctor_ID, Specialty) VALUES (?,?)', [3, 'Allergist'] );

		await db.runAsync('INSERT OR IGNORE INTO Medical_Condition (Doctor_ID, Condition_Name, Diagnosis_Date) VALUES (?, ?, ?)', [2, 'Chronic obstructive pulmonary disease', '2021-11-15'] );
		await db.runAsync('INSERT OR IGNORE INTO Medication (Doctor_ID, Medical_Condition_ID, Medication_Name, Strength, Frequency, Start_Date) VALUES (?, ?, ?, ?, ?, ?)', [2, 1, 'Salbutamol', '20 mg', '2 puffs (200 mcg) every 4-6 hours', '2020-11-15' ] );

		await db.runAsync('INSERT OR IGNORE INTO Medical_Condition (Condition_Name, Diagnosis_Date) VALUES (?, ?)', ['Allergy', '2022-06-06'] );
		await db.runAsync('INSERT OR IGNORE INTO Allergy (Allergy_ID, Allergen, Severity) VALUES (?, ?, ?)', [2, 'Nickel', 'Moderate'] );

		await db.runAsync('INSERT OR IGNORE INTO Medical_Condition (Condition_Name) VALUES (?)', ['Allergy'] );
		await db.runAsync('INSERT OR IGNORE INTO Allergy (Allergy_ID, Allergen, Severity) VALUES (?, ?, ?)', [3, 'Pollen', 'Mild'] );
		await db.runAsync('INSERT OR IGNORE INTO Medication (Doctor_ID, Medical_Condition_ID, Medication_Name, Strength, Frequency, Start_Date) VALUES (?, ?, ?, ?, ?, ?)', [3, 3, 'Allegra', '180 mg', '1 tablet every 24 hours', '2015-01-03'] );

		await db.runAsync('INSERT OR IGNORE INTO Insurance (Company_Name, Policy_Number, Phone_Number, Insurance_Type) VALUES (?, ?, ?, ?)', ['Insurance Group', '1789', '555-123-6789', 'Health'] );

		
		console.log("Database initialized");
	}
	catch (error)
	{
		console.error("Database error:", error);
	}
}