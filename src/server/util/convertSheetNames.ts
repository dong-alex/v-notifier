interface SheetData {
  properties: {
    sheetId: string;
    hidden: boolean;
    title: string;
  };
}

type Sheet = {
  sheetId: string;
  title: string;
};

const templateSpreadsheets = new Set([
  "2022-2023 Schedule",
  "Contacts and Info",
  '"Template" MM/DD/YY',
]);

export const convertSheetNames = (data: SheetData[]) => {
  const results: Sheet[] = [];

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
