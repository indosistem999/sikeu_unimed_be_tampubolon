import AppDataSource from "../../config/dbconfig";
import { masterMenuSeeder } from "./MasterMenuSeeder";
import { masterModuleSeeder } from "./MasterModuleSeeder";
import { rolesSeeder } from "./RoleSeeder";
import { usersSeeder } from "./UserSeeder";

const runSeeders = async () => {
  try {
    // Only initialize if not already initialized
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('Database connection established');
    }

    /** Roles */
    console.log('Seeding Roles...');
    await rolesSeeder();
    console.log('Roles seeded successfully');

    /** Users */
    console.log('Seeding Users...');
    await usersSeeder();
    console.log('Users seeded successfully');

    /** Master Module */
    console.log('Seeding Master Module...');
    await masterModuleSeeder();
    console.log('Master Module seeded successfully');

    /** Master Menu */
    console.log('Seeding Master Menu...');
    await masterMenuSeeder();
    console.log('Master Menu seeded successfully');

    // Close the connection if we initialized it
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('Database connection closed');
    }

    // Exit successfully
    process.exit(0);
  } catch (error) {
    console.error('Error running seeders:', error);
    // Close the connection if it's open
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    // Exit with error
    process.exit(1);
  }
}

runSeeders();
