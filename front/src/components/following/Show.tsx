import { Flex, Image, Link } from '@chakra-ui/react';
import { useLocation } from 'wouter';
import { useColorModeValue } from '~/components/ui/color-mode';
import { ROUTES } from '~/constants/routes';
import {
  fallbackImagePath,
  fallbackImagePathLarge,
  imagePath780,
} from '~/constants/strings';
import { BasicShowInfo } from '~/types/external';

type Props = {
  show: BasicShowInfo;
};

const Show = (props: Props) => {
  const {
    show: { id, name, posterPath },
  } = props;
  const [, navigate] = useLocation();
  const imageBorderColor = useColorModeValue('#e3e3e3', '#28282B');

  return (
    <Flex
      border={`1px solid ${imageBorderColor}`}
      borderRadius="6px"
      boxShadow="rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;"
      direction="column"
      key={id}
    >
      <Link onClick={() => navigate(`${ROUTES.SHOW}/${id}`)}>
        <Image
          alt={`show-${name}`}
          borderRadius="6px"
          onError={e => (e.currentTarget.src = fallbackImagePath)}
          src={posterPath ? imagePath780 + posterPath : fallbackImagePathLarge}
        />
      </Link>
      <Flex direction="column" p="14px">
        <Link
          color={useColorModeValue('gray.900', 'white')}
          fontSize="16px"
          fontWeight="500"
          lineClamp={1}
          onClick={() => navigate(`${ROUTES.SHOW}/${id}`)}
          textAlign="center"
        >
          {name}
        </Link>
      </Flex>
    </Flex>
  );
};

export default Show;
