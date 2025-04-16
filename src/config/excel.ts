import ExcelJs, { Workbook } from 'exceljs';
import { Request, Response } from 'express'
import { sendErrorResponse } from '../lib/utils/response.util';
import { MessageDialog } from '../lang';
import { GenerateExcelParams } from '../interfaces/app.interface';


export const makeFileExcel = async (
  res: Response,
  option: GenerateExcelParams
): Promise<Response> => {
  try {
    const workBook = new ExcelJs.Workbook();
    const workSheet = workBook.addWorksheet(option.sheetName);

    // Set headers (Table Column)
    workSheet.addRow(option.headers);

    option?.records?.forEach((item: any) => {
      workSheet.addRow(Object.values(item))
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${option.fileName}.xlsx`);

    await workBook.xlsx.write(res);

    return res.status(200).end();
  } catch (error: any) {
    return sendErrorResponse(res, 400, MessageDialog.__('error.download.xlsx'), error)
  }
}