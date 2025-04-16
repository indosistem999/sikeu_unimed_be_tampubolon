import MainRoutes from '../config/mainRoute';
import RouteHealtCheck from './routeHealtCheck';

// Controller
import AuthController from '../app/modules/auth/controller';
import MasterModuleController from '../app/modules/master_module/controller';
import MasterIdentityController from '../app/modules/master_identity/controller';
import MasterMenuController from '../app/modules/master_menu/controller'
import WorkUnitController from '../app/modules/work_unit/controller';
import UserController from '../app/modules/user/controller';
import RoleController from '../app/modules/role/controller';
import RoleAssignModuleController from '../app/modules/role_assign_module/controller'
import FeatureAccessController from '../app/modules/feature_access/controller'

// SPPD
import SPPDPangkatController from '../app/modules/sppd_pangkat/controller';
import SPPDJenisTransportasiController from '../app/modules/sppd_jenis_transportasi/controller';
import SPPDJenisBiayaController from '../app/modules/sppd_jenis_biaya/controller'
import MasterJobCategoryController from '../app/modules/master_job_category/controller'
import MasterSumberDanaController from '../app/modules/master_sumber_dana/controller'
import BagianSuratController from '../app/modules/sppd_bagian_surat/controller'
import KopSuratController from '../app/modules/sppd_kop_surat/controller'
import MasterOfficerController from '../app/modules/master_officers/controller'
import PejabatSatkerController from '../app/modules/pejabat_satker/controller'
import SPPDSuratTugasController from '../app/modules/sppd_surat_tugas/controller'
import MasterBudgetYearController from '../app/modules/master_budget_year/controller'
import UserLogController from '../app/modules/user_log/controller'
import SppdPegawaiController from '../app/modules/sppd_pegawai/controller'

const tagVersionOne: string = '/api/v1';

class RouteApplication extends MainRoutes {
  public routes(): void {
    this.router.use(RouteHealtCheck)

    // API Auth
    this.router.use(`${tagVersionOne}/auth`, AuthController);

    // API Master Identity
    this.router.use(`${tagVersionOne}/master-identity`, MasterIdentityController)

    // API Module
    this.router.use(`${tagVersionOne}/master-module`, MasterModuleController)

    // API Menu
    this.router.use(`${tagVersionOne}/master-menu`, MasterMenuController);

    // API Master Work Unit
    this.router.use(`${tagVersionOne}/work-unit`, WorkUnitController)

    // API Master Budget Year (Tahun Anggaran)
    this.router.use(`${tagVersionOne}/master-budget-year`, MasterBudgetYearController)

    // API Master Job Category
    this.router.use(`${tagVersionOne}/master-job-category`, MasterJobCategoryController)

    // API Master Sumber Dana
    this.router.use(`${tagVersionOne}/master-sumber-dana`, MasterSumberDanaController)

    // API User
    this.router.use(`${tagVersionOne}/user`, UserController)

    // API Role
    this.router.use(`${tagVersionOne}/role`, RoleController)

    // API Assigned Module To Role
    this.router.use(`${tagVersionOne}/role-assign-module`, RoleAssignModuleController)

    // API Feature Access
    this.router.use(`${tagVersionOne}/feature-access`, FeatureAccessController)


    /** SPPD */
    // SPPD Pangkat dan Golongan
    this.router.use(`${tagVersionOne}/sppd-pangkat-golongan`, SPPDPangkatController)

    // SPPD Jenis Transportasi
    this.router.use(`${tagVersionOne}/sppd-jenis-transportasi`, SPPDJenisTransportasiController)

    // SPPD Jeni Biaya
    this.router.use(`${tagVersionOne}/sppd-jenis-biaya`, SPPDJenisBiayaController)

    // SPPD Bagian Surat
    this.router.use(`${tagVersionOne}/sppd-bagian-surat`, BagianSuratController)

    // SPPD Kop Surat
    this.router.use(`${tagVersionOne}/sppd-kop-surat`, KopSuratController)

    // SPPD Surat Tugas
    this.router.use(`${tagVersionOne}/sppd-surat-tugas`, SPPDSuratTugasController)

    this.router.use(`${tagVersionOne}/master-officers`, MasterOfficerController)

    this.router.use(`${tagVersionOne}/pejabat-satker`, PejabatSatkerController)

    this.router.use(`${tagVersionOne}/user-log-activity`, UserLogController)

    this.router.use(`${tagVersionOne}/sppd-pegawai`, SppdPegawaiController)
  }
}

export default new RouteApplication().router;
