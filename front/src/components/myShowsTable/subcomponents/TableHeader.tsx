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
            px="30px"
          >
            {column.render('Header')}
            <chakra.span>
              {column.isSorted ? (
                column.isSortedDesc ? (
                  <TriangleDownIcon />
                ) : (
                  <TriangleUpIcon />
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
