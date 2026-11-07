import type { Db } from "../db/database.ts";
import type { ApplicationDbo } from "../models/application.ts";

export const createApplicationsRepository = (db: Db) => {
  const findByStudent = db.prepare<{ studentId: number }, ApplicationDbo>(`
    SELECT a.id, a.offer_id, o.title AS offer_title, c.short_name AS company_short_name,
           ay.label AS academic_year_label, p.code AS period_code,
           a.student_id, a.message, a.status, a.applied_at
    FROM applications a
    JOIN offers o ON o.id = a.offer_id
    JOIN companies c ON c.id = o.company_id
    JOIN academic_years ay ON ay.id = o.academic_year_id
    JOIN periods p ON p.id = o.period_id
    WHERE a.student_id = @studentId
    ORDER BY a.applied_at DESC, a.id DESC
  `);

  const findByStudentAndOffer = db.prepare<
    { studentId: number; offerId: number },
    ApplicationDbo
  >(
    "SELECT a.id, a.offer_id, o.title AS offer_title, c.short_name AS company_short_name, " +
      "ay.label AS academic_year_label, p.code AS period_code, a.student_id, a.message, " +
      "a.status, a.applied_at FROM applications a " +
      "JOIN offers o ON o.id = a.offer_id JOIN companies c ON c.id = o.company_id " +
      "JOIN academic_years ay ON ay.id = o.academic_year_id JOIN periods p ON p.id = o.period_id " +
      "WHERE a.student_id = @studentId AND a.offer_id = @offerId " +
      "AND a.status <> 'WITHDRAWN' LIMIT 1",
  );

  const findByIdAndStudent = db.prepare<
    { id: number; studentId: number },
    ApplicationDbo
  >(
    "SELECT a.id, a.offer_id, o.title AS offer_title, c.short_name AS company_short_name, " +
      "ay.label AS academic_year_label, p.code AS period_code, a.student_id, a.message, " +
      "a.status, a.applied_at FROM applications a " +
      "JOIN offers o ON o.id = a.offer_id JOIN companies c ON c.id = o.company_id " +
      "JOIN academic_years ay ON ay.id = o.academic_year_id JOIN periods p ON p.id = o.period_id " +
      "WHERE a.id = @id AND a.student_id = @studentId",
  );

  const insert = db.prepare<{ offerId: number; studentId: number; message: string | null }>(
    "INSERT INTO applications (offer_id, student_id, message) VALUES (@offerId, @studentId, @message)",
  );
  const withdraw = db.prepare<{ id: number; studentId: number }>(
    "UPDATE applications SET status = 'WITHDRAWN' WHERE id = @id AND student_id = @studentId",
  );

  return {
    findByStudent: (studentId: number): ApplicationDbo[] => findByStudent.all({ studentId }),
    findActiveByStudentAndOffer: (studentId: number, offerId: number): ApplicationDbo | undefined =>
      findByStudentAndOffer.get({ studentId, offerId }),
    findByIdAndStudent: (id: number, studentId: number): ApplicationDbo | undefined =>
      findByIdAndStudent.get({ id, studentId }),
    insert: (offerId: number, studentId: number, message: string | null): void => {
      insert.run({ offerId, studentId, message });
    },
    withdraw: (id: number, studentId: number): void => {
      withdraw.run({ id, studentId });
    },
  };
};

export type ApplicationsRepository = ReturnType<typeof createApplicationsRepository>;
