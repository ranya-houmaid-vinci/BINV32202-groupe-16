import type { Application, ApplicationDbo, ApplicationDto } from "../models/application.ts";

export const toApplication = (dbo: ApplicationDbo): Application => ({
  id: dbo.id,
  offer: {
    id: dbo.offer_id,
    title: dbo.offer_title,
    companyShortName: dbo.company_short_name,
    academicYear: dbo.academic_year_label,
    period: dbo.period_code,
  },
  studentId: dbo.student_id,
  message: dbo.message,
  status: dbo.status,
  appliedAt: dbo.applied_at,
});

export const toApplicationDto = (application: Application): ApplicationDto => ({
  id: application.id,
  offer: application.offer,
  message: application.message,
  status: application.status,
  appliedAt: application.appliedAt,
});
