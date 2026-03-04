import { Flex, Icon } from '@chakra-ui/react';
import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa';

export const StarRating = ({
  fullStars,
  hasHalfStar,
  emptyStars,
  color = 'yellow.400',
}: {
  fullStars: number;
  hasHalfStar: boolean;
  emptyStars: number;
  color?: string;
}) => (
  <Flex align="center" gap={0.5} color={color}>
    {Array.from({ length: fullStars }).map((_, i) => (
      <Icon key={`full-${i}`} as={FaStar} boxSize={3} />
    ))}
    {hasHalfStar && <Icon as={FaStarHalfAlt} boxSize={3} />}
    {Array.from({ length: emptyStars }).map((_, i) => (
      <Icon key={`empty-${i}`} as={FaRegStar} boxSize={3} />
    ))}
  </Flex>
);
