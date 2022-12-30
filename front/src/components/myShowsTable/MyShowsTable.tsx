import { useSelector } from 'react-redux';
import { useExpanded, useFlexLayout, useSortBy, useTable } from 'react-table';
import { Table, Tbody, Thead } from '@chakra-ui/react';
import { useIsMobile } from 'hooks/useIsMobile';
import { BasicShowInfo } from 'types/external';
import { selectMyShowsTableExpandedRow } from 'store/tv/selectors';
import { useTableData } from './helpers/useTableData';
import TableHeader from './subcomponents/TableHeader';
import TableRow from './subcomponents/TableRow';
import ExpandedDrawer from './subcomponents/ExpandedDrawer/ExpandedDrawer';

const MyShowsTable = () => {
  const myShowsTableExpandedRow = useSelector(selectMyShowsTableExpandedRow);
  const isMobile = useIsMobile();
  const { data, columns } = useTableData();
  const initialState = {
    sortBy: [
      {
        id: 'name',
        desc: false,
      },
    ],
  };
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable<BasicShowInfo>(
      {
        columns,
        data,
        autoResetSortBy: false,
        initialState,
      },
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
              isExpanded={row.original.id === myShowsTableExpandedRow}
              isMobile={isMobile}
              key={`row-${i}`}
              rowProps={row.getRowProps()}
              showId={row.original.id}
            />,
            <ExpandedDrawer
              isExpanded={row.original.id === myShowsTableExpandedRow}
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
