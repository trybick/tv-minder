import { Badge, Flex, Icon, Table, Text } from '@chakra-ui/react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { FaStar } from 'react-icons/fa';

import { useIsMobile } from '~/hooks/useIsMobile';
import { EpisodeForSeason } from '~/store/tv/types/transformed';
import { dayjs } from '~/utils/dayjs';

import { TableHeader } from './TableHeader';

type Props = {
  episodes: EpisodeForSeason[];
};

export const EpisodesTable = ({ episodes }: Props) => {
  const isMobile = useIsMobile();

  const columns: ColumnDef<EpisodeForSeason>[] = [
    {
      id: 'episodeNumber',
      accessorKey: 'episodeNumber',
      size: 40,
      header: () => <TableHeader>Number</TableHeader>,
      cell: ({ row }) => (
        <Text color="fg.muted" fontSize="sm">
          {row.original.episodeNumber}
        </Text>
      ),
    },
    {
      id: 'name',
      accessorKey: 'name',
      size: 100,
      header: () => <TableHeader>Title</TableHeader>,
      cell: ({ row }) => (
        <Text fontWeight="semibold" fontSize="sm" color="fg">
          {row.original.name}
        </Text>
      ),
    },
    {
      id: 'airDate',
      size: 80,
      accessorFn: row =>
        row.airDate && dayjs(row.airDate).format('MMM D, YYYY'),
      header: () => <TableHeader>Air Date</TableHeader>,
      cell: ({ getValue }) => (
        <Text fontSize="sm" whiteSpace="nowrap" color="fg.muted">
          {getValue() as string}
        </Text>
      ),
    },
    {
      id: 'voteAverage',
      size: 50,
      header: () => <TableHeader textAlign="center">Rating</TableHeader>,
      cell: ({ row }) => {
        const ratingStr = row.original.voteAverage;
        if (!ratingStr || ratingStr === '-') {
          return (
            <Text color="fg.muted" textAlign="center">
              -
            </Text>
          );
        }
        const rating = parseFloat(ratingStr);

        return (
          <Flex justify="center">
            <Badge
              variant="subtle"
              colorPalette={
                rating >= 8 ? 'green' : rating >= 6.5 ? 'yellow' : 'orange'
              }
              size="sm"
              borderRadius="full"
              px="2"
              display="flex"
              alignItems="center"
              gap="1"
            >
              {rating.toFixed(1)}
              <Icon as={FaStar} boxSize="2" />
            </Badge>
          </Flex>
        );
      },
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
    <Table.Root size={isMobile ? 'sm' : 'md'} variant="outline" interactive>
      <Table.Header>
        {getHeaderGroups().map(headerGroup => (
          <Table.Row key={headerGroup.id} borderBottomWidth="2px">
            {headerGroup.headers.map(header => (
              <Table.ColumnHeader
                key={header.id}
                py="4"
                px={isMobile ? '2' : '4'}
              >
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
          <Table.Row
            key={row.id}
            _hover={{ bg: 'whiteAlpha.50' }}
            transition="background 0.2s"
            borderBottomWidth="1px"
            borderColor="whiteAlpha.50"
          >
            {row.getVisibleCells().map(cell => (
              <Table.Cell key={cell.id} py="4" px={isMobile ? '2' : '4'}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};
