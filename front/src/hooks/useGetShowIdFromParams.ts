import { useParams } from 'react-router-dom';

export const useGetShowIdFromParams = (): number => {
  const { showId } = useParams<{ showId: string }>();
  return +showId;
};
