export type CreateSheetResult = {
  spreadsheetId: string
  spreadsheetName: string
  spreadsheetUrl: string
}

type CreateSpreadsheetResponse = {
  spreadsheetId: string
  spreadsheetUrl: string
  properties: {
    title: string
  }
}

const buildSheetName = (): string => {
  const iso = new Date().toISOString().slice(0, 10)
  return `ShopFlow Data ${iso}`
}

const createSpreadsheet = async (
  accessToken: string,
): Promise<CreateSpreadsheetResponse> => {
  const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: { title: buildSheetName() },
      sheets: [
        { properties: { title: 'items' } },
        { properties: { title: 'categories' } },
      ],
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Failed to create spreadsheet: ${errorBody}`)
  }

  return (await response.json()) as CreateSpreadsheetResponse
}

const initializeHeaders = async (
  accessToken: string,
  spreadsheetId: string,
): Promise<void> => {
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        valueInputOption: 'RAW',
        data: [
          {
            range: 'items!A1:H1',
            values: [
              [
                'id',
                'item_name',
                'category_id',
                'default_quantity',
                'unit',
                'is_active',
                'created_at',
                'updated_at',
              ],
            ],
          },
          {
            range: 'categories!A1:D1',
            values: [['id', 'name', 'created_at', 'updated_at']],
          },
        ],
      }),
    },
  )

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Failed to initialize sheet headers: ${errorBody}`)
  }
}

export const createItemsSchemaSpreadsheet = async (
  accessToken: string,
): Promise<CreateSheetResult> => {
  const spreadsheet = await createSpreadsheet(accessToken)
  await initializeHeaders(accessToken, spreadsheet.spreadsheetId)

  return {
    spreadsheetId: spreadsheet.spreadsheetId,
    spreadsheetName: spreadsheet.properties.title,
    spreadsheetUrl: spreadsheet.spreadsheetUrl,
  }
}
