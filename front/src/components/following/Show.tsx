import { Flex, Heading, Image, Link } from '@chakra-ui/react';
import { useState } from 'react';

import { ROUTES } from '~/constants/routes';
import {
  fallbackImagePath,
  fallbackImagePathLarge,
  imagePath780,
} from '~/constants/strings';
import { useNavigateWithAnimation } from '~/hooks/useNavigateWithAnimation';
import { BasicShowInfo } from '~/types/external';

type Props = {
  show: BasicShowInfo;
};

const Show = (props: Props) => {
  const {
    show: { id, name, posterPath },
  } = props;
  const navigate = useNavigateWithAnimation();
  const [isImageHovered, setIsImageHovered] = useState(false);

  return (
    <Flex
      border="1px solid"
      borderColor="border.emphasized"
      borderRadius="6px"
      direction="column"
      key={id}
      shadow="sm"
    >
      <Link onClick={() => navigate(`${ROUTES.SHOW}/${id}`)}>
        <Image
          alt={`show-${name}`}
          borderRadius="6px"
          onError={e => (e.currentTarget.src = fallbackImagePath)}
          src={posterPath ? imagePath780 + posterPath : fallbackImagePathLarge}
          onMouseEnter={() => setIsImageHovered(true)}
          onMouseLeave={() => setIsImageHovered(false)}
        />
      </Link>
      <Flex direction="column" p="14px">
        <Link
          fontSize="16px"
          fontWeight="500"
          m="0 auto"
          onClick={() => navigate(`${ROUTES.SHOW}/${id}`)}
          textAlign="center"
          textDecoration={isImageHovered ? 'underline' : 'none'}
          textUnderlineOffset="2px"
          _hover={{
            textDecoration: 'underline',
          }}
        >
          <Heading as="button" cursor="pointer" fontSize="md" lineClamp={1}>
            {name}
          </Heading>
        </Link>
      </Flex>
    </Flex>
  );
};

export default Show;
