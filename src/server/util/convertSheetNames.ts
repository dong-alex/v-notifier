interface SheetData {
  properties: {
    sheetId: string;
    hidden: boolean;
    title: string;
  };
}

const templateSpreadsheets = new Set([
  "Fall Schedule",
  "Contacts and Info",
  '"Template" MM/DD/YY',
]);

export const convertSheetNames = (data: SheetData[]) => {
  const results: any[] = [];

  if (!data || data?.length < 1) {
    return [];
  }

  data.forEach((sheet: SheetData) => {
    const {
      properties: { hidden, title, sheetId },
    } = sheet;

    if (hidden || templateSpreadsheets.has(title)) {
      return;
    }

    results.push({
      title,
      sheetId: String(sheetId),
    });
  });

  return results;
};
