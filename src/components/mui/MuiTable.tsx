"use client";

import React, { useState } from 'react';
import { useMediaQuery } from "react-responsive";
import Image from "@/components/Image";
import { currency } from '@/common/utils/StringUtils';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';

interface MuiTableProps<T extends Row> {
  topSection?: React.ReactNode;
  columns: Array<Column<T>>;
  rows: Array<T>;
}

export default function MuiTable<T extends Row>({ topSection, columns, rows }: MuiTableProps<T>) {
  const isSp = useMediaQuery({ query: "(max-width: 1179px)" });

  const labelDict = [
    { key: "done", label: "完了", color: "var(--done-color)" },
    { key: "pickup", label: "受け取り予定", color: "var(--pickup-color)" },
    { key: "booked", label: "予約", color: "var(--booked-color)" },
    { key: "review", label: "レビュー待ち", color: "var(--review-color)" },
    { key: "cancel", label: "キャンセル", color: "var(--cancel-color)" },
  ];

  const rowsPerPage: number = 50;
  const [page, setPage] = useState<number>(0);

  const handleChangePage = (e: unknown, newPage: number) => {
    setPage(newPage);
  };

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
                const visibleColumns = columns.filter(col => !col.hide);
                const visibleIndex = visibleColumns.findIndex(col => col.key === column.key);
                return (
                  <TableCell
                    key={column.key as string}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                    sx={{
                      backgroundColor: 'var(--foreground)',
                      color: 'var(--background)',
                      borderTopLeftRadius: visibleIndex === 0 ? '0.5rem' : 'unset',
                      borderTopRightRadius: visibleIndex === visibleColumns.length - 1 ? '0.5rem' : 'unset',
                    }}
                  >
                    {column.label}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      if (column.hide) return null;
                      const value = row[column.key as keyof typeof row];
                      let dpValue;

                      switch (column.type) {
                        case 'image':
                          dpValue = <Image className="profile" src={value as string} alt={column.label} width={38} height={38} />;
                          break;
                        case 'date':
                          dpValue = new Date(value as string).toLocaleDateString();
                          break;
                          case 'number':
                            dpValue = column.format && typeof value === 'number'
                              ? column.format(value)
                              : currency(value as number);
                            break;
                        case 'status':
                          dpValue = (
                            <Chip
                              size="small"
                              label={labelDict.find(label => label.key === value)?.label}
                              sx={{
                                backgroundColor: labelDict.find(label => label.key === value)?.color,
                                color: 'var(--background)',
                                width: '100px',
                              }}
                            />
                          );
                          break;
                        default:
                          dpValue = value;
                      }

                      return (
                        <TableCell key={column.key as string} align={column.align}>
                          {dpValue}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
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
