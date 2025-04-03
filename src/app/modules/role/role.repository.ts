import AppDataSource from '../../../config/ormconfig';
import { Roles } from '../../../database/models/Roles';
import { I_ResultService } from '../../../interfaces/app.interface';
import { I_RoleRepository } from '../../../interfaces/role.interface';
import { MessageDialog } from '../../../lang';

class RoleRepository implements I_RoleRepository {
  private roleRepo = AppDataSource.getRepository(Roles);
  
  async fetchOneByParam(param: Record<string, any>): Promise<I_ResultService> {
    try {
        const role = await this.roleRepo.findOne({...param})

        if(!role) {
            return {
                success: false,
                message: MessageDialog.__('error.default.notFound'),
                record: role
            }
        }

        return{
            success: true,
            message: MessageDialog.__('success.role.findItem', {item: role.role_name}),
            record: role
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.message,
            record: error
        }
    }
  }
  
}

export default RoleRepository;
