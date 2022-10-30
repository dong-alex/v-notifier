interface SheetData {
  properties: {
      hidden: boolean;
      title: string;
  }
}

type SheetName = string;
type SheetNames = Array<SheetName>

const templateSpreadsheets = new Set([
  'Fall Schedule',
  'Contacts and Info',
  '"Template" MM/DD/YY',
])

export const convertSheetNames = (data: SheetData[]): SheetNames => {
  const results: SheetNames = [];

  if (!data || data?.length < 1) {
    return [];
  }

  data.forEach((sheet: SheetData) => {
    const { properties: { hidden, title } } = sheet;

    if (hidden || templateSpreadsheets.has(title)) {
      return;
    }

    results.push(title);
  });

  return results;
};