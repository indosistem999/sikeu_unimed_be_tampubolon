import { I_MasterOfficerService } from '../../../interfaces/masterOfficer.interface';
import { MasterOfficerRepository } from './repository';

class MasterOfficerService implements I_MasterOfficerService {
  private readonly repository = new MasterOfficerRepository();

}

export default new MasterOfficerService();
