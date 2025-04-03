import { I_ResultService } from "./app.interface";

export interface I_RoleRepository {
    fetchOneByParam?(param: Record<string, any>): Promise<I_ResultService>;
}