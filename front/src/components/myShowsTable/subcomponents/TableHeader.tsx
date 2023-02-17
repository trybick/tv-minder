import { HeaderGroup, TableSortByToggleProps } from 'react-table';
import { chakra, Th, Tr } from '@chakra-ui/react';
import { BasicShowInfo } from 'types/external';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';

type Props = {
  headerGroups: HeaderGroup<BasicShowInfo>[];
};

const TableHeader = ({ headerGroups }: Props) => {
  const getHeaderProps = (column: HeaderGroup<BasicShowInfo>) => {
    // Solve an issue where the column header stretches out and too large an area is clickable.
    // So we extract out onClick and only add onClick in a child of the Header. Also we need to
    // modify the styling to remove the 'cursor: pointer'.
    const baseProps = {
      ...column.getHeaderProps(column.getSortByToggleProps()),
    } as TableSortByToggleProps;
    const onClick = (({ onClick }) => ({ onClick }))(baseProps);
    delete baseProps.onClick;
    if (baseProps.style?.cursor) {
      baseProps.style.cursor = 'default';
    }
    return { baseProps, onClick };
  };

  return (
    <>
      {headerGroups.map((headerGroup, i) => (
        <Tr {...headerGroup.getHeaderGroupProps()} key={`headerGroup-${i}`}>
          {headerGroup.headers.map(column => {
            const { baseProps, onClick } = getHeaderProps(column);
            return (
              <Th
                {...baseProps}
                display="flex"
                fontSize={14}
                h="55px"
                justifyContent={column.id === 'name' ? '' : 'center'}
                key={column.id}
              >
                <chakra.span alignItems="center" display="inline-flex" userSelect="none">
                  {column.render('Header', { onClick: onClick.onClick })}
                  <chakra.span cursor="pointer" ml="3px" onClick={onClick.onClick}>
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <TriangleDownIcon boxSize="15px" verticalAlign="text-bottom" />
                      ) : (
                        <TriangleUpIcon boxSize="15px" verticalAlign="text-bottom" />
                      )
                    ) : null}
                  </chakra.span>
                </chakra.span>
              </Th>
            );
          })}
        </Tr>
      ))}
    </>
  );
};

export default TableHeader;
