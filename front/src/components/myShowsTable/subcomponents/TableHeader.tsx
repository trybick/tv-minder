import React from 'react';
import { HeaderGroup } from 'react-table';
import { chakra, Th, Tr } from '@chakra-ui/react';
import { BasicShowInfo } from 'types/external';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';

interface Props {
  headerGroups: HeaderGroup<BasicShowInfo>[];
}

const TableHeader = ({ headerGroups }: Props) => (
  <>
    {headerGroups.map((headerGroup, i) => (
      <Tr {...headerGroup.getHeaderGroupProps()} key={`headerGroup-${i}`}>
        {headerGroup.headers.map(column => (
          <Th
            {...column.getHeaderProps(column.getSortByToggleProps())}
            fontSize={14}
            key={column.id}
          >
            {column.render('Header')}
            <chakra.span ml="3px">
              {column.isSorted ? (
                column.isSortedDesc ? (
                  <TriangleDownIcon boxSize="16px" verticalAlign="text-bottom" />
                ) : (
                  <TriangleUpIcon boxSize="16px" verticalAlign="text-bottom" />
                )
              ) : null}
            </chakra.span>
          </Th>
        ))}
      </Tr>
    ))}
  </>
);

export default TableHeader;
