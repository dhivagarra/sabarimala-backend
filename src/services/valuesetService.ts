import sql from 'mssql';
import { v4 as uuidv4 } from 'uuid';

export type ValuesetInput = {
  tbdId?: string;
  orgCode?: string;
  orgName?: string;
  categoryCode?: string;
  categoryNameEn?: string;
  categoryNameMl?: string;
  parameterCode?: string;
  parameterNameEn?: string;
  parameterNameMl?: string;
  valuesetCode?: string;
  valuesetNameEn?: string;
  valuesetNameMl?: string;
  valuesetOrder?: number;
  isActive?: string;
  createdBy?: string;
  createdDT?: string;
  modifiedBy?: string;
  modifiedDT?: string;
};

export async function createValueset(data: ValuesetInput) {
  const tbdId = uuidv4();
  await sql.query`
    INSERT INTO tdbValueset (
      tbdId, orgCode, orgName, categoryCode, categoryNameEn, categoryNameMl,
      parameterCode, parameterNameEn, parameterNameMl, valuesetCode, valuesetNameEn, valuesetNameMl,
      valuesetOrder, isActive, createdBy
    ) VALUES (
      ${tbdId}, ${data.orgCode}, ${data.orgName}, ${data.categoryCode}, ${data.categoryNameEn}, ${data.categoryNameMl},
      ${data.parameterCode}, ${data.parameterNameEn}, ${data.parameterNameMl}, ${data.valuesetCode}, ${data.valuesetNameEn}, ${data.valuesetNameMl},
      ${data.valuesetOrder}, ${data.isActive ?? 'Y'}, ${data.createdBy}
    )
  `;
  return getValuesetById(tbdId);
}

export async function getAllValuesets() {
  const result = await sql.query`SELECT * FROM tdbValueset ORDER BY valuesetOrder ASC, valuesetNameEn ASC`;
  return result.recordset;
}

export async function getValuesetById(tbdId: string) {
  const result = await sql.query`SELECT * FROM tdbValueset WHERE tbdId = ${tbdId}`;
  return result.recordset[0];
}

export async function updateValueset(tbdId: string, data: Partial<ValuesetInput>) {
  await sql.query`
    UPDATE tdbValueset SET
      orgCode = ${data.orgCode},
      orgName = ${data.orgName},
      categoryCode = ${data.categoryCode},
      categoryNameEn = ${data.categoryNameEn},
      categoryNameMl = ${data.categoryNameMl},
      parameterCode = ${data.parameterCode},
      parameterNameEn = ${data.parameterNameEn},
      parameterNameMl = ${data.parameterNameMl},
      valuesetCode = ${data.valuesetCode},
      valuesetNameEn = ${data.valuesetNameEn},
      valuesetNameMl = ${data.valuesetNameMl},
      valuesetOrder = ${data.valuesetOrder},
      isActive = ${data.isActive},
      modifiedBy = ${data.modifiedBy},
      modifiedDT = GETDATE()
    WHERE tbdId = ${tbdId}
  `;
  return getValuesetById(tbdId);
}

export async function deleteValueset(tbdId: string) {
  await sql.query`DELETE FROM tdbValueset WHERE tbdId = ${tbdId}`;
}
