import * as React from 'react';
import { AlertProps, Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar, Alert, Box, Checkbox } from '@mui/material';
import { GridColDef, GridSortItem, GridRowModel, useGridApiContext, GridRenderCellParams, GridRowId } from '@mui/x-data-grid';
import { StripedDataGrid } from './StripedDataGrid';
import { AuthContext } from '../lib/firebase';
import { IdTokenResult } from 'firebase/auth';
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/utils';
import { Key } from '../model/expansions';
import { Character } from '../model/characters';
import multiColumnSort from 'multi-column-sort';

function ToggleEditInputCell(props: GridRenderCellParams<any, boolean>) {
  const { id, value, field, hasFocus } = props;
  const apiRef = useGridApiContext();
  const ref = React.useRef<HTMLElement>();

  const handleChange = (event: React.SyntheticEvent, newValue: boolean | null) => {
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  };

  useEnhancedEffect(() => {
    if (hasFocus && ref.current) {
      const input = ref.current.querySelector<HTMLInputElement>(
        `input[value="${value}"]`,
      );
      input?.focus();
    }
  }, [hasFocus, value]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', pr: 2 }}>
      <Checkbox
        value={value}
        checked={value}
        onChange={handleChange}
      />
    </Box>
  );
}

const renderCheckboxInputCell: GridColDef['renderCell'] = (params) => {
    return <ToggleEditInputCell {...params} />;
};

function renderCheckboxCell(params: GridRenderCellParams<any, boolean>) {
    return <Checkbox disabled value={params.value} checked={params.value} />;
}

interface KeyTableProps {
    expansionKey: Key;
    characters: Array<Character>;
    updateHandler: (key: Key) => void;
}

export function KeyTable(props: KeyTableProps) {
    const [snackbar, setSnackbar] = React.useState<Pick<
        AlertProps,
        'children' | 'severity'
        > | null>(null);
    const [promiseArguments, setPromiseArguments] = React.useState<any>(null);
    const { user, token } = React.useContext(AuthContext);
    const [sortModel, setSortModel] = React.useState<Array<GridSortItem>>([{ field: 'NinetyW', sort: 'desc' }]);
    const [data, setData] = React.useState<any>(null);


    function computeMutation(newRow: GridRowModel, oldRow: GridRowModel) {
        if (newRow.main !== oldRow.box) {
            return `Main from '${oldRow.main}' to '${newRow.main}'`;
        }
        if (newRow.box !== oldRow.box) {
            return `Box from '${oldRow.box}' to '${newRow.box}'`;
        }
        return null;
    }
    
    const processRowUpdate = React.useCallback(
        (newRow: GridRowModel, oldRow: GridRowModel) =>
          new Promise<GridRowModel>((resolve, reject) => {
            const mutation = computeMutation(newRow, oldRow);
            if (mutation) {
              // Save the arguments to resolve or reject the promise later
              setPromiseArguments({ resolve, reject, newRow, oldRow });
            } else {
              resolve(oldRow); // Nothing was changed
            }
          }),
        [],
    );
    
    const handleNo = () => {
        const { oldRow, resolve } = promiseArguments;
        resolve(oldRow); // Resolve with the old row to not update the internal state
        setPromiseArguments(null);
    };
    
    const handleYes = async () => {
        const { newRow, oldRow, reject, resolve } = promiseArguments;
        try {
            let found = false;
            for (const character of props.expansionKey.charactersWithKey) {
                if (character.name === newRow.Name)
                {
                    found = true;
                    character.keys = { main: newRow.main, box: newRow.box };
                }
            }
            if (!found) {
                props.expansionKey.charactersWithKey.push({ name: newRow.Name, keys: { main: newRow.main, box: newRow.box } });
            }
            props.updateHandler(props.expansionKey);
            setSnackbar({ children: 'Character keys successfully saved', severity: 'success' });
            resolve(newRow);
            setPromiseArguments(null);
        } catch (error) {
            setSnackbar({ children: `${error}`, severity: 'error' });
            reject(oldRow);
            setPromiseArguments(null);
        }
    };

    const handleCloseSnackbar = () => setSnackbar(null);
    
    const handleEntered = () => {
        // The `autoFocus` is not used because, if used, the same Enter that saves
        // the cell triggers "No". Instead, we manually focus the "No" button once
        // the dialog is fully open.
        // noButtonRef.current?.focus();
    };
    
    const renderConfirmDialog = () => {
        if (!promiseArguments) {
          return null;
        }
    
        const { newRow, oldRow } = promiseArguments;
        const mutation = computeMutation(newRow, oldRow);
    
        return (
          <Dialog
            maxWidth="xs"
            TransitionProps={{ onEntered: handleEntered }}
            open={!!promiseArguments}
          >
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogContent dividers>
              {`Pressing 'Yes' will change ${mutation}.`}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleNo}>No</Button>
              <Button onClick={handleYes}>Yes</Button>
            </DialogActions>
          </Dialog>
        );
    };

    const parseData = (characters: Array<Character>) => {
        const ret: Array<GridRowModel> = [];
        const charNameToKeysMap: Map<string, { main: boolean, box: boolean }> = new Map();
        let localCharacters: Array<Character & {thirtyw: number, sixtyw: number, ninetyw: number}> = characters as Array<Character & {thirtyw: number, sixtyw: number, ninetyw: number}>;

        localCharacters = multiColumnSort(localCharacters, { Ninety: 'ASC', AllTime: 'ASC'});
        let iter = localCharacters.length;
        for (iter; iter > 0; iter = iter - 1)
        {
            localCharacters[iter-1].ninetyw = iter;
        }
        iter = localCharacters.length;
        localCharacters = multiColumnSort(localCharacters, { Sixty: 'ASC', AllTime: 'ASC'});
        for (iter; iter > 0; iter = iter - 1)
        {
            localCharacters[iter-1].sixtyw = iter;
        }
        iter = localCharacters.length;
        localCharacters = multiColumnSort(localCharacters, { Thirty: 'ASC', AllTime: 'ASC'});
        for (iter; iter > 0; iter = iter - 1)
        {
            localCharacters[iter-1].thirtyw = iter;
        }

        for (const character of props.expansionKey.charactersWithKey)
        {
            charNameToKeysMap.set(character.name, character.keys);
        }
        for (const character of localCharacters)
        {
            if (character.Thirty !== 0 || character.Sixty !== 0 || character.Ninety !== 0)
            {
                const row: GridRowModel = {};
                row['Name'] = character.Name;
                const charKeys = charNameToKeysMap.get(character.Name);
                if (charKeys) {
                    row['main'] = charKeys.main;
                    row['box'] = charKeys.box;
                } else {
                    row['main'] = false;
                    row['box'] = false;    
                }
                row['Thirty'] = character.Thirty;
                row['ThirtyW'] = character.thirtyw;
                row['Sixty'] = character.Sixty;
                row['SixtyW'] = character.sixtyw;
                row['Ninety'] = character.Ninety;
                row['NinetyW'] = character.ninetyw;
                row['AllTime'] = character.AllTime;
                ret.push(row);
            }
        }
        return ret;
    };

    const parseColumns = () => {
        const ret: Array<GridColDef> = [];
        ret.push({ field: 'Name', headerName: 'Character Name', sortable: false, width: 165 });
        ret.push({ field: `main`, headerName: `Main`, sortable: false, editable: (token as IdTokenResult)?.claims.Admin === true, width: 75, renderCell: renderCheckboxCell, renderEditCell: renderCheckboxInputCell });
        ret.push({ field: `box`, headerName: `Box`, sortable: false, editable: (token as IdTokenResult)?.claims.Admin === true, width: 450, renderCell: renderCheckboxCell, renderEditCell: renderCheckboxInputCell });
        ret.push({ field: 'Thirty', headerName: '30d', type: 'number', width: 75, description: '30d Attendance not sorted by All Time' });
        ret.push({ field: 'ThirtyW', headerName: '30d', type: 'number', width: 75, description: '30d Attendance sorted by All Time to break ties', valueFormatter: ({id, api}) => { return api.getRow(id as GridRowId).Thirty; } });
        ret.push({ field: 'Sixty', headerName: '60d', type: 'number', width: 75, description: '60d Attendance not sorted by All Time' });
        ret.push({ field: 'SixtyW', headerName: '60d', type: 'number', width: 75, description: '60d Attendance sorted by All Time to break ties',  valueFormatter: ({id, api}) => { return api.getRow(id as GridRowId).Sixty; } });
        ret.push({ field: 'Ninety', headerName: '90d', type: 'number', width: 75, description: '90d Attendance not sorted by All Time' });
        ret.push({ field: 'NinetyW', headerName: '90d', type: 'number', width: 75, description: '90d Attendance sorted by All Time to break ties',  valueFormatter: ({id, api}) => { return api.getRow(id as GridRowId).Ninety; } });
        ret.push({ field: 'AllTime', headerName: 'All', type: 'number', width: 75 });
        return ret;
    };

    return (
        <Box>
            {renderConfirmDialog()}
            { (props.characters && props.expansionKey) &&
            <StripedDataGrid
                sx={{maxWidth: 1070}}
                columnBuffer={2}
                columnThreshold={2}
                rowBuffer={100}
                rows={parseData(props.characters)}
                getRowId={(row) => row.Name}
                columns={parseColumns()}
                sortModel={sortModel}
                onSortModelChange={(model) => setSortModel(model)}
                getRowClassName={(params) => params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'}
                processRowUpdate={processRowUpdate}
                columnVisibilityModel={{
                    Thirty: false,
                    Sixty: false,
                    Ninety: false
                }}
            />
            }
            {!!snackbar && (
                <Snackbar open onClose={handleCloseSnackbar} autoHideDuration={6000}>
                <Alert {...snackbar} onClose={handleCloseSnackbar} />
                </Snackbar>
            )}
        </Box>
    );
}