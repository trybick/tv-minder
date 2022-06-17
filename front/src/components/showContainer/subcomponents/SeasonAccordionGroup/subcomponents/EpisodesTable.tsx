import { useMemo } from 'react';
import { CellProps, Column, useFlexLayout, useTable } from 'react-table';
import moment from 'moment';
import { Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { EpisodeForSeason } from 'types/external';

type Props = {
  isMobile: boolean;
  episodes: EpisodeForSeason[];
};

const EpisodesTable = ({ episodes, isMobile }: Props) => {
  const columns: Column<EpisodeForSeason>[] = useMemo(
    () => [
      {
        id: 'episodeNumber',
        accessor: 'episodeNumber',
        width: 40,
        Header: () => <Text>#</Text>,
      },
      {
        id: 'name',
        accessor: 'name',
        width: 100,
        Header: () => <Text>Title</Text>,
      },
      {
        id: 'airDate',
        width: 80,
        accessor: row => row.airDate && moment(row.airDate).format('MMMM D, YYYY'),
        Header: () => <Text>Air Date</Text>,
      },
      {
        id: 'voteAverage',
        width: 50,
        style: { textAlign: 'center' },
        accessor: row => row.voteAverage,
        Header: () => <Text textAlign="center">Rating</Text>,
        Cell: ({ row }: CellProps<EpisodeForSeason>) => (
          <Text textAlign="center">{row.original.voteAverage}</Text>
        ),
      },
    ],
    []
  );

  const initialState = isMobile ? { hiddenColumns: ['name'] } : undefined;
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable<EpisodeForSeason>({ columns, data: episodes, initialState }, useFlexLayout);

  return (
    <Table size="sm" {...getTableProps()}>
      <Thead>
        {headerGroups.map((headerGroup, i) => (
          <Tr {...headerGroup.getHeaderGroupProps()} key={`episode-headerGroup-${i}`}>
            {headerGroup.headers.map(column => (
              <Th {...column.getHeaderProps()} key={column.id}>
                {column.render('Header')}
              </Th>
            ))}
          </Tr>
        ))}
      </Thead>
      <Tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return [
            <Tr {...row.getRowProps()} key={`episode-row-${i}`}>
              {row.cells.map((cell, i) => (
                <Td {...cell.getCellProps()} key={`episode-cell-${i}`}>
                  {cell.render('Cell')}
                </Td>
              ))}
            </Tr>,
          ];
        })}
      </Tbody>
    </Table>
  );
};

export default EpisodesTable;
