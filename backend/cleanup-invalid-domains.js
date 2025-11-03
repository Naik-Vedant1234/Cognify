import mongoose from 'mongoose';
import dotenv from 'dotenv';
import TimeEntry from './models/TimeEntry.js';

dotenv.config();

async function cleanupInvalidDomains() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cognify');
        console.log('Connected to MongoDB');

        // Find all entries
        const allEntries = await TimeEntry.find({});
        console.log(`Total entries: ${allEntries.length}`);

        // Filter invalid ones
        const invalidEntries = allEntries.filter(entry => {
            const domain = entry.domain;
            const isInvalid = !domain ||
                domain.length > 50 ||
                !/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain) ||
                domain.includes('chrome-extension') ||
                domain.includes('localhost') ||
                domain.includes('127.0.0.1');
            return isInvalid;
        });

        console.log(`Found ${invalidEntries.length} invalid entries`);

        if (invalidEntries.length > 0) {
            console.log('Sample invalid domains:');
            invalidEntries.slice(0, 10).forEach(entry => {
                console.log(`  - ${entry.domain}`);
            });

            // Delete invalid entries
            const invalidIds = invalidEntries.map(e => e._id);
            const result = await TimeEntry.deleteMany({ _id: { $in: invalidIds } });
            console.log(`Deleted ${result.deletedCount} invalid entries`);
        }

        const remainingEntries = await TimeEntry.find({});
        console.log(`Remaining valid entries: ${remainingEntries.length}`);

        await mongoose.connection.close();
        console.log('Cleanup complete!');
    } catch (error) {
        console.error('Error during cleanup:', error);
        process.exit(1);
    }
}

cleanupInvalidDomains();
