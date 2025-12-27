import { Table, Text } from '@chakra-ui/react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { useIsMobile } from '~/hooks/useIsMobile';
import { EpisodeForSeason } from '~/store/legacy/tv/types/tvTransformed';
import dayjs from '~/utils/dayjs';

type Props = {
  episodes: EpisodeForSeason[];
};

const EpisodesTable = ({ episodes }: Props) => {
  const isMobile = useIsMobile();

  const columns: ColumnDef<EpisodeForSeason>[] = [
    {
      id: 'episodeNumber',
      accessorKey: 'episodeNumber',
      size: 40,
      header: () => <Text>#</Text>,
    },
    {
      id: 'name',
      accessorKey: 'name',
      size: 100,
      header: () => <Text>Title</Text>,
    },
    {
      id: 'airDate',
      size: 80,
      accessorFn: row =>
        row.airDate && dayjs(row.airDate).format('MMMM D, YYYY'),
      header: () => <Text>Air Date</Text>,
    },
    {
      id: 'voteAverage',
      size: 50,
      meta: {
        style: { textAlign: 'center' },
      },
      accessorFn: row => row.voteAverage,
      header: () => <Text textAlign="center">Rating</Text>,
      cell: ({ row }) => (
        <Text textAlign="center">{row.original.voteAverage}</Text>
      ),
    },
  ];

  const { getHeaderGroups, getRowModel } = useReactTable<EpisodeForSeason>({
    columns,
    data: episodes,
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      columnVisibility: {
        name: !isMobile,
      },
    },
  });

  return (
    <Table.Root size="sm">
      <Table.Header>
        {getHeaderGroups().map(headerGroup => (
          <Table.Row key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <Table.ColumnHeader key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        ))}
      </Table.Header>

      <Table.Body>
        {getRowModel().rows.map(row => (
          <Table.Row key={row.id}>
            {row.getVisibleCells().map(cell => (
              <Table.Cell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

export default EpisodesTable;
