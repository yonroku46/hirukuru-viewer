"use client";

import React, { Fragment, useState } from 'react';
import dayjs from 'dayjs';
import { useMediaQuery } from "react-responsive";
import Image from "@/components/Image";
import { currency, optionsToString, orderStatusDict, payTypeDict } from '@/common/utils/StringUtils';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Rating from '@mui/material/Rating';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Collapse from '@mui/material/Collapse';

interface MuiTableProps<T extends Row> {
  topSection?: React.ReactNode;
  columns: Array<Column<T>>;
  rows: Array<T>;
}

export default function MuiTable<T extends Row>({ topSection, columns, rows }: MuiTableProps<T>) {
  const isSp = useMediaQuery({ query: "(max-width: 1179px)" });

  const rowsPerPage: number = 50;
  const [page, setPage] = useState<number>(0);

  const handleChangePage = (e: unknown, newPage: number) => {
    setPage(newPage);
  };

  function Row<T extends Row>({ row }: { row: T }) {
    const [open, setOpen] = React.useState(false);
    const visibleColumns = columns.filter(col => !col.hide);
    const haveListColumn = visibleColumns.find(column => column.type === 'list');
    const listColumns = haveListColumn ? haveListColumn.listColumns : [];
    const listRowChild = row[haveListColumn?.key as keyof typeof row];

    return (
      <Fragment>
        {/* Main data */}
        <TableRow hover tabIndex={-1} key={row.id}>
          {visibleColumns.map((column) => {
            const value = row[column.key as keyof typeof row];
            let dpValue;

            switch (column.type) {
              case 'image':
                dpValue = (
                  <Image
                    className="profile"
                    src={value as string}
                    alt={column.label}
                    width={38}
                    height={38}
                  />
                );
                break;
              case 'rating':
                dpValue = (
                  <Rating
                    readOnly
                    size="small"
                    value={value as number}
                    icon={<StarRoundedIcon fontSize="inherit" style={{ color: 'var(--rating-color)' }} />}
                    emptyIcon={<StarRoundedIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                  />
                );
                break;
              case 'status':
                dpValue = (
                  <Chip
                    size="small"
                    label={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        {orderStatusDict(value as OrderStatusCount['status'], 'icon')}
                        {orderStatusDict(value as OrderStatusCount['status'], 'label') as string}
                      </div>
                    }
                    sx={{
                      backgroundColor: orderStatusDict(value as OrderStatusCount['status'], 'color') as string,
                      color: 'var(--background)',
                      width: '110px',
                      height: '28px',
                      fontSize: '0.95rem',
                    }}
                  />
                );
                break;
              case 'payType':
                dpValue = (
                  <div>
                    {payTypeDict(value as PayType['type'], 'label')}
                  </div>
                );
                break;
              case 'list':
                dpValue = (
                  <IconButton size="small" onClick={() => setOpen(!open)}>
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </IconButton>
                );
                break;
              case 'number':
                dpValue = column.format && typeof value === 'number'
                ? column.format(value)
                : currency(value as number, column.typeUnit);
                break;
              case 'date':
                dpValue = column.dateFormat && typeof value === 'string'
                ? column.dateFormat(value)
                : dayjs(value as string).format('YYYY-MM-DD');
                break;
              case 'time':
                dpValue = column.dateFormat && typeof value === 'string'
                ? column.dateFormat(value)
                : dayjs(value as string).isValid() && `${dayjs(value as string).format('YYYY-MM-DD')}\n${dayjs(value as string).format('HH:mm')}`
                break;
              default:
                dpValue = value;
            }

            return (
              <TableCell
                key={column.key as string}
                align={column.align}
                sx={{
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: column.type === 'time' ? 'break-spaces' : 'nowrap',
                  width: column.width,
                  minWidth: column.minWidth,
                  maxWidth: column.maxWidth,
                  fontSize: '1rem',
                }}
              >
                {dpValue}
              </TableCell>
            );
          })}
        </TableRow>
        {/* Detail data */}
        {haveListColumn && listColumns && listColumns.length > 0 && listRowChild && (
          <TableRow>
            <TableCell
              colSpan={visibleColumns.length}
              style={{ padding: 0, borderBottom: open ? '1px solid var(--gray-alpha-500)' : 'unset' }}
            >
              <Collapse in={open} timeout="auto" unmountOnExit>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      {listColumns.map((listColumn) => {
                        if (listColumn.hide) return null;
                        return (
                          <TableCell
                            key={listColumn.key as string}
                            align={listColumn.align}
                            sx={{
                              backgroundColor: 'var(--gray-alpha-500)',
                              color: 'var(--background)',
                              fontSize: '1rem',
                              width: listColumn.width,
                              minWidth: listColumn.minWidth,
                              maxWidth: listColumn.maxWidth,
                            }}
                          >
                            {listColumn.label}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Array.isArray(listRowChild) && listRowChild.length > 0 ?
                      listRowChild.map((listRow, index) => (
                        <TableRow key={index}>
                          {listColumns.map((listColumn) => {
                            if (listColumn.hide) return null;
                            return (
                              <TableCell
                                key={listColumn.key as string}
                                align={listColumn.align}
                                sx={{
                                  textOverflow: 'ellipsis',
                                  overflow: 'hidden',
                                  whiteSpace: 'normal',
                                  width: listColumn.width,
                                  minWidth: listColumn.minWidth,
                                  maxWidth: listColumn.maxWidth,
                                  fontSize: '1rem',
                                  borderBottom: index === listRowChild.length - 1 ? 'unset' : '',
                                }}
                              >
                                {listColumn.type === 'number' ?
                                  currency(listRow[listColumn.key as keyof typeof listRow], listColumn.typeUnit)
                                  : listColumn.type === 'options' ?
                                    optionsToString(listRow[listColumn.key as keyof typeof listRow])
                                      : listRow[listColumn.key as keyof typeof listRow]
                                }
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))
                    :
                    <TableRow>
                      <TableCell colSpan={listColumns.length} align="center" sx={{ opacity: '0.85' }}>
                        データがありません
                      </TableCell>
                    </TableRow>
                    }
                  </TableBody>
                </Table>
              </Collapse>
            </TableCell>
          </TableRow>
        )}
      </Fragment>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 'unset' }}>
      <div style={{ marginBottom: '1rem' }}>
        {topSection}
      </div>
      <TableContainer
        className="table-container"
        sx={{ maxHeight: '80vh' }}
      >
        <Table stickyHeader size={isSp ? 'small' : 'medium'} aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => {
                if (column.hide) return null;
                return (
                  <TableCell
                    key={column.key as string}
                    align={column.align}
                    sx={{
                      borderTop: '1px solid var(--gray-alpha-300)',
                      backgroundColor: 'var(--gray-alpha-100)',
                      fontSize: '1rem',
                      width: column.width,
                      minWidth: column.minWidth,
                      maxWidth: column.maxWidth,
                      padding: '0.5rem 1rem',
                    }}
                  >
                    {column.label}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length > 0 ?
              rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return <Row key={row.id} row={row} />
                })
              :
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ opacity: '0.85' }}>
                  データがありません
                </TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        rowsPerPageOptions={[]}
        labelRowsPerPage=""
        rowsPerPage={rowsPerPage}
        count={rows.length}
        page={page}
        labelDisplayedRows={({ from, to, count }) => `${from}~${to}件目 / ${count}件`}
        onPageChange={handleChangePage}
        sx={{
          '& .MuiTablePagination-toolbar': {
            minHeight: 'unset',
          },
          marginBottom: '3rem',
        }}
      />
    </Paper>
  );
}
