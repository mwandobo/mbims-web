import * as React from 'react';
import {useEffect} from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import {visuallyHidden} from '@mui/utils';
import {ButtonComponent} from "@/components/button/button.component";
import {Search} from "lucide-react";
import {getValueFromLocalStorage, setValueLocalStorage} from "@/utils/local-storage.util";
import {PageMetaDataType} from "@/common/types";

type Order = 'asc' | 'desc';

interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: number) => void;
    order: Order;
    orderBy: number;
    rowCount: number;
    columns: any[];
    sortBy?: string;
    sortDirection?: Order;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { onRequestSort, columns, sortBy, sortDirection } = props;

    const createSortHandler =
        (property: number) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };

    return (
        <TableHead>
            <TableRow
                className="bg-table-header-bg text-table-header-text border-t border-table-header-border !text-[14px] "
            >
                <TableCell
                    padding="checkbox"
                    className="!text-table-header-text !font-bold !border-table-header-border !py-2"
                >
                    S/N
                </TableCell>

                {columns.map((headCell, index) => (
                    <TableCell
                        key={index}
                        align={headCell.numeric ? "right" : "left"}
                        padding={headCell.disablePadding ? "none" : "normal"}
                        sortDirection={sortBy === headCell.id ? sortDirection : false}
                        className="!text-foreground !font-bold !border-l !border-card-border"
                        style={{ width: headCell.width }}
                    >
                        <TableSortLabel
                            active={sortBy === headCell.id}
                            direction={
                                sortBy === headCell.id ? sortDirection || "asc" : "asc"
                            }
                            onClick={createSortHandler(index)}
                            className="!text-table-header-text"
                            sx={{
                                color: "inherit",
                                "&.Mui-active": { color: "inherit" },
                                "& .MuiTableSortLabel-icon": {
                                    color: "inherit !important",
                                },
                            }}
                        >
                            {headCell.label}
                            {sortBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {sortDirection === "desc"
                                        ? "sorted descending"
                                        : "sorted ascending"}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}
interface Props {
    columns: any[];
    data: any[][];
    from?: string;
    page: number;
    filterKey?: string;
    totalRecords?: number;
    rowsPerPage: number;
    updatePage: (page: number) => void
    updateRowsPerPage: (rowsPerPage: number) => void
    updateFilterKey: (filterKey: string) => void
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    onSortChange?: (sortBy: string, direction: 'asc' | 'desc') => void;
    pageMetadata?: PageMetaDataType
}

export default function MuiTableComponent({
                                              columns,
                                              data,
                                              from,
                                              rowsPerPage,
                                              page,
                                              updateRowsPerPage,
                                              updatePage,
                                              updateFilterKey,
                                              totalRecords,
                                              filterKey,
                                              sortBy,
                                              sortDirection,
                                              onSortChange,
                                              pageMetadata
                                          }: Props) {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<number>(-1); // Changed to use column index
    const [selected, setSelected] = React.useState<readonly number[]>([]);
    const [searchKey, setSearchKey] = React.useState('');

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        propertyIndex: number,
    ) => {
        const column = columns[propertyIndex];
        if (!column?.id) return; // column must have an `id` (field name)

        const isAsc = sortBy === column.id && sortDirection === 'asc';
        const newDirection: Order = isAsc ? 'desc' : 'asc';

        // Notify parent → parent will call API with new sort
        onSortChange?.(column.id, newDirection);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        updatePage(++newPage)
    };

    const handleSearchChange = (value: any) => {
        setSearchKey(value)
        setValueLocalStorage('search-key', value)
        setValueLocalStorage('search-key-slug', `${pageMetadata?.title}-${value}`);
        if (value.length === 0) {
            updateFilterKey('')
        }
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateRowsPerPage(parseInt(event.target.value, 10));
    };

    const isSelected = (index: number) => selected.indexOf(index) !== -1;

    const visibleRows = data;

    useEffect(() => {
        if (pageMetadata?.title) {
            const rawSlug = getValueFromLocalStorage('search-key-slug');
            const searchKeySlug = rawSlug != null ? String(rawSlug) : '';

            if (!searchKeySlug) {
                setValueLocalStorage('search-key', '');
                setSearchKey('');
            } else {
                const splitSearchKey = searchKeySlug.split('-');
                const searchPageTitle = splitSearchKey[0];

                if (searchPageTitle === pageMetadata.title) {
                    const rawKey = getValueFromLocalStorage('search-key');
                    setSearchKey(rawKey != null ? String(rawKey) : '');
                }
            }
        } else {
            setSearchKey('');
            setValueLocalStorage('search-key', '');
        }
    }, [pageMetadata?.title]);

    return (
        <Box sx={{width: '100%', marginTop: '10px'}}>
            <div className={'flex w-full justify-end mb-2'}>
                <form
                    className="flex w-1/4 gap-2"
                    onSubmit={(e) => {
                        e.preventDefault();
                        updateFilterKey(searchKey);
                    }}
                >
                    <input
                        type="text"
                        placeholder="Search..."
                        style={{
                            padding: '6px 12px',
                            fontSize: '14px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            flex: 1,
                            color: 'black'
                        }}
                        value={searchKey}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                updateFilterKey(searchKey);
                            }
                        }}
                    />

                    <ButtonComponent
                        type="submit"
                        name="Search"
                        // onClick is no longer needed
                        rounded="md"
                        padding="p-3"
                    >
                        <Search size={13} />
                    </ButtonComponent>
                </form>

            </div>
            <Paper sx={{width: '100%', mb: 2}}>
                <TableContainer>
                    <Table
                        sx={{minWidth: `${from === 'monitoring' ? 50 : 750}`}}
                        aria-labelledby="tableTitle"
                        size={'small'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            rowCount={data.length}
                            columns={columns}
                            sortBy={sortBy}
                            sortDirection={sortDirection}
                        />
                        <TableBody>
                            {visibleRows.length > 0 ? (
                                visibleRows.map((row, index) => (
                                    // <TableRow
                                    //     hover
                                    //     role="checkbox"
                                    //     aria-checked={isSelected(index)}
                                    //     tabIndex={-1}
                                    //     key={index}
                                    //     selected={isSelected(index)}
                                    //     className="bg-table-row-bg text-table-row-text"
                                    //     sx={{
                                    //         backgroundColor: "var(--table-row-bg) !important",
                                    //         color: "var(--table-row-text)",
                                    //         "&:hover": {
                                    //             backgroundColor: "var(--table-row-hover) !important",
                                    //         },
                                    //         "&.Mui-selected": {
                                    //             backgroundColor: "var(--table-row-hover) !important",
                                    //         },
                                    //         "&.Mui-selected:hover": {
                                    //             backgroundColor: "var(--table-row-hover) !important",
                                    //         },
                                    //     }}
                                    // >
                                    //     <TableCell
                                    //         component="th"
                                    //         id={`enhanced-table-checkbox-${index}`}
                                    //         scope="row"
                                    //         // sx={{ marginRight: "1px solid black" }}
                                    //         className="!text-table-row-text !border-table-row-border !text-xs"
                                    //     >
                                    //         {(page - 1) * rowsPerPage + index + 1}
                                    //     </TableCell>
                                    //     {row.map((cell, cellIndex) => (
                                    //         <TableCell
                                    //             key={cellIndex}
                                    //             padding="normal"
                                    //             className="!text-table-row-text !border-l !border-table-row-border !text-xs"
                                    //             style={{
                                    //                 borderLeft: '1px solid #d1d1d1',
                                    //                 fontSize: "12px"
                                    //             }}
                                    //         >
                                    //             {cell}
                                    //         </TableCell>
                                    //     ))}
                                    // </TableRow>

                                    <TableRow
                                        role="checkbox"
                                        aria-checked={isSelected(index)}
                                        tabIndex={-1}
                                        key={index}
                                        selected={isSelected(index)}
                                        className="bg-table-row-bg text-table-row-text"
                                        sx={{
                                            backgroundColor: "var(--table-row-bg) !important",
                                            color: "var(--table-row-text)",
                                            "&:hover": {
                                                backgroundColor: "var(--table-row-hover) !important",
                                            },
                                            "&.Mui-selected": {
                                                backgroundColor: "var(--table-row-hover) !important",
                                            },
                                            "&.Mui-selected:hover": {
                                                backgroundColor: "var(--table-row-hover) !important",
                                            },
                                        }}
                                    >
                                        <TableCell
                                            component="th"
                                            id={`enhanced-table-checkbox-${index}`}
                                            scope="row"
                                            className="!text-table-row-text !border-table-row-border !text-xs"
                                            sx={{
                                                color: "var(--table-row-text)",
                                                borderColor: "var(--table-row-border)",
                                            }}
                                        >
                                            {(page - 1) * rowsPerPage + index + 1}
                                        </TableCell>

                                        {row.map((cell, cellIndex) => (
                                            <TableCell
                                                key={cellIndex}
                                                padding="normal"
                                                className="!text-table-row-text !border-l !border-table-row-border !text-xs"
                                                sx={{
                                                    color: "var(--table-row-text)",
                                                    borderLeft: "1px solid var(--table-row-border)",
                                                    fontSize: "12px",
                                                }}
                                            >
                                                {cell}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow
                                    className="bg-table-row-bg text-table-row-text"
                                    sx={{
                                        backgroundColor: "var(--table-row-bg) !important",
                                        color: "var(--table-row-text)",
                                        "&:hover": {
                                            backgroundColor: "var(--table-row-hover) !important",
                                        },
                                        "&.Mui-selected": {
                                            backgroundColor: "var(--table-row-hover) !important",
                                        },
                                        "&.Mui-selected:hover": {
                                            backgroundColor: "var(--table-row-hover) !important",
                                        },
                                    }}

                                >
                                    <TableCell
                                        colSpan={columns.length + 1} // +1 for the S/N column
                                        align="center"
                                        className="!text-table-row-text !border-l !border-table-row-border !text-xs"
                                        sx={{
                                            color: "var(--table-row-text)",
                                            borderLeft: "1px solid var(--table-row-border)",
                                            fontSize: "12px",
                                        }}
                                    >
                                        No data available
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                {from !== "monitoring" && (
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={totalRecords ?? data.length}
                        rowsPerPage={rowsPerPage}
                        page={page - 1}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        sx={{
                            color: "var(--table-row-text)",
                            backgroundColor: "var(--table-row-bg)",
                            borderTop: "1px solid var(--table-row-border)",

                            ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
                                color: "var(--table-row-text)",
                            },

                            ".MuiTablePagination-select": {
                                color: "var(--table-row-text)",
                            },

                            ".MuiIconButton-root": {
                                color: "var(--table-row-text)",
                                "&.Mui-disabled": {
                                    color: "var(--muted)",
                                },
                            },

                            ".MuiSvgIcon-root": {
                                color: "inherit",
                            },

                            ".MuiInputBase-root": {
                                color: "var(--table-row-text)",
                            },
                        }}
                    />
                )}
            </Paper>
        </Box>
    );
}