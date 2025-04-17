import ExcelJs, { Workbook } from 'exceljs';
import { Request, Response } from 'express'
import { sendErrorResponse } from '../lib/utils/response.util';
import { MessageDialog } from '../lang';
import { I_GenerateExcelParams, I_RequestCustom, I_ExcelOriginInterface } from '../interfaces/app.interface';
import { standartDateISO } from '../lib/utils/common.util';


/** Generate File Excel */
export const makeFileExcel = async (
  res: Response,
  option: I_GenerateExcelParams
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

interface I_ObjectRaw {
  [key: string]: any
}

/** Extract file Excel */
export const extractFileExcel = async (req: I_RequestCustom, propHeaders: Record<string, any>[]): Promise<I_ExcelOriginInterface> => {
  const userId: any = req?.user?.user_id;
  const file: Buffer | any = req?.file?.buffer;

  try {
    const rowData: I_ObjectRaw[] = [];
    const rowColumns: string[] = [];

    const workBook = new ExcelJs.Workbook();
    const loadWorkbook = await workBook.xlsx.load(file);

    if (!loadWorkbook) {
      return {
        status: false,
        origin: null,
        created_by: userId,
        message: MessageDialog.__('error.failed.loadFileStream', { type: 'excel' })
      }
    }

    const workSheet = workBook.worksheets[0];

    workSheet.eachRow((rows: any, rowNumber: number) => {
      if (rowNumber === 1) {
        // Headers
        rows.eachCell((_cell: any, colNumber: number) => {
          rowColumns[colNumber - 1] = propHeaders[colNumber - 1].slug;
        })
      }
      else {
        // Row Data
        const objectRaw: I_ObjectRaw = {};
        rows.eachCell((cell: { text: any; }, colNumber: number) => {
          objectRaw[rowColumns[colNumber - 1]] = cell.text
        })

        rowData.push(objectRaw)
      }
    })

    if (rowData?.length <= 0) {
      return {
        status: false,
        origin: rowData,
        created_by: userId,
        message: MessageDialog.__('error.default.emptyDataFile')
      }
    }


    return {
      status: true,
      origin: {
        columns: rowColumns,
        data: rowData,
        today: new Date(standartDateISO()),
        created_by: userId
      },
      created_by: userId,
      message: MessageDialog.__('success.extractFile.read')
    }
  } catch (error: any) {
    return {
      status: false,
      origin: error,
      created_by: userId,
      message: MessageDialog.__('error.failed.readFileStream', { type: 'excel' })
    }
  }
}