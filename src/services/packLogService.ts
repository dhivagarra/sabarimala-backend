// Get pack log by transNo
export async function getPackLogByTransNo(transNo: string) {
  const result = await sql.query`SELECT * FROM tdbPackLog WHERE transNo = ${transNo}`;
  return result.recordset;
}

// Update pack log by transNo (updates all records with that transNo)
export async function updatePackLogByTransNo(transNo: string, data: Partial<PackLogInput>) {

  // Helper to format any date string to 'YYYY-MM-DD HH:mm:ss' (no timezone)
  function toSqlDateTime(val: any) {
    if (!val) return null;
    const d = new Date(val);
    if (isNaN(d.getTime())) return val; // fallback: return as is
    const pad = (n: number) => n < 10 ? '0' + n : n;
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  const sealDT = toSqlDateTime(data.sealDT);
  const receDT = toSqlDateTime(data.receDT);
  const createAt = toSqlDateTime(data.createAt);

  await sql.query`
    UPDATE tdbPackLog SET
      sealDT = ${sealDT},
      nada = ${data.nada},
      vanchi = ${data.vanchi},
      vanchiNo = ${data.vanchiNo},
      bagno = ${data.bagno},
      sealBy = ${data.sealBy},
      receDT = ${receDT},
      receBy = ${data.receBy},
      packStatus = ${data.packStatus},
      comments = ${data.comments},
      createdBy = ${data.createdBy},
      createAt = ${createAt},
      isActive = ${data.isActive}
    WHERE transNo = ${transNo}
  `;
  return getPackLogByTransNo(transNo);
}

// Delete pack log by transNo (deletes all records with that transNo)
export async function deletePackLogByTransNo(transNo: string) {
  await sql.query`DELETE FROM tdbPackLog WHERE transNo = ${transNo}`;
}
import sql from 'mssql';
import { v4 as uuidv4 } from 'uuid';

export type PackLogInput = {
  sealDT: string;
  transNo: string;
  nada: string;
  vanchi: string;
  vanchiNo: string;
  bagno: string;
  sealBy: string;
  receDT?: string;
  receBy?: string;
  packStatus: string;
  comments?: string;
  createdBy?: string;
  createAt: string;
  isActive: string;
};

export async function createPackLog(data: PackLogInput) {
  const packid = uuidv4();
  await sql.query`
    INSERT INTO tdbPackLog (packid, sealDT, transNo, nada, vanchi, vanchiNo, bagno, sealBy, receDT, receBy, packStatus, comments, createdBy, createAt, isActive)
    VALUES (${packid}, ${data.sealDT}, ${data.transNo}, ${data.nada}, ${data.vanchi}, ${data.vanchiNo}, ${data.bagno}, ${data.sealBy}, ${data.receDT}, ${data.receBy}, ${data.packStatus}, ${data.comments}, ${data.createdBy}, ${data.createAt}, ${data.isActive})
  `;
  return { packid, ...data };
}

export async function getAllPackLogs() {
  const result = await sql.query`SELECT [packid]  ,[packSno]  ,FORMAT([sealDT],'dd-MM-yyyy HH:mm:ss') as [sealDT] ,[transNo]  ,[nada]  ,[vanchi]
  ,[bagno]  ,[sealBy]  ,FORMAT([receDT],'dd-MM-yyyy HH:mm:ss') as [receDT]  ,[receBy]  ,[packStatus]  ,[comments]
  ,[createdBy]  ,FORMAT([createAt],'dd-MM-yyyy HH:mm:ss') as [createAt]  ,[isActive]  ,[vanchiNo]
  FROM [dbo].[tdbPackLog] order by packSno desc`;
  return result.recordset;
}

export async function getPackLogById(packid: string) {
  const result = await sql.query`SELECT * FROM tdbPackLog WHERE packid = ${packid}`;
  return result.recordset[0];
}

export async function updatePackLog(packid: string, data: Partial<PackLogInput>) {
  await sql.query`
    UPDATE tdbPackLog SET
      sealDT = ${data.sealDT},
      transNo = ${data.transNo},
      nada = ${data.nada},
      vanchi = ${data.vanchi},
      vanchiNo = ${data.vanchiNo},
      bagno = ${data.bagno},
      sealBy = ${data.sealBy},
      receDT = ${data.receDT},
      receBy = ${data.receBy},
      packStatus = ${data.packStatus},
      comments = ${data.comments},
      createdBy = ${data.createdBy},
      createAt = ${data.createAt},
      isActive = ${data.isActive}
    WHERE packid = ${packid}
  `;
  return getPackLogById(packid);
}

export async function deletePackLog(packid: string) {
  await sql.query`DELETE FROM tdbPackLog WHERE packid = ${packid}`;
}
