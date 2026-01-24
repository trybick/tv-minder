import { type FetchBaseQueryError } from '@reduxjs/toolkit/query';

type FetchErrorWithStatus = { status: number } | FetchBaseQueryError;

export const isFetchError = (e: unknown): e is FetchErrorWithStatus =>
  typeof e === 'object' && e !== null && 'status' in e;
