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
}
