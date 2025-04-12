import AppDataSource from "../../config/dbconfig";
import { masterBudgetYearSeeder } from "./MasterBudgetYearSeeder";
import { masterMenuSeeder } from "./MasterMenuSeeder";
import { masterModuleSeeder } from "./MasterModuleSeeder";
import { rolesSeeder } from "./RoleSeeder";
import { usersSeeder } from "./UserSeeder";
import { masterJobCategorySeeder } from './MasterJobCategorySeeder'
import { masterWorkUnitSeeder } from "./MasterWorkUnitSeeder";

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


    /** Master Budget Year */
    console.log('Seeding master budget year...');
    await masterBudgetYearSeeder();
    console.log('Master budget year successfully');


    /** Master Job Category */
    console.log('Seeding master job category year...');
    await masterJobCategorySeeder();
    console.log('Master job category successfully');


    /** Master Work Unit */
    console.log('Seeding master work unit ...');
    await masterWorkUnitSeeder();
    console.log('Master work unit successfully');
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
