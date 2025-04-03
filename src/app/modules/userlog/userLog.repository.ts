import AppDataSource from "../../../config/ormconfig";
import { UserLog } from "../../../database/models/UserLog";
import { I_ResultService } from "../../../interfaces/app.interface";
import { I_UserLogRepository, I_UserLogRequest } from "../../../interfaces/userLog.interface";
import { MessageDialog } from "../../../lang";


class UserLogRepository implements I_UserLogRepository {
    private logRepo = AppDataSource.getRepository(UserLog);


    async store(payload: I_UserLogRequest): Promise<I_ResultService> {
        try {
            const userLog = await this.logRepo.save(this.logRepo.create(payload));
            
            if(!userLog) {
                return {
                    message: MessageDialog.__('error.failed.storeUserLog'),
                    record: userLog,
                    success: false
                }
            }

            return {
                message: MessageDialog.__('success.log.storeUserLog'),
                record: userLog,
                success: true
            }
        } catch (err:any) {
            return {
                message: err.message,
                record: err,
                success: false
            }
        }
    }
}

export default UserLogRepository