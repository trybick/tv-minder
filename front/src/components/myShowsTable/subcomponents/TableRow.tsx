import { useDispatch } from 'react-redux';
import { Cell } from 'react-table';
import { TableRowProps, Td, Tr, useColorModeValue } from '@chakra-ui/react';
import { BasicShowInfo } from 'types/external';
import { expandMyShowsTableRowAction } from 'store/tv/actions';

type Props = {
  cells: Cell<BasicShowInfo>[];
  isExpanded: boolean;
  isMobile?: boolean;
  rowProps: TableRowProps;
  showId: number;
};

const TableRow = ({ cells, isExpanded, isMobile, rowProps, showId }: Props) => {
  const expandedBackgroundColor = useColorModeValue('#f7f5f5', '#252E41');
  const dispatch = useDispatch();

  return (
    <Tr
      {...rowProps}
      bg={isExpanded ? expandedBackgroundColor : ''}
      cursor="pointer"
      onClick={() => dispatch(expandMyShowsTableRowAction(showId))}
    >
      {cells.map((cell, i) => (
        <Td
          {...cell.getCellProps()}
          border={isExpanded ? 0 : ''}
          fontSize={14}
          key={`cell-${i}`}
          px={isMobile ? '10px' : '32px'}
        >
          {cell.render('Cell')}
        </Td>
      ))}
    </Tr>
  );
};

export default TableRow;
