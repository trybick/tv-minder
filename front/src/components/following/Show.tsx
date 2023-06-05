import { Link as RouterLink } from 'react-router-dom';
import { Flex, Image, Link, Text, useColorModeValue } from '@chakra-ui/react';
import { fallbackImagePath, fallbackImagePathLarge, imagePath780 } from 'constants/strings';
import { BasicShowInfo } from 'types/external';
import { ROUTES } from 'constants/routes';

type Props = {
  show: BasicShowInfo;
};

const Show = (props: Props) => {
  const {
    show: { id, name, posterPath },
  } = props;
  const imageBorderColor = useColorModeValue('#e3e3e3', '#28282B');

  return (
    <Flex
      border={`1px solid ${imageBorderColor}`}
      borderRadius="6px"
      boxShadow="rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;"
      direction="column"
      key={id}
    >
      <Link as={RouterLink} to={`${ROUTES.SHOW}/${id}`}>
        <Image
          alt={`show-${name}`}
          borderRadius="6px"
          fallbackSrc={fallbackImagePath}
          fallbackStrategy="onError"
          src={posterPath ? imagePath780 + posterPath : fallbackImagePathLarge}
        />
      </Link>
      <Flex direction="column" p="10px">
        <Text fontSize="16px" fontWeight="500" noOfLines={1}>
          <Link as={RouterLink} to={`${ROUTES.SHOW}/${id}`}>
            {name}
          </Link>
        </Text>
      </Flex>
    </Flex>
  );
};

export default Show;
