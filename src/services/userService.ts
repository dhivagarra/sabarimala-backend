export async function updateUserByUserId(userId: string, data: Partial<UserInput>) {
  // Do not update password here
  await sql.query`
    UPDATE tdbusers SET
      userName = ${data.userName},
      mobilenumber = ${data.mobilenumber},
      email = ${data.email},
      role = ${data.role},
      isActive = ${data.isActive},
      cretedBy = ${data.cretedBy}
    WHERE userId = ${userId}
  `;
  return getUserById(userId);
}
import sql from 'mssql';
import bcrypt from 'bcrypt';

export type UserInput = {
  userId: string;
  password: string;
  userName?: string;
  mobilenumber?: string;
  email?: string;
  role?: string;
  isActive?: string;
  cretedBy?: string;
};

export async function getUserById(userId: string) {
  const result = await sql.query`SELECT * FROM tdbusers WHERE userId = ${userId}`;
  return result.recordset[0];
}

export async function createUser(user: UserInput) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(user.password, saltRounds);
  await sql.query`
    INSERT INTO tdbusers (userId, password_hash, userName, mobilenumber, email, role, isActive, cretedBy)
    VALUES (${user.userId}, ${hashedPassword}, ${user.userName}, ${user.mobilenumber}, ${user.email}, ${user.role}, ${user.isActive}, ${user.cretedBy})
  `;
}

export async function verifyUser(userId: string, password: string) {
  const user = await getUserById(userId);
  if (!user) return false;
  return await bcrypt.compare(password, user.password_hash);
}

export async function getAllUsers() {
  const result = await sql.query`SELECT tbdId, userId, userName, mobilenumber, email, role, isActive, cretedBy, createdDT, modifiedBy, modifiedDT FROM tdbusers`;
  return result.recordset;
}