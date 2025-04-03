import AppDataSource from '../../config/dbconfig';
import { generateSlug } from '../../lib/utils/common.util';
import { Roles } from '../models/Roles';

const rolesList = [
    { role_name: 'Admin',  },
    { role_name: 'Staff', },
    { role_name: 'Owner',  },
    { role_name: 'Developer' }
]

export const rolesSeeder = async () => {
  const repository = AppDataSource.getRepository(Roles);

  for (let i = 0; i < rolesList.length; i++) {
    const element = rolesList[i];
    const slug = generateSlug(element.role_name) ?? ''
    
    const findRole = await repository.findOne({
        where: {
            role_slug: slug
        }
    })

    if(!findRole) {
        await repository.save(repository.create({
            role_name: element?.role_name,
            role_slug: slug
        }))
    }
  }
};
