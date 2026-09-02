import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { AgGridReact } from 'ag-grid-react';
import { ClientSideRowModelModule, ModuleRegistry, themeQuartz, } from 'ag-grid-community';
import type { ColDef, ICellRendererParams, } from 'ag-grid-community';
import { Pencil, UserX, Trash2, UserCheck } from 'lucide-react';
import type { User } from '../types';
import { formatDate } from '../../../../utils/dateUtils';
import './UsersTable.scss';


ModuleRegistry.registerModules([
    ClientSideRowModelModule,
]);


const usersGridTheme =
    themeQuartz.withParams({
        accentColor: '#2563eb'
    });


type UsersTableProps = {
    users: User[];
    loading: boolean;
    error?: Error;
    onToggle: (user: User) => void;
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
};

const UsersTable = ({
    users,
    loading,
    error,
    onToggle,
    onEdit,
    onDelete
}: UsersTableProps) => {

    const columnDefs = useMemo<ColDef<User>[]>(
        () => [
            {
                headerName: 'Full Name',
                field: 'name',
                flex: 1,
                minWidth: 180,
            },
            {
                headerName: 'Email',
                field: 'email',
                flex: 1,
                minWidth: 250,
            },
            {
                headerName: 'Access Role',
                field: 'role',
                width: 140,
                cellRenderer: (
                    params: ICellRendererParams<User>,
                ) => (
                    <span
                        className={`role-badge role-${params.value?.toLowerCase()}`}
                    >
                        {params.value}
                    </span>
                ),
            },
            {
                headerName: 'CreatedAt',
                field: 'createdAt',
                flex: 1,
                minWidth: 200,
                valueFormatter: (params) => formatDate(params.value)
            },
            {
                headerName: 'UpdatedAt',
                field: 'updatedAt',
                flex: 1,
                minWidth: 200,
                valueFormatter: (params) => formatDate(params.value)
            },
            {
                headerName: 'Status',
                width: 140,
                sortable: false,
                filter: false,
                resizable: false,
                cellRenderer: (params: ICellRendererParams) => {
                    const user = params.data;
                    if (!user) {
                        return null
                    }
                    const isActive = user.isActive;

                    return (
                        <button
                            type='button'
                            className={isActive ? 'status-action-button deactivate-button' : 'status-action-button activate-button'}
                            onClick={() => { }}
                        >
                            {isActive ? (
                                <>
                                    <UserX size={16} />
                                    Deactivate
                                </>)
                                : (
                                    <>
                                        <UserCheck size={16} />
                                        Activate
                                    </>
                                )}
                        </button>
                    )
                }
            },
            {
                headerName: 'LastLogin',
                field: 'lastLogin',
                flex: 1,
                minWidth: 200,
                valueFormatter: (params) => formatDate(params.value)
            },
            {
                headerName: 'Actions',
                width: 90,
                sortable: false,
                filter: false,
                resizable: false,
                cellRenderer: (
                    params: ICellRendererParams<User>,
                ) => (
                    <>
                        <div className='table-action-button'>
                            <button
                                type="button"
                                className="table-action-button edit-button"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    if (params.data) {
                                        onEdit(params.data)
                                    }
                                }}
                            >
                                <Pencil size={16} />
                            </button>
                            <button
                                type="button"
                                className="table-action-button delete-button"
                                onClick={() => { }}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </>

                ),
            },
        ],
        [
            onEdit
        ],
    );


    const defaultColDef = useMemo(
        () => ({
            sortable: true,
            filter: true,
            resizable: true,
        }),
        [],
    );


    if (loading) {
        return (
            <div className="table-message">
                Loading users...
            </div>
        );
    }


    if (error) {
        return (
            <div className="table-message error">
                Failed to load users.
            </div>
        );
    }


    return (
        <>
            <div className="users-table-wrapper">
                <AgGridReact<User>
                    theme={usersGridTheme}
                    rowData={users}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    animateRows
                    suppressCellFocus
                />
            </div>
        </>
    );
};


export default UsersTable;