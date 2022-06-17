import { Cell } from 'react-table';
import { TableRowProps, Td, Tr, useColorModeValue } from '@chakra-ui/react';
import { BasicShowInfo } from 'types/external';

type Props = {
  cells: Cell<BasicShowInfo>[];
  isExpanded: boolean;
  isMobile?: boolean;
  rowProps: TableRowProps;
};

const TableRow = ({ cells, isExpanded, isMobile, rowProps }: Props) => {
  const expandedBackgroundColor = useColorModeValue('#f7f5f5', '#252E41');

  return (
    <Tr {...rowProps} bg={isExpanded ? expandedBackgroundColor : ''}>
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
