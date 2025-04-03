import AppDataSource from "../../config/dbconfig";
import { encryptPassword } from "../../lib/utils/bcrypt.util";
import { generateSlug, standartDateISO } from "../../lib/utils/common.util";
import { Roles } from "../models/Roles";
import { Users } from "../models/Users";

const userList = [
    {
        first_name: 'Lorem',
        last_name: 'Ipsum',
        email: 'admin@example.com',
        password: 'oracle123', // Replace with an actual hashed password
        is_active: 0,
        registered_date: new Date(standartDateISO()),
        verified_at: new Date(standartDateISO()),
        role: {
            role_name: 'Admin'
        }
     },
     {
        first_name: 'Ruben',
        last_name: 'Alpredo',
        email: 'ruben@example.com',
        password: 'test123', // Replace with an actual hashed password
        is_active: 0,
        registered_date: new Date(standartDateISO()),
        verified_at: new Date(standartDateISO()),
        role: {
            role_name: 'Developer'
        }
     }

]


export const usersSeeder = async () => {
    const repository = AppDataSource.getRepository(Users);
    const roleRepo = AppDataSource.getRepository(Roles)

    for (let a = 0; a < userList.length; a++) {
        const {role, password, ...rest} = userList[a];

        const findRole = await roleRepo.findOne({
            where: {
                role_slug: generateSlug(role?.role_name) ?? ''
            }
        })

        const ePassword = await encryptPassword(password);


        const user = await repository.findOne({
            where:{
                email: rest?.email
            }
        })

        if(!user) {
            const newUser = await repository.save(repository.create({
                ...rest,
                password: ePassword.password_hash,
                salt: ePassword.salt
            }))

            if(newUser) {
                if(findRole) {
                    newUser.role = findRole
                    newUser.created_by = newUser.user_id;
                    newUser.updated_by = newUser.updated_by;
                    newUser.updated_at = newUser.created_at
                    await repository.save(newUser)
                }
            }
        }
        
    }
}