import * as React from 'react';
import { GridColDef, GridRowModel, GridSortItem } from '@mui/x-data-grid';
import { fetchCharactersHook } from '../model/characters';
import { StripedDataGrid } from './StripedDataGrid';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70, sortable: false },
  { field: 'Name', headerName: 'Name', width: 130, sortable: false },
  { field: 'Class', headerName: 'Class', width: 150 },
  { field: 'DKP', headerName: 'DKP', type: 'number', width: 75 },
  { field: 'Thirty', headerName: '30d Attendance', type: 'number', width: 200 },
  { field: 'Sixty', headerName: '60d Attendance', type: 'number', width: 200 },
  { field: 'Ninety', headerName: '90d Attendance', type: 'number', width: 200 },
  { field: 'AllTime', headerName: 'All Time Attendance', type: 'number', width: 200 }
];

const parseRows = (rows: Array<GridRowModel>): Array<GridRowModel> =>
{
    const ret: Array<GridRowModel> = [];
    for (const row of rows)
    {
        if (row.DKP > 0 || row.Thirty > 0 || row.Sixty > 0 || row.Ninety > 0)
        {
            ret.push(row);
        }
    }
    return ret;
}

export function DKPTable() {
  const characters = fetchCharactersHook();
  const [sortModel, setSortModel] = React.useState<Array<GridSortItem>>([
    { field: 'DKP', sort: 'desc' }
  ]);
  return (
    <div style={{ width: '100%' }}>
      <StripedDataGrid
        rows={parseRows(characters ? characters : [])}
        columns={columns}
        sortModel={sortModel}
        onSortModelChange={(model) => setSortModel(model)}
        getRowClassName={(params) => params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'}
        getRowId={(row) => row.Name}
        initialState={{
            columns: {
                columnVisibilityModel: {
                    id: false
                },
            }
        }}
      />
    </div>
  );
}