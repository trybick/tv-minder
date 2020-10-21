import { useDebouncedFunction } from '../debounce';
import { renderHook } from '@testing-library/react-hooks';

jest.useFakeTimers();

describe('debounce', () => {
  it('execute function only once', () => {
    const func: jest.Mock = jest.fn();
    const { result } = renderHook(() => useDebouncedFunction(func));
    for (let i = 0; i <= 100; i++) {
      result.current();
    }
    // fast-forward time
    jest.runAllTimers();
    expect(func).toBeCalledTimes(1);
  });
});
