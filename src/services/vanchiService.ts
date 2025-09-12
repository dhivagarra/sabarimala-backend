import sql from 'mssql';
import { v4 as uuidv4 } from 'uuid';

export type VanchiInput = {
  tbdId?: string;
  vanchiCode: string;
  vanchiName: string;
  vanchiNumber: string;
  comments?: string;
  createdBy?: string;
  // createAt is handled by SQL default
  modifiedBy?: string;
  // modifiedDT is handled by SQL default or on update
  isActive?: string;
};

export async function createVanchi(data: VanchiInput) {
  const tbdId = uuidv4();
  await sql.query`
    INSERT INTO tdbVanchi (tbdId, vanchiCode, vanchiName, vanchiNumber, comments, createdBy, isActive)
    VALUES (
      ${tbdId}, ${data.vanchiCode}, ${data.vanchiName}, ${data.vanchiNumber},
      ${data.comments}, ${data.createdBy}, ${data.isActive}
    )
  `;
  return getVanchiById(tbdId);
}

export async function getAllVanchi() {
  const result = await sql.query`SELECT * FROM tdbVanchi ORDER BY vanchiSno ASC`;
  return result.recordset;
}

export async function getVanchiById(tbdId: string) {
  const result = await sql.query`SELECT * FROM tdbVanchi WHERE tbdId = ${tbdId}`;
  return result.recordset[0];
}

export async function updateVanchi(tbdId: string, data: Partial<VanchiInput>) {
  await sql.query`
    UPDATE tdbVanchi SET
      vanchiCode = ${data.vanchiCode},
      vanchiName = ${data.vanchiName},
      vanchiNumber = ${data.vanchiNumber},
      comments = ${data.comments},
      modifiedBy = ${data.modifiedBy},
      modifiedDT = GETDATE(),
      isActive = ${data.isActive}
    WHERE tbdId = ${tbdId}
  `;
  return getVanchiById(tbdId);
}

export async function deleteVanchi(tbdId: string) {
  await sql.query`DELETE FROM tdbVanchi WHERE tbdId = ${tbdId}`;
}
