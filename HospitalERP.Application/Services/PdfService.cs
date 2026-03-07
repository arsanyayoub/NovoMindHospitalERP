using HospitalERP.Domain.Entities;
using HospitalERP.Application.Interfaces;
using HospitalERP.Domain.Enums;
using HospitalERP.Infrastructure.UnitOfWork;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace HospitalERP.Application.Services;

public class PdfService : IPdfService
{
    private readonly IUnitOfWork _uow;

    public PdfService(IUnitOfWork uow)
    {
        _uow = uow;
        QuestPDF.Settings.License = LicenseType.Community;
    }

    public async Task<byte[]> GenerateInvoicePdfAsync(int invoiceId)
    {
        var i = await _uow.Invoices.Query()
            .Include(x => x.Patient)
            .Include(x => x.Customer)
            .Include(x => x.InvoiceItems).ThenInclude(ii => ii.Item)
            .FirstOrDefaultAsync(x => x.Id == invoiceId);

        if (i == null) return null;

        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(1, Unit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(10).FontFamily(Fonts.Arial));

                page.Header().Row(row =>
                {
                    row.RelativeItem().Column(col =>
                    {
                        col.Item().Text("NovoMind Hospital").FontSize(20).SemiBold().FontColor(Colors.Blue.Medium);
                        col.Item().Text("123 Healthcare Blvd, Medical City");
                        col.Item().Text("Phone: +1 234 567 890 | Email: support@novomind.com");
                    });

                    row.RelativeItem().AlignRight().Column(col =>
                    {
                        col.Item().Text("INVOICE").FontSize(24).SemiBold().FontColor(Colors.Grey.Medium);
                        col.Item().Text($"#{i.InvoiceNumber}").FontSize(14);
                        col.Item().Text($"Date: {i.InvoiceDate:d}");
                    });
                });

                page.Content().PaddingVertical(1, Unit.Centimetre).Column(col =>
                {
                    col.Item().Row(row =>
                    {
                        row.RelativeItem().Column(c =>
                        {
                            c.Item().Text("Bill To:").SemiBold();
                            c.Item().Text(i.Patient?.FullName ?? i.Customer?.CustomerName ?? "Walking Customer");
                            c.Item().Text(i.Patient?.Address ?? i.Customer?.Address ?? "-");
                            c.Item().Text(i.Patient?.PhoneNumber ?? i.Customer?.PhoneNumber ?? "-");
                        });
                        row.ConstantItem(50);
                        row.RelativeItem().AlignRight().Column(c =>
                        {
                            c.Item().Text("Payment Status:").SemiBold();
                            c.Item().Text(i.Status.ToString()).FontColor(i.Status == InvoiceStatus.Paid ? Colors.Green.Medium : Colors.Red.Medium);
                        });
                    });

                    col.Item().PaddingTop(10).Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.ConstantColumn(25);
                            columns.RelativeColumn(3);
                            columns.RelativeColumn();
                            columns.RelativeColumn();
                            columns.RelativeColumn();
                        });

                        table.Header(header =>
                        {
                            header.Cell().Element(CellStyle).Text("#");
                            header.Cell().Element(CellStyle).Text("Description");
                            header.Cell().Element(CellStyle).AlignRight().Text("Qty");
                            header.Cell().Element(CellStyle).AlignRight().Text("Price");
                            header.Cell().Element(CellStyle).AlignRight().Text("Total");

                            static IContainer CellStyle(IContainer container) => container.DefaultTextStyle(x => x.SemiBold()).PaddingVertical(5).BorderBottom(1).BorderColor(Colors.Black);
                        });

                        int idx = 1;
                        foreach (var item in i.InvoiceItems)
                        {
                            table.Cell().Element(CellStyle).Text($"{idx++}");
                            table.Cell().Element(CellStyle).Text(item.Item?.ItemName ?? item.Description);
                            table.Cell().Element(CellStyle).AlignRight().Text($"{item.Quantity}");
                            table.Cell().Element(CellStyle).AlignRight().Text($"{item.UnitPrice:C2}");
                            table.Cell().Element(CellStyle).AlignRight().Text($"{item.Total:C2}");

                            static IContainer CellStyle(IContainer container) => container.PaddingVertical(5).BorderBottom(1).BorderColor(Colors.Grey.Lighten2);
                        }
                    });

                    col.Item().AlignRight().PaddingTop(10).Column(c =>
                    {
                        c.Item().Text($"Subtotal: {i.SubTotal:C2}");
                        if (i.TaxAmount > 0) c.Item().Text($"Tax: {i.TaxAmount:C2}");
                        if (i.DiscountAmount > 0) c.Item().Text($"Discount: -{i.DiscountAmount:C2}");
                        c.Item().PaddingTop(5).Text($"Total: {i.TotalAmount:C2}").FontSize(14).SemiBold();
                        c.Item().Text($"Amount Paid: {i.PaidAmount:C2}");
                        c.Item().Text($"Balance Due: {i.BalanceDue:C2}").FontColor(Colors.Red.Medium).Bold();
                    });

                    if (!string.IsNullOrEmpty(i.Notes))
                    {
                        col.Item().PaddingTop(20).Column(c =>
                        {
                            c.Item().Text("Notes:").SemiBold();
                            c.Item().Text(i.Notes);
                        });
                    }
                });

                page.Footer().AlignRight().Text(x =>
                {
                    x.Span("Page ");
                    x.CurrentPageNumber();
                });
            });
        });

        return document.GeneratePdf();
    }
    public async Task<byte[]> GenerateEmrPdfAsync(int patientId, int? admissionId = null)
    {
        var patient = await _uow.Patients.GetByIdAsync(patientId) ?? throw new Exception("Patient not found");

        var encounters = await _uow.ClinicalEncounters.Query()
            .Include(x => x.Doctor)
            .Where(x => x.PatientId == patientId && (!admissionId.HasValue || x.BedAdmissionId == admissionId))
            .OrderByDescending(x => x.EncounterDate)
            .ToListAsync();

        var vitals = await _uow.PatientVitals.Query()
            .Where(x => x.PatientId == patientId && (!admissionId.HasValue || x.BedAdmissionId == admissionId))
            .OrderByDescending(x => x.RecordedDate)
            .ToListAsync();

        var prescriptions = await _uow.Prescriptions.Query()
            .Include(x => x.Doctor)
            .Include(x => x.Items).ThenInclude(i => i.Item)
            .Where(x => x.PatientId == patientId && (!admissionId.HasValue || x.BedAdmissionId == admissionId))
            .OrderByDescending(x => x.PrescriptionDate)
            .ToListAsync();

        var nursingAssessments = admissionId.HasValue 
            ? await _uow.InpatientNursingAssessments.Query()
                .Where(x => x.BedAdmissionId == admissionId)
                .OrderByDescending(x => x.AssessmentDate)
                .ToListAsync()
            : new List<InpatientNursingAssessment>();

        var mar = admissionId.HasValue
            ? await _uow.MedicationAdministrations.Query()
                .Include(x => x.PrescriptionItem).ThenInclude(pi => pi.Item)
                .Where(x => x.BedAdmissionId == admissionId)
                .OrderByDescending(x => x.AdministeredDate)
                .ToListAsync()
            : new List<MedicationAdministration>();

        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(1, Unit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(10).FontFamily(Fonts.Arial));

                page.Header().Row(row =>
                {
                    row.RelativeItem().Column(col =>
                    {
                        col.Item().Text("NovoMind Hospital").FontSize(18).SemiBold().FontColor(Colors.Blue.Medium);
                        col.Item().Text("Electronic Medical Record (EMR) Export").FontSize(14).SemiBold();
                    });

                    row.ConstantItem(100).AlignRight().Column(col =>
                    {
                        col.Item().Text($"Date: {DateTime.Now:d}");
                        col.Item().Text($"Time: {DateTime.Now:t}");
                    });
                });

                page.Content().PaddingVertical(0.5f, Unit.Centimetre).Column(col =>
                {
                    // Patient Info Section
                    col.Item().Background(Colors.Grey.Lighten4).Padding(10).Row(row =>
                    {
                        row.RelativeItem().Column(c =>
                        {
                            c.Item().Text("PATIENT INFORMATION").FontSize(8).SemiBold().FontColor(Colors.Grey.Medium);
                            c.Item().Text(patient.FullName).FontSize(14).Bold();
                            c.Item().Text($"Code: {patient.PatientCode} | Sex: {patient.Gender} | Age: {CalculateAge(patient.DateOfBirth)}");
                        });
                        row.RelativeItem().AlignRight().Column(c =>
                        {
                            c.Item().Text("CONTACT").FontSize(8).SemiBold().FontColor(Colors.Grey.Medium);
                            c.Item().Text(patient.PhoneNumber ?? "-");
                            c.Item().Text(patient.Email ?? "-");
                        });
                    });

                    // 1. Encounters Section
                    if (encounters.Any())
                    {
                        col.Item().PaddingTop(20).Text("CLINICAL ENCOUNTERS").FontSize(12).Bold().Underline();
                        foreach (var e in encounters)
                        {
                            col.Item().PaddingTop(10).Border(0.5f).BorderColor(Colors.Grey.Lighten2).Padding(8).Column(c =>
                            {
                                c.Item().Row(r => {
                                    r.RelativeItem().Text($"Date: {e.EncounterDate:g}").SemiBold();
                                    r.RelativeItem().AlignRight().Text($"Dr. {e.Doctor?.FullName ?? "N/A"}").Italic();
                                });
                                if (!string.IsNullOrEmpty(e.ChiefComplaint)) c.Item().Text(t => { t.Span("Chief Complaint: ").SemiBold(); t.Span(e.ChiefComplaint); });
                                if (!string.IsNullOrEmpty(e.Assessment)) c.Item().Text(t => { t.Span("Assessment/Diagnosis: ").SemiBold(); t.Span(e.Assessment); });
                                if (!string.IsNullOrEmpty(e.Plan)) c.Item().Text(t => { t.Span("Plan: ").SemiBold(); t.Span(e.Plan); });
                            });
                        }
                    }

                    // 2. Vitals Section
                    if (vitals.Any())
                    {
                        col.Item().PaddingTop(20).Text("VITALS HISTORY").FontSize(12).Bold().Underline();
                        col.Item().PaddingTop(5).Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.RelativeColumn();
                                columns.ConstantColumn(40);
                                columns.ConstantColumn(50);
                                columns.ConstantColumn(40);
                                columns.ConstantColumn(40);
                            });
                            table.Header(h => {
                                h.Cell().Text("Date").SemiBold();
                                h.Cell().Text("Temp").SemiBold();
                                h.Cell().Text("BP").SemiBold();
                                h.Cell().Text("HR").SemiBold();
                                h.Cell().Text("SpO2").SemiBold();
                            });
                            foreach (var v in vitals.Take(10)) // Last 10
                            {
                                table.Cell().Text($"{v.RecordedDate:g}");
                                table.Cell().Text($"{v.Temperature}°C");
                                table.Cell().Text($"{v.BloodPressureSystolic}/{v.BloodPressureDiastolic}");
                                table.Cell().Text($"{v.HeartRate}");
                                table.Cell().Text($"{v.SpO2}%");
                            }
                        });
                    }

                    // 3. Prescriptions
                    if (prescriptions.Any())
                    {
                        col.Item().PageBreak();
                        col.Item().PaddingTop(10).Text("MEDICATIONS & PRESCRIPTIONS").FontSize(12).Bold().Underline();
                        foreach (var prx in prescriptions)
                        {
                            col.Item().PaddingTop(10).Column(c =>
                            {
                                c.Item().Text($"Prescription #{prx.PrescriptionNumber} - {prx.PrescriptionDate:d}").SemiBold();
                                foreach (var item in prx.Items)
                                {
                                    c.Item().PaddingLeft(10).Text($"- {item.Item?.ItemName}: {item.Dosage} {item.Frequency} for {item.Duration}");
                                }
                            });
                        }
                    }

                    // 4. Inpatient Data
                    if (admissionId.HasValue)
                    {
                        col.Item().PageBreak();
                        col.Item().PaddingTop(10).Text("INPATIENT CLINICAL RECORD").FontSize(12).Bold().Underline();
                        
                        if (nursingAssessments.Any())
                        {
                            col.Item().PaddingTop(10).Text("Nursing Assessments").SemiBold().FontSize(11);
                            foreach (var na in nursingAssessments)
                            {
                                col.Item().PaddingTop(5).BorderBottom(0.5f).PaddingBottom(5).Column(c => {
                                    c.Item().Text($"{na.AssessmentDate:g} - {na.Shift} Shift (By: {na.RecordedBy})").Italic().FontSize(9);
                                    if (!string.IsNullOrEmpty(na.NursingNotes)) c.Item().Text(na.NursingNotes);
                                    if (!string.IsNullOrEmpty(na.PlanOfCare)) c.Item().Text(t => { t.Span("Plan of Care: ").SemiBold(); t.Span(na.PlanOfCare); });
                                });
                            }
                        }

                        if (mar.Any())
                        {
                            col.Item().PaddingTop(15).Text("Medication Administration Record (MAR)").SemiBold().FontSize(11);
                            col.Item().PaddingTop(5).Table(table => {
                                table.ColumnsDefinition(columns => {
                                    columns.RelativeColumn(2);
                                    columns.RelativeColumn();
                                    columns.RelativeColumn();
                                    columns.RelativeColumn();
                                });
                                table.Header(h => {
                                    h.Cell().Text("Medication").SemiBold();
                                    h.Cell().Text("Administered").SemiBold();
                                    h.Cell().Text("Status").SemiBold();
                                    h.Cell().Text("Nurse").SemiBold();
                                });
                                foreach (var m in mar.Take(20)) {
                                    table.Cell().Text(m.PrescriptionItem?.Item?.ItemName ?? "N/A");
                                    table.Cell().Text($"{m.AdministeredDate:g}");
                                    table.Cell().Text(m.Status);
                                    table.Cell().Text(m.AdministeredBy);
                                }
                            });
                        }
                    }
                });

                page.Footer().AlignCenter().Text(x =>
                {
                    x.Span("Strictly Confidential - NovoMind Hospital EMR System - Page ");
                    x.CurrentPageNumber();
                });
            });
        });

        return document.GeneratePdf();
    }

    public async Task<byte[]> GenerateLabReportPdfAsync(int requestId)
    {
        var r = await _uow.LabRequests.Query()
            .Include(x => x.Patient)
            .Include(x => x.Doctor)
            .Include(x => x.Results).ThenInclude(res => res.LabTest)
            .FirstOrDefaultAsync(x => x.Id == requestId);

        if (r == null) return null!;

        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(1.5f, Unit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(10).FontFamily(Fonts.Arial));

                // Professional Header
                page.Header().Element(headerContainer => ComposeHeader(headerContainer, "LABORATORY REPORT", r.RequestNumber, r.RequestDate));

                page.Content().PaddingVertical(1, Unit.Centimetre).Column(col =>
                {
                    // Patient Box
                    col.Item().Element(box => ComposePatientBox(box, r.Patient, r.Doctor?.FullName, r.CollectionDate));

                    col.Item().PaddingTop(20).Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn(3);
                            columns.RelativeColumn();
                            columns.RelativeColumn();
                            columns.RelativeColumn();
                            columns.RelativeColumn(1.5f);
                        });

                        table.Header(header =>
                        {
                            header.Cell().Element(HeaderStyle).Text("Analysis Name");
                            header.Cell().Element(HeaderStyle).AlignCenter().Text("Result");
                            header.Cell().Element(HeaderStyle).AlignCenter().Text("Flag");
                            header.Cell().Element(HeaderStyle).AlignCenter().Text("Units");
                            header.Cell().Element(HeaderStyle).AlignRight().Text("Reference Range");

                            static IContainer HeaderStyle(IContainer container) => container.DefaultTextStyle(x => x.SemiBold()).PaddingVertical(8).BorderBottom(1).BorderColor(Colors.Blue.Darken4);
                        });

                        foreach (var res in r.Results)
                        {
                            table.Cell().Element(RowStyle).Column(c => {
                                c.Item().Text(res.LabTest.Name).Bold();
                                if (!string.IsNullOrEmpty(res.Remarks)) c.Item().Text(res.Remarks).FontSize(8).Italic().FontColor(Colors.Grey.Medium);
                            });
                            
                            table.Cell().Element(RowStyle).AlignCenter().Text(res.ResultValue ?? "---").Bold();
                            
                            var flagColor = res.ResultFlag switch {
                                "High" => Colors.Red.Medium,
                                "Low" => Colors.Orange.Medium,
                                "Critical" => Colors.Red.Darken4,
                                _ => Colors.Black
                            };
                            
                            var cell = table.Cell().Element(RowStyle).AlignCenter();
                            if (res.IsCritical) cell.Background(Colors.Red.Lighten5);
                            cell.Text(res.ResultFlag ?? "-").FontColor(flagColor).Bold();
                            
                            table.Cell().Element(RowStyle).AlignCenter().Text(res.Unit ?? "");
                            table.Cell().Element(RowStyle).AlignRight().Text(res.NormalRange ?? "");

                            static IContainer RowStyle(IContainer container) => container.PaddingVertical(8).BorderBottom(1).BorderColor(Colors.Grey.Lighten3);
                        }
                    });

                    col.Item().PaddingTop(30).Row(row => {
                        row.RelativeItem().Column(c => {
                            c.Item().Text("Clinician Remarks:").SemiBold().FontSize(9);
                            c.Item().PaddingTop(5).Text(r.Notes ?? "No specific clinical notes provided.").FontSize(9).Italic();
                        });
                    });

                    col.Item().PaddingTop(50).Row(row => {
                        row.RelativeItem().Column(c => {
                            c.Item().PaddingBottom(5).AlignCenter().Text("_________________________").FontSize(10);
                            c.Item().AlignCenter().Text("Medical Lab Technologist").FontSize(9).SemiBold();
                            c.Item().AlignCenter().Text(r.Results.FirstOrDefault()?.PerformedBy ?? "Authorized Signatory").FontSize(8).Italic();
                        });
                        row.ConstantItem(100);
                        row.RelativeItem().Column(c => {
                            c.Item().PaddingBottom(5).AlignCenter().Text("_________________________").FontSize(10);
                            c.Item().AlignCenter().Text("Pathologist / Consultant").FontSize(9).SemiBold();
                            c.Item().AlignCenter().Text("Digitally Verified Report").FontSize(8).Italic();
                        });
                    });
                });

                page.Footer().Element(ComposeFooter);
            });
        });

        return document.GeneratePdf();
    }

    public async Task<byte[]> GenerateRadiologyReportPdfAsync(int requestId)
    {
        var r = await _uow.RadiologyRequests.Query()
            .Include(x => x.Patient)
            .Include(x => x.Doctor)
            .Include(x => x.Results).ThenInclude(res => res.RadiologyTest)
            .FirstOrDefaultAsync(x => x.Id == requestId);

        if (r == null) return null!;

        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(1.5f, Unit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(10).FontFamily(Fonts.Arial));

                page.Header().Element(headerContainer => ComposeHeader(headerContainer, "RADIOLOGY & IMAGING REPORT", r.RequestNumber, r.RequestDate));

                page.Content().PaddingVertical(1, Unit.Centimetre).Column(col =>
                {
                    col.Item().Element(box => ComposePatientBox(box, r.Patient, r.Doctor?.FullName));

                    foreach (var res in r.Results)
                    {
                        col.Item().PaddingTop(25).Column(c =>
                        {
                            c.Item().Background(Colors.Blue.Lighten5).Padding(8).Row(row => {
                                row.RelativeItem().Text($"PROCEDURE: {res.RadiologyTest.Name.ToUpper()}").FontSize(11).Bold().FontColor(Colors.Blue.Darken4);
                                row.RelativeItem().AlignRight().Text($"Date: {res.ResultDate:d}").FontSize(9).Italic();
                            });
                            
                            c.Item().PaddingTop(15).Text("CLINICAL HISTORY / INDICATION").SemiBold().FontSize(9).FontColor(Colors.Grey.Darken2);
                            c.Item().PaddingTop(3).Text(r.Notes ?? "Not provided.").FontSize(10);

                            c.Item().PaddingTop(15).Text("FINDINGS").SemiBold().FontSize(9).FontColor(Colors.Grey.Darken2);
                            c.Item().PaddingTop(5).Text(res.Findings ?? "No structural findings recorded.").LineHeight(1.5f).FontSize(10);

                            c.Item().PaddingTop(20).Border(1).BorderColor(Colors.Grey.Lighten2).Background(Colors.Grey.Lighten5).Padding(10).Column(impCol => {
                                impCol.Item().Text("IMPRESSION").SemiBold().FontSize(9).FontColor(Colors.Blue.Darken4);
                                impCol.Item().PaddingTop(5).Text(res.Impression ?? "No definitive impression.").Bold().LineHeight(1.4f).FontSize(11);
                            });

                            c.Item().PaddingTop(40).AlignRight().Column(sig => {
                                sig.Item().PaddingBottom(5).Text("_________________________");
                                sig.Item().Text($"Dr. {res.RadiologistName ?? "Consultant Radiologist"}").SemiBold();
                                sig.Item().Text("Department of Radiology").FontSize(8);
                                sig.Item().Text($"Report ID: {r.RequestNumber}-{res.Id}").FontSize(7).Italic();
                            });
                        });

                        if (r.Results.Last() != res) col.Item().PageBreak();
                    }
                });

                page.Footer().Element(ComposeFooter);
            });
        });

        return document.GeneratePdf();
    }

    public async Task<byte[]> GenerateInventoryReportPdfAsync(int? warehouseId, string? status)
    {
        var query = _uow.ItemBatches.Query().Include(x => x.Item).Include(x => x.Warehouse).AsQueryable();
        if (warehouseId.HasValue) query = query.Where(x => x.WarehouseId == warehouseId);
        if (!string.IsNullOrEmpty(status)) query = query.Where(x => x.Status == status);
        
        var batches = await query.OrderBy(x => x.ExpiryDate).ToListAsync();
        var whName = warehouseId.HasValue ? batches.FirstOrDefault()?.Warehouse?.WarehouseName ?? "Selected Warehouse" : "All Warehouses";

        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(1, Unit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(10).FontFamily(Fonts.Arial));

                page.Header().Row(row =>
                {
                    row.RelativeItem().Column(col =>
                    {
                        col.Item().Text("NovoMind Hospital").FontSize(18).SemiBold().FontColor(Colors.Blue.Medium);
                        col.Item().Text("Inventory Batch Status Report").FontSize(14).SemiBold();
                        col.Item().Text($"Warehouse: {whName}").FontSize(11).Italic();
                    });
                    row.RelativeItem().AlignRight().Column(col =>
                    {
                        col.Item().Text($"Printed: {DateTime.Now:f}").FontSize(9);
                        col.Item().Text($"Items Count: {batches.Count}").FontSize(9);
                    });
                });

                page.Content().PaddingVertical(0.5f, Unit.Centimetre).Column(col =>
                {
                    col.Item().Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn(2);
                            columns.RelativeColumn();
                            columns.RelativeColumn();
                            columns.RelativeColumn();
                            columns.RelativeColumn();
                        });

                        table.Header(header =>
                        {
                            header.Cell().Element(CellStyle).Text("Item Name");
                            header.Cell().Element(CellStyle).Text("Batch #");
                            header.Cell().Element(CellStyle).AlignCenter().Text("Expiry Date");
                            header.Cell().Element(CellStyle).AlignCenter().Text("Qty");
                            header.Cell().Element(CellStyle).AlignRight().Text("Status");

                            static IContainer CellStyle(IContainer container) => container.DefaultTextStyle(x => x.SemiBold()).PaddingVertical(5).BorderBottom(1).BorderColor(Colors.Black);
                        });

                        foreach (var b in batches)
                        {
                            table.Cell().Element(RowStyle).Text(b.Item?.ItemName ?? "N/A");
                            table.Cell().Element(RowStyle).Text(b.BatchNumber);
                            table.Cell().Element(RowStyle).AlignCenter().Text($"{b.ExpiryDate:d}");
                            table.Cell().Element(RowStyle).AlignCenter().Text($"{b.QuantityRemaining}");
                            
                            var statusColor = b.Status == "Active" && b.ExpiryDate > DateTime.UtcNow.AddDays(30) ? Colors.Green.Medium : 
                                              b.ExpiryDate <= DateTime.UtcNow ? Colors.Red.Medium : Colors.Orange.Medium;
                            
                            table.Cell().Element(RowStyle).AlignRight().Text(b.Status).FontColor(statusColor).Bold();

                            static IContainer RowStyle(IContainer container) => container.PaddingVertical(5).BorderBottom(1).BorderColor(Colors.Grey.Lighten3);
                        }
                    });
                });

                page.Footer().AlignCenter().Text(x =>
                {
                    x.Span("NovoMind Inventory Management System - Page ");
                    x.CurrentPageNumber();
                });
            });
        });

        return document.GeneratePdf();
    }

    private void ComposeHeader(IContainer container, string title, string refNo, DateTime date)
    {
        container.Row(row =>
        {
            row.RelativeItem().Column(col =>
            {
                col.Item().Text("NOVOMIND").FontSize(22).ExtraBold().FontColor(Colors.Blue.Darken4).LetterSpacing(0.05f);
                col.Item().Text("HEALTHCARE & DIAGNOSTICS").FontSize(9).SemiBold().FontColor(Colors.Grey.Darken1).LetterSpacing(0.1f);
                col.Item().PaddingTop(5).Text("123 Medical Avenue, Tech City, 54000").FontSize(8);
                col.Item().Text("Tel: +1 800-NOVOMIND | Email: lab@novomind.com").FontSize(8);
            });

            row.RelativeItem().AlignRight().Column(col =>
            {
                col.Item().Background(Colors.Blue.Darken4).PaddingHorizontal(10).PaddingVertical(5).Text(title).FontSize(14).SemiBold().FontColor(Colors.White);
                col.Item().PaddingTop(10).Text(t => {
                    t.Span("Report Ref: ").FontSize(9).SemiBold();
                    t.Span(refNo).FontSize(10).Bold();
                });
                col.Item().Text(t => {
                    t.Span("Date: ").FontSize(9).SemiBold();
                    t.Span($"{date:f}").FontSize(9);
                });
            });
        });
    }


    private void ComposePatientBox(IContainer container, Patient p, string? doctorName, DateTime? collectionDate = null)
    {
        container.Border(1).BorderColor(Colors.Blue.Medium).Row(row =>
        {
            row.RelativeItem().Padding(10).Column(c =>
            {
                c.Item().Text("PATIENT DETAILS").FontSize(8).SemiBold().FontColor(Colors.Blue.Darken2);
                c.Item().PaddingTop(2).Text(p.FullName).FontSize(13).Bold();
                c.Item().Text($"Patient ID: {p.PatientCode} | Gender: {p.Gender}").FontSize(9);
                c.Item().Text($"Age: {CalculateAge(p.DateOfBirth)} Years | DOB: {p.DateOfBirth:d}").FontSize(9);
            });

            row.ConstantItem(1).Background(Colors.Blue.Medium);

            row.RelativeItem().Padding(10).Column(c =>
            {
                c.Item().Text("REFERRAL & SPECIMEN").FontSize(8).SemiBold().FontColor(Colors.Blue.Darken2);
                c.Item().PaddingTop(2).Text($"Dr. {doctorName ?? "General Practitioner"}").FontSize(11).Medium();
                c.Item().Text("NovoMind Medical Center").FontSize(9);
                c.Item().PaddingTop(5).Row(r => {
                    r.RelativeItem().Text("Collected:").FontSize(8).SemiBold();
                    r.RelativeItem().AlignRight().Text(collectionDate.HasValue ? $"{collectionDate:g}" : "N/A").FontSize(8);
                });
            });
        });
    }

    private void ComposeFooter(IContainer container)
    {
        container.Column(col => {
            col.Item().BorderTop(1).BorderColor(Colors.Grey.Lighten2).PaddingTop(5).Row(row =>
            {
                row.RelativeItem().Text(t => {
                    t.Span("Confidentiality Notice: ").SemiBold();
                    t.Span("This report is for the intended recipient and their healthcare provider only.").FontSize(8).FontColor(Colors.Grey.Medium);
                });
                
                row.RelativeItem().AlignRight().Text(x =>
                {
                    x.Span("Page ");
                    x.CurrentPageNumber();
                    x.Span(" of ");
                    x.TotalPages();
                });
            });
            col.Item().AlignCenter().Text("NovoMind Enterprise ERP System - Digitally Generated Report & Verification").FontSize(7).Italic().FontColor(Colors.Grey.Lighten1);
        });
    }

    private int CalculateAge(DateTime dob)
    {
        var today = DateTime.Today;
        var age = today.Year - dob.Year;
        if (dob.Date > today.AddYears(-age)) age--;
        return age;
    }
}
