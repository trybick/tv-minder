export const parseShowId = (id: string | undefined): number | null => {
  const parsed = Number(id);
  return id && Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};
