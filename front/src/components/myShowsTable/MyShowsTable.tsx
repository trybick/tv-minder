import { useFlexLayout, useSortBy, useTable } from 'react-table';
import { Table, Tbody, Td, Thead, Tr } from '@chakra-ui/react';
import { useIsMobile } from 'hooks/useIsMobile';
import { BasicShowInfo } from 'types/external';
import { useTableData } from './helpers/useTableData';
import TableHeader from './TableHeader';

const MyShowsTable = () => {
  const isMobile = useIsMobile();
  const { data, columns } = useTableData();

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable<BasicShowInfo>(
      {
        columns,
        data,
        autoResetSortBy: false,
      },
      useSortBy,
      useFlexLayout
    );

  return (
    <Table mt="20px" size="lg" {...getTableProps()}>
      <Thead>
        <TableHeader headerGroups={headerGroups} />
      </Thead>
      <Tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <Tr {...row.getRowProps()} key={`row-${i}`}>
              {row.cells.map((cell, i) => (
                <Td
                  {...cell.getCellProps()}
                  fontSize={14}
                  key={`cell-${i}`}
                  px={isMobile ? '14px' : '32px'}
                >
                  {cell.render('Cell')}
                </Td>
              ))}
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
};

export default MyShowsTable;
