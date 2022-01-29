import React from 'react';
import { useExpanded, useFlexLayout, useSortBy, useTable } from 'react-table';
import { Table, Tbody, Thead, useColorMode, useMediaQuery } from '@chakra-ui/react';
import { BasicShowInfo } from 'types/external';
import { useTableData } from './helpers/useTableData';
import TableHeader from './subcomponents/TableHeader';
import TableRow from './subcomponents/TableRow';
import ExpandedDrawer from './subcomponents/ExpandedDrawer';

const MyShowsTable = () => {
  const { colorMode } = useColorMode();
  const [isMobile] = useMediaQuery(['(max-width: 768px)']);
  const { data, columns } = useTableData();
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable<BasicShowInfo>(
      { columns, data, autoResetSortBy: false },
      useSortBy,
      useExpanded,
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
          return [
            <TableRow
              cells={row.cells}
              darkMode={colorMode === 'dark'}
              isExpanded={row.isExpanded}
              isMobile={isMobile}
              key={`row-${i}`}
              rowProps={row.getRowProps()}
            />,
            <ExpandedDrawer
              darkMode={colorMode === 'dark'}
              isExpanded={row.isExpanded}
              key={`expanded-${i}`}
              row={row}
            />,
          ];
        })}
      </Tbody>
    </Table>
  );
};

export default MyShowsTable;
