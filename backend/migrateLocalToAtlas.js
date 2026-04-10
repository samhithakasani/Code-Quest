const { MongoClient } = require('mongodb');
require('dotenv').config();

const LOCAL_URI = 'mongodb://localhost:27017';
const ATLAS_URI = process.env.MONGO_URI;

async function migrateData() {
  const localClient = new MongoClient(LOCAL_URI);
  const atlasClient = new MongoClient(ATLAS_URI);

  try {
    await localClient.connect();
    await atlasClient.connect();
    console.log('Connected to both local and Atlas clusters');

    const sourceDb = localClient.db('codequestdb');
    const targetDb = atlasClient.db('codequestdb');

    const collections = ['users', 'quizzes', 'questions', 'results', 'papersets'];

    for (const colName of collections) {
      console.log(`\nMigrating collection: ${colName}...`);
      
      const sourceCol = sourceDb.collection(colName);
      const targetCol = targetDb.collection(colName);

      // Fetch all data from local
      const data = await sourceCol.find({}).toArray();
      console.log(`Found ${data.length} records in local ${colName}`);

      if (data.length > 0) {
        // Clear Atlas version to ensure exact match of "Old Data"
        await targetCol.deleteMany({});
        console.log(`Cleared existing data in Atlas ${colName}`);

        // Insert into Atlas
        const result = await targetCol.insertMany(data);
        console.log(`Successfully migrated ${result.insertedCount} records to Atlas ${colName}`);
      } else {
        console.log(`Skipping ${colName} because it is empty locally.`);
      }
    }

    console.log('\n🎉 FULL DATA MIGRATION COMPLETED SUCCESSFULLY!');
    console.log('Your Atlas database now exactly matches your local Compass instance.');

  } catch (err) {
    console.error('❌ Migration Error:', err);
  } finally {
    await localClient.close();
    await atlasClient.close();
  }
}

migrateData();
