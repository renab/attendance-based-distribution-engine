import * as React from 'react';
import { Container, Card, AlertProps, Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar, Alert, Rating, Box, Switch } from '@mui/material';
import { GridColDef, GridSortItem, GridRowModel, useGridApiContext, GridRenderCellParams } from '@mui/x-data-grid';
import Grid from '@mui/material/Unstable_Grid2';
import AdminSidebar from './components/sidebar';
import { StripedDataGrid } from '../../components/StripedDataGrid';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import { fetchUsersHook, updateUserClaims } from './hooks/user.hooks';
import { AuthContext } from '../../lib/firebase';
import { User } from 'firebase/auth';
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/utils';

function parseUsers(users: Array<UserRecord>): Array<GridRowModel>
{
    const ret = [];
    for (const user of users)
    {
        ret.push({
            uid: user.uid,
            email: user.email ? user.email : '',
            admin: ((user.customClaims?.Admin ? user.customClaims.Admin : false) as boolean),
            superAdmin: ((user.customClaims?.SuperAdmin ? user.customClaims.SuperAdmin : false) as boolean)
        });
    }
    return ret;
}

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
      <Switch
        value={value}
        checked={value}
        onChange={handleChange}
      />
    </Box>
  );
}

const renderToggleInputCell: GridColDef['renderCell'] = (params) => {
    return <ToggleEditInputCell {...params} />;
};

function renderToggle(params: GridRenderCellParams<any, boolean>) {
    return <Switch readOnly value={params.value} checked={params.value} />;
}

const columns: Array<GridColDef> = [
    { field: 'uid', headerName: 'ID', sortable: false, width: 260 },
    { field: 'email', headerName: 'Email', width: 350 },
    { field: 'admin', headerName: 'Is Admin?', sortable: false, width: 200, editable: true, renderCell: renderToggle, renderEditCell: renderToggleInputCell },
    { field: 'superAdmin', headerName: 'Is Super Admin?', sortable: false, width: 200, editable: true, renderCell: renderToggle, renderEditCell: renderToggleInputCell }
];

export function UserManagement() {
    const [snackbar, setSnackbar] = React.useState<Pick<
        AlertProps,
        'children' | 'severity'
        > | null>(null);
    const [promiseArguments, setPromiseArguments] = React.useState<any>(null);
    const { user } = React.useContext(AuthContext);
    const [users, setUsers] = fetchUsersHook(user as User);
    const [sortModel, setSortModel] = React.useState<Array<GridSortItem>>([{ field: 'email', sort: 'desc' }]);


    function computeMutation(newRow: GridRowModel, oldRow: GridRowModel) {
        if (newRow.admin !== oldRow.admin) {
            return `Admin from '${oldRow.admin}' to '${newRow.admin}'`;
        }
        if (newRow.superAdmin !== oldRow.superAdmin) {
            return `Super Admin from '${oldRow.superAdmin}' to '${newRow.superAdmin}'`;
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
          // Make the HTTP request to save in the backend
          const response = await updateUserClaims(user as User, newRow);
          for (const user of users)
          {
            if (user.uid === response?.uid)
            {
                (user as unknown as { customClaims: { Admin: boolean, SuperAdmin: boolean } }).customClaims = { Admin: response.admin, SuperAdmin: response.superAdmin }
            }
          }
          setUsers(users);
          setSnackbar({ children: 'User successfully saved', severity: 'success' });
          resolve(response);
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

    return (
        <Container component="main" maxWidth='xl' sx={{'paddingTop': '10px'}}>
            <Grid container spacing={2}>
                <Grid xs={3}>
                    <AdminSidebar/>
                </Grid>
                <Grid xs={9}>
                    <Card sx={{width: '100%', p: 2}}>
                        {renderConfirmDialog()}
                        <StripedDataGrid
                            rows={users ? parseUsers(users) : []}
                            getRowId={(row) => row.uid}
                            columns={columns}
                            sortModel={sortModel}
                            onSortModelChange={(model) => setSortModel(model)}
                            getRowClassName={(params) => params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'}
                            processRowUpdate={processRowUpdate}
                            onProcessRowUpdateError={(err) => console.error(err)}
                            initialState={{
                                columns: {
                                    columnVisibilityModel: {
                                        id: false
                                    },
                                }
                            }}
                        />
                        {!!snackbar && (
                            <Snackbar open onClose={handleCloseSnackbar} autoHideDuration={6000}>
                            <Alert {...snackbar} onClose={handleCloseSnackbar} />
                            </Snackbar>
                        )}
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}