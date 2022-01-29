import { Cell } from 'react-table';
import { TableRowProps, Td, Tr } from '@chakra-ui/react';
import { BasicShowInfo } from 'types/external';

interface Props {
  cells: Cell<BasicShowInfo>[];
  darkMode: boolean;
  isExpanded: boolean;
  isMobile?: boolean;
  rowProps: TableRowProps;
}

const TableRow = ({ cells, darkMode, isExpanded, isMobile, rowProps }: Props) => (
  <Tr {...rowProps} backgroundColor={isExpanded ? (darkMode ? '#252E41' : '#f7f5f5 ') : ''}>
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

export default TableRow;
