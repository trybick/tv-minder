import { Box, Flex, Heading, Icon, Text } from '@chakra-ui/react';
import { type IconType } from 'react-icons';
import { FiCalendar, FiHeart, FiSearch } from 'react-icons/fi';
import { LuChevronRight } from 'react-icons/lu';

type Step = { icon: IconType; label: string };

const HOW_IT_WORKS_STEPS: Step[] = [
  { icon: FiSearch, label: 'Search shows' },
  { icon: FiHeart, label: 'Track favorites' },
  { icon: FiCalendar, label: 'See your calendar' },
];

export const WelcomeHeroStrip = () => {
  return (
    <Box
      position="relative"
      textAlign="center"
      pt={{ base: 8, md: 12 }}
      pb={{ base: 2, md: 4 }}
      px={4}
    >
      <Box
        aria-hidden
        position="absolute"
        top="-160px"
        left="50%"
        transform="translateX(-50%)"
        w={{ base: '480px', md: '820px' }}
        h="360px"
        bg="radial-gradient(closest-side, var(--chakra-colors-cyan-500), transparent)"
        opacity={0.16}
        pointerEvents="none"
      />

      <Flex
        direction="column"
        align="center"
        gap={{ base: 3, md: 4 }}
        position="relative"
        maxW="640px"
        mx="auto"
      >
        <Heading
          as="h1"
          fontSize={{ base: '3xl', md: '4xl' }}
          fontWeight="bold"
          letterSpacing="tight"
          lineHeight="shorter"
          color="fg"
        >
          Your personal{' '}
          <Box
            as="span"
            bgGradient="to-r"
            gradientFrom="cyan.300"
            gradientTo="cyan.500"
            bgClip="text"
          >
            TV episode calendar
          </Box>
        </Heading>

        <Text
          color="fg.muted"
          fontSize={{ base: 'sm', md: 'md' }}
          lineHeight="tall"
          maxW="460px"
        >
          Track the shows you love and get a personalized schedule of every
          upcoming episode.
        </Text>

        <Flex
          align="center"
          justify="center"
          gap={{ base: 2, md: 1.5 }}
          flexWrap="wrap"
          mt={{ base: 1, md: 2 }}
        >
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <Flex key={step.label} align="center" gap={1.5}>
              <Flex
                align="center"
                gap={2}
                px={3}
                py={1.5}
                rounded="full"
                bg="whiteAlpha.50"
                borderWidth="1px"
                borderColor="whiteAlpha.100"
                fontSize={{ base: 'xs', md: 'sm' }}
                fontWeight="medium"
                color="fg"
              >
                <Flex
                  align="center"
                  justify="center"
                  boxSize="22px"
                  rounded="full"
                  bg="cyan.500/15"
                  color="cyan.300"
                  flexShrink={0}
                >
                  <Icon as={step.icon} boxSize="12px" />
                </Flex>
                {step.label}
              </Flex>
              {index < HOW_IT_WORKS_STEPS.length - 1 && (
                <Icon
                  as={LuChevronRight}
                  boxSize={4}
                  color="fg.subtle"
                  display={{ base: 'none', md: 'block' }}
                />
              )}
            </Flex>
          ))}
        </Flex>
      </Flex>
    </Box>
  );
};
